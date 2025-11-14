

import mlflow
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
from torchvision.models.feature_extraction import create_feature_extractor
import matplotlib.pyplot as plt
import random
from sklearn.model_selection import train_test_split
from PIL import Image
import torch.nn.functional as F
import albumentations as A
from albumentations.pytorch import ToTensorV2
import pandas as pd
import datetime
import time
import sys
import os


# Fix Unicode encoding issues on Windows
if sys.platform.startswith('win'):
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.detach())

# --- 1️ Definição da U-Net com encoder VGG16 ---
class UNetVGG16(nn.Module):
    def __init__(self, pretrained=True):
        super().__init__()
        # Use weights parameter instead of deprecated pretrained parameter
        if pretrained:
            vgg = models.vgg16_bn(weights=models.VGG16_BN_Weights.IMAGENET1K_V1)
        else:
            vgg = models.vgg16_bn(weights=None)
        features = list(vgg.features.children())

        # Encoder VGG16
        self.encoder0 = nn.Sequential(*features[:6])    # Conv1_1, Conv1_2
        self.encoder1 = nn.Sequential(*features[6:13])  # Conv2_1, Conv2_2
        self.encoder2 = nn.Sequential(*features[13:23]) # Conv3_1, Conv3_2, Conv3_3
        self.encoder3 = nn.Sequential(*features[23:33]) # Conv4_1, Conv4_2, Conv4_3
        self.encoder4 = nn.Sequential(*features[33:43]) # Conv5_1, Conv5_2, Conv5_3

        # Center
        self.center = nn.Sequential(
            nn.Conv2d(512, 512, kernel_size=3, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True),
            nn.Conv2d(512, 512, kernel_size=3, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True),
        )

        # Decoder
        self.up4 = nn.ConvTranspose2d(512, 512, kernel_size=2, stride=2)
        self.conv4 = nn.Sequential(
            nn.Conv2d(512 + 512, 512, kernel_size=3, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True),
            nn.Conv2d(512, 512, kernel_size=3, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True),
        )

        self.up3 = nn.ConvTranspose2d(512, 256, kernel_size=2, stride=2)
        self.conv3 = nn.Sequential(
            nn.Conv2d(256 + 256, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.Conv2d(256, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
        )

        self.up2 = nn.ConvTranspose2d(256, 128, kernel_size=2, stride=2)
        self.conv2 = nn.Sequential(
            nn.Conv2d(128 + 128, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.Conv2d(128, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
        )

        self.up1 = nn.ConvTranspose2d(128, 64, kernel_size=2, stride=2)
        self.conv1 = nn.Sequential(
            nn.Conv2d(64 + 64, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
        )

        self.up0 = nn.ConvTranspose2d(64, 64, kernel_size=2, stride=2)
        self.conv0 = nn.Sequential(
            nn.Conv2d(64, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
        )

        self.final_conv = nn.Conv2d(64, 1, kernel_size=1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        # Encoder
        e0 = self.encoder0(x)  # 64, 112x112
        e1 = self.encoder1(e0) # 128, 56x56
        e2 = self.encoder2(e1) # 256, 28x28
        e3 = self.encoder3(e2) # 512, 14x14
        e4 = self.encoder4(e3) # 512, 7x7

        center = self.center(e4) # 512, 7x7

        # Decoder
        d4 = self.up4(center)     # 512, 14x14
        d4 = torch.cat([d4, e3], dim=1)
        d4 = self.conv4(d4)

        d3 = self.up3(d4)         # 256, 28x28
        d3 = torch.cat([d3, e2], dim=1)
        d3 = self.conv3(d3)

        d2 = self.up2(d3)         # 128, 56x56
        d2 = torch.cat([d2, e1], dim=1)
        d2 = self.conv2(d2)

        d1 = self.up1(d2)         # 64, 112x112
        d1 = torch.cat([d1, e0], dim=1)
        d1 = self.conv1(d1)

        d0 = self.up0(d1)         # 64, 224x224
        d0 = self.conv0(d0)

        out = self.final_conv(d0)
        return self.sigmoid(out)

# --- 2️ Carregar pesos ---
print("iniciando o modelo")
model = UNetVGG16(pretrained=True)
state = torch.load(r"./vgg19.pth", map_location="cpu")
print("modelo carregado")
model.load_state_dict(state)
model.eval()
print("modelo carregado2")

print("iniciando o mlflow")
# --- 3️ Registrar no MLflow ---
mlflow.set_tracking_uri(os.getenv("MLFLOW_TRACKING_URI", "http://mlflow:5000"))
print("mlflow setado")
mlflow.set_experiment("Segmentação de Imagens - U-Net VGG19")
print("experiment setado")
with mlflow.start_run(run_name="Segmentação de Imagens - U-Net VGG19"):
    mlflow.pytorch.log_model(
        model,
        "model",
        registered_model_name="SolarDetect"
    )
print("modelo registrado")
print(" Modelo UNet-VGG16 registrado com sucesso no MLflow!")
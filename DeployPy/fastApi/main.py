from fastapi import FastAPI, Query
from fastapi.responses import StreamingResponse
import io
from PIL import Image
import torch
import torch.nn as nn
from torchvision import models
from pyFunctions import predict_from_coords  # sua função
import os

app = FastAPI()

# ---------------------------------------------------------
# 🔹 U-Net com encoder VGG16-BN (mesma do deploy.py)
# ---------------------------------------------------------
class UNetVGG16(nn.Module):
    def __init__(self, pretrained=False):
        super().__init__()
        if pretrained:
            vgg = models.vgg16_bn(weights=models.VGG16_BN_Weights.IMAGENET1K_V1)
        else:
            vgg = models.vgg16_bn(weights=None)
        features = list(vgg.features.children())

        self.encoder0 = nn.Sequential(*features[:6])
        self.encoder1 = nn.Sequential(*features[6:13])
        self.encoder2 = nn.Sequential(*features[13:23])
        self.encoder3 = nn.Sequential(*features[23:33])
        self.encoder4 = nn.Sequential(*features[33:43])

        self.center = nn.Sequential(
            nn.Conv2d(512, 512, 3, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True),
            nn.Conv2d(512, 512, 3, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True),
        )

        self.up4 = nn.ConvTranspose2d(512, 512, 2, stride=2)
        self.conv4 = nn.Sequential(
            nn.Conv2d(512 + 512, 512, 3, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True),
            nn.Conv2d(512, 512, 3, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True),
        )

        self.up3 = nn.ConvTranspose2d(512, 256, 2, stride=2)
        self.conv3 = nn.Sequential(
            nn.Conv2d(256 + 256, 256, 3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.Conv2d(256, 256, 3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
        )

        self.up2 = nn.ConvTranspose2d(256, 128, 2, stride=2)
        self.conv2 = nn.Sequential(
            nn.Conv2d(128 + 128, 128, 3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.Conv2d(128, 128, 3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
        )

        self.up1 = nn.ConvTranspose2d(128, 64, 2, stride=2)
        self.conv1 = nn.Sequential(
            nn.Conv2d(64 + 64, 64, 3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 64, 3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
        )

        self.up0 = nn.ConvTranspose2d(64, 64, 2, stride=2)
        self.conv0 = nn.Sequential(
            nn.Conv2d(64, 64, 3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 64, 3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
        )

        self.final_conv = nn.Conv2d(64, 1, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        e0 = self.encoder0(x)
        e1 = self.encoder1(e0)
        e2 = self.encoder2(e1)
        e3 = self.encoder3(e2)
        e4 = self.encoder4(e3)

        center = self.center(e4)

        d4 = self.up4(center)
        d4 = torch.cat([d4, e3], dim=1)
        d4 = self.conv4(d4)

        d3 = self.up3(d4)
        d3 = torch.cat([d3, e2], dim=1)
        d3 = self.conv3(d3)

        d2 = self.up2(d3)
        d2 = torch.cat([d2, e1], dim=1)
        d2 = self.conv2(d2)

        d1 = self.up1(d2)
        d1 = torch.cat([d1, e0], dim=1)
        d1 = self.conv1(d1)

        d0 = self.up0(d1)
        d0 = self.conv0(d0)

        out = self.final_conv(d0)
        return self.sigmoid(out)


# ---------------------------------------------------------
# 🔹 Carregamento do modelo local
# ---------------------------------------------------------
print("Carregando modelo local...")

try:
    model = UNetVGG16(pretrained=False)
    state_dict = torch.load("./vgg16_LR.pth", map_location="cpu")

    if "model_state_dict" in state_dict:
        state_dict = state_dict["model_state_dict"]

    model.load_state_dict(state_dict)
    model.eval()

    print("✅ Modelo UNet-VGG16 carregado com sucesso!")

except Exception as e:
    print(f"⚠️ Erro ao carregar modelo: {e}")
    model = nn.Sequential(
        nn.Conv2d(3, 64, 3, padding=1),
        nn.ReLU(),
        nn.Conv2d(64, 1, 1)
    )
    model.eval()
    print("⚙️ Modelo dummy carregado!")


# ---------------------------------------------------------
# 🔹 Endpoint principal
# ---------------------------------------------------------
@app.get("/predict")
def predict(lat: float = Query(...), lon: float = Query(...)):
    try:
        overlay, _ = predict_from_coords(lat, lon, model)
        img_bytes = io.BytesIO()
        Image.fromarray(overlay).save(img_bytes, format="PNG")
        img_bytes.seek(0)
        return StreamingResponse(img_bytes, media_type="image/png")
    except Exception as e:
        return {"error": f"Erro na predição: {str(e)}"}

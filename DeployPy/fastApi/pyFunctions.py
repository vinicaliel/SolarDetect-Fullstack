import io
import cv2
import math
import numpy as np
import requests
import tempfile
import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image

# =====================
# Utilidades
# =====================

def latlon_to_pixel(lat, lon, zoom):
    siny = math.sin(math.radians(lat))
    siny = min(max(siny, -0.9999), 0.9999)
    x = 256 * (0.5 + lon / 360.0) * (2 ** zoom)
    y = 256 * (0.5 - math.log((1 + siny) / (1 - siny)) / (4 * math.pi)) * (2 ** zoom)
    return int(x), int(y)

def download_centered_tile(lat, lon, zoom=19, tile_size=256):
    px, py = latlon_to_pixel(lat, lon, zoom)
    half = tile_size // 2
    top_left_x = px - half
    top_left_y = py - half

    min_tx = top_left_x // tile_size
    min_ty = top_left_y // tile_size
    max_tx = (top_left_x + tile_size - 1) // tile_size
    max_ty = (top_left_y + tile_size - 1) // tile_size

    mosaic = Image.new('RGB', ((max_tx - min_tx + 1) * tile_size,
                               (max_ty - min_ty + 1) * tile_size))
    for tx in range(min_tx, max_tx + 1):
        for ty in range(min_ty, max_ty + 1):
            url = f"https://mt1.google.com/vt/lyrs=s&x={tx}&y={ty}&z={zoom}"
            resp = requests.get(url)
            if resp.status_code == 200:
                tile = Image.open(io.BytesIO(resp.content)).convert("RGB")
                x_offset = (tx - min_tx) * tile_size
                y_offset = (ty - min_ty) * tile_size
                mosaic.paste(tile, (x_offset, y_offset))
    offset_x = top_left_x - min_tx * tile_size
    offset_y = top_left_y - min_ty * tile_size
    return mosaic.crop((offset_x, offset_y, offset_x + tile_size, offset_y + tile_size))

def overlay_mask(image, mask, color=(255, 0, 255), alpha=0.5):
    img = np.array(image)
    mask_bool = mask > 0
    color_layer = np.full_like(img, color, dtype=np.uint8)
    blended = img.copy()

    if not np.any(mask_bool):
        
        return img
     

    
    blended[mask_bool] = cv2.addWeighted(color_layer[mask_bool], alpha,
                                         img[mask_bool], 1 - alpha, 0)
    return blended

# =====================
# Predição via MLflow
# =====================

def predict_from_coords(lat, lon, model, device='cpu'):
    img = download_centered_tile(lat, lon)
    original = np.array(img)
    h, w, _ = original.shape

    transform = transforms.Compose([
        transforms.ToPILImage(),
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
    ])
    tensor = transform(original).unsqueeze(0).to(device)

    with torch.no_grad():
        pred = model(tensor)
        pred = F.interpolate(pred, size=(h, w), mode='bilinear', align_corners=False)
        mask = (pred.squeeze().cpu().numpy() > 0.5).astype(np.uint8)

    overlay = overlay_mask(original, mask)
    return overlay, mask

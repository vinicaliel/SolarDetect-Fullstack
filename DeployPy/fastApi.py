from fastapi import FastAPI, Query
from fastapi.responses import StreamingResponse
import io
from PIL import Image
import torch
import mlflow.pytorch
from pyFunctions import predict_from_coords  # sua função


mlflow.set_tracking_uri("http://127.0.0.1:5000")
app = FastAPI()
print("Carregando modelo...")

try:
    # Tentar carregar do Model Registry primeiro
    model = mlflow.pytorch.load_model("models:/SolarDetect/latest")
    print("Modelo carregado do Model Registry!")
except Exception as e:
    print(f"Erro ao carregar do Model Registry: {e}")
    print("Tentando carregar modelo local...")
    try:
        # Carregar modelo local (você precisa ter o arquivo do modelo)
        # Substitua pelo caminho do seu modelo treinado
        model = torch.load("model.pth", map_location="cpu")
        print("Modelo carregado localmente!")
    except Exception as e2:
        print(f"Erro ao carregar modelo local: {e2}")
        print("Usando modelo dummy para teste...")
        # Modelo dummy para teste
        import torch.nn as nn
        model = nn.Sequential(
            nn.Conv2d(3, 64, 3, padding=1),
            nn.ReLU(),
            nn.Conv2d(64, 1, 1)
        )
        print("Modelo dummy carregado!")

model.to("cpu").eval()
print("Modelo configurado com sucesso!")

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

# Detect Python - FastAPI + MLflow (Segmentação)

API FastAPI que baixa um tile por latitude/longitude, roda um modelo PyTorch de segmentação e retorna um PNG com a máscara sobreposta.

## Requisitos
- Python 3.10+ (recomendado 3.12)
- Windows PowerShell (no Windows)
- Dependências Python:
  - fastapi, uvicorn, pillow, requests, numpy, opencv-python, torch, torchvision, mlflow

Instalação recomendada (venv):

```powershell
# RODAR MLFLOW CRIANDO AMBIENTE (Caso Necessário - Mlflow não funcionar pelo cmd)

-pip install fastapi uvicorn pillow requests numpy opencv-python torch torchvision mlflow albulmentations - Dependências

-python -m venv .venv - Criar as Variáveis de ambiente

-.\.venv\Scripts\Activate.ps1 - iniciar o ambiente - mlflow

-pip install mlflow - instalar o mlflow dentro das variáveis de ambiente

-mlflow ui --backend-store-uri "./mlruns" --host 127.0.0.1 --port 5000 - iniciar a Ui -> mlflow.

-python -m pip install --upgrade pip - update pip se necessário
após esse passo, apenas essa linha de código para iniciar a conexão!!

```

Instalar somente o MLflow (opcional, caso queira instalar separadamente):

```powershell
pip install mlflow
```
## Estrutura do projeto
- `pythonapi.py`: API FastAPI e carregamento do modelo (MLflow, local ou dummy)
- `plot.py`: utilidades (download do tile, pré/pós-processamento, overlay)
- `mlruns/`: storage local padrão do MLflow quando não há servidor

Após iniciar, acesse `http://127.0.0.1:5000` no navegador.

Se você executar a UI, pode configurar o cliente para usar esse servidor (no código):
```python
import mlflow
mlflow.set_tracking_uri("http://127.0.0.1:5000")
```

## Executando a API
Na raiz do projeto:

```powershell
# Ativar venv (se ainda não estiver ativo)
.\.venv\Scripts\Activate.ps1

# Iniciar o servidor (PowerShell não usa '&&')
python -m uvicorn fastApi:app --reload --host 0.0.0.0 --port 8000 - Iniciar o fastApi para ter acesso ao Endpoint "predict"
```
- Endpoint: `GET /predict?lat=...&lon=...`

## Uso do endpoint (coordenadas com ponto)
A API espera números com ponto decimal (formato internacional). Exemplo (PowerShell):

```powershell
Invoke-WebRequest -Uri "http://localhost:8000/predict?lat=-8.060469&lon=-34.888073" -OutFile "test_prediction.png"
```

Exemplos:
- São Paulo: `lat=-23.5505&lon=-46.6333`
- Rio de Janeiro: `lat=-22.9068&lon=-43.1729`

Se utilizar vírgula como separador decimal (formato brasileiro), você receberá HTTP 422 (Unprocessable Entity).

## Problemas comuns
- 422 Unprocessable Entity: use ponto decimal, não vírgula.
- Modelo não encontrado no MLflow: confira o nome `VGG16_Placas`, versão/alias, ou use `model.pth` local.
- PowerShell não aceita `&&`: execute os comandos em linhas separadas.

FROM python:3.10-slim

WORKDIR /app

# Copia arquivos do projeto
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia código e modelo
COPY . .

# Garante que o modelo está no mesmo diretório do main.py
COPY vgg19.pth /app/vgg19.pth

# Expõe a porta do FastAPI
EXPOSE 8000

# Comando de inicialização
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

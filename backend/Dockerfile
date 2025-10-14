# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# system deps (faiss may need build deps — use faiss-cpu wheel in PyPI where available)
RUN apt-get update && apt-get install -y build-essential git

# copy and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONUNBUFFERED=1
ENV PORT=8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers"]

FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        gcc \
        g++ \
        libffi-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
COPY .env-docker ./.env
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "-u", "app/main.py"]

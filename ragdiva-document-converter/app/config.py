import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    RABBITMQ_HOST: str = os.getenv("RABBITMQ_HOST", "localhost")
    RABBITMQ_PORT: str = os.getenv("RABBITMQ_PORT", "5672")
    RABBITMQ_USER: str = os.getenv("RABBITMQ_USER", "guest")
    RABBITMQ_PASS: str = os.getenv("RABBITMQ_PASS", "guest")
    RABBITMQ_RETRY_COUNT: str = os.getenv("RABBITMQ_RETRY_COUNT", "8")
    RABBITMQ_RETRY_DELAY: str = os.getenv("RABBITMQ_RETRY_DELAY", "5")
    QUEUE_NAME: str = os.getenv("QUEUE_NAME", "document.convert")
    MAX_WORKERS: str = os.getenv("MAX_WORKERS", "2")
    MAIN_BACKEND: str = os.getenv("MAIN_BACKEND", "http://localhost:3000")
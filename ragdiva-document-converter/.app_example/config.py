# ============================================================
# config.py — Konfigurasi dari Environment Variables
# ============================================================
# Module ini bertanggung jawab untuk membaca konfigurasi dari
# environment variables. Dengan memisahkan config ke file sendiri:
# 1. Konfigurasi terpusat di satu tempat (single source of truth)
# 2. Mudah diganti tanpa ubah kode (cukup ubah .env)
# 3. Aman untuk production (credential tidak di-hardcode)
# ============================================================

import os
from dotenv import load_dotenv

# ── LOAD .ENV FILE ─────────────────────────────────────────
# load_dotenv() membaca file .env di root project dan memasukkan
# setiap baris (KEY=VALUE) ke os.environ.
# Jika dijalankan di Docker, environment variables biasanya
# sudah di-set via docker-compose.yaml, jadi .env tidak wajib.
# Fungsi ini TIDAK menimpa variable yang sudah ada di environment.
load_dotenv()


# ============================================================
# CLASS CONFIG
# ============================================================
# Menggunakan class agar semua konfigurasi terorganisir dan
# bisa diakses sebagai atribut: Config.RABBITMQ_HOST
# ============================================================
class Config:
    """
    Kelas konfigurasi yang membaca nilai dari environment variables.
    Menggunakan os.getenv(KEY, DEFAULT) — jika KEY tidak ditemukan
    di environment, maka DEFAULT yang digunakan.
    """

    # ── RabbitMQ Connection ─────────────────────────────────
    # Host: nama service di docker-compose atau IP address
    RABBITMQ_HOST: str = os.getenv("RABBITMQ_HOST", "localhost")

    # Port: 5672 adalah port default AMQP (protokol RabbitMQ)
    # int() diperlukan karena os.getenv selalu return string
    RABBITMQ_PORT: int = int(os.getenv("RABBITMQ_PORT", "5672"))

    # Kredensial: "guest/guest" adalah default RabbitMQ
    # PENTING: Ganti di production environment!
    RABBITMQ_USER: str = os.getenv("RABBITMQ_USER", "guest")
    RABBITMQ_PASS: str = os.getenv("RABBITMQ_PASS", "guest")

    # ── Queue Configuration ─────────────────────────────────
    # Nama queue yang akan di-consume oleh service ini.
    # Backend Node.js akan mengirim pesan ke queue dengan nama ini.
    QUEUE_NAME: str = os.getenv("QUEUE_NAME", "document_convert")

    # ── Thread Pool ─────────────────────────────────────────
    # Jumlah worker thread untuk konversi dokumen secara paralel.
    # Contoh: MAX_WORKERS=4 berarti 4 konversi bisa berjalan
    # bersamaan. Konversi ke-5 dan seterusnya akan ANTRI
    # sampai ada thread yang selesai.
    MAX_WORKERS: int = int(os.getenv("MAX_WORKERS", "4"))

    # ── Retry Configuration ─────────────────────────────────
    # Saat startup, RabbitMQ mungkin belum siap (terutama di Docker).
    # Kita perlu retry mechanism agar service tidak langsung crash.
    RABBITMQ_RETRY_COUNT: int = int(os.getenv("RABBITMQ_RETRY_COUNT", "5"))
    RABBITMQ_RETRY_DELAY: int = int(os.getenv("RABBITMQ_RETRY_DELAY", "5"))

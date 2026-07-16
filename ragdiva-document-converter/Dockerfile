# ============================================================
# Dockerfile untuk ragdiva-document-converter
# ============================================================
# Dockerfile adalah "resep" untuk membuat Docker image.
# Docker image = snapshot lingkungan yang berisi OS, Python,
# dan semua dependency yang dibutuhkan service kita.
# ============================================================

# ── BASE IMAGE ──────────────────────────────────────────────
# Gunakan Python 3.12 dengan Alpine Linux (image ringan ~50MB).
# "slim" lebih kecil dari image default karena tidak menyertakan
# compiler dan tools yang tidak diperlukan saat runtime.
FROM python:3.12-slim

# ── WORKING DIRECTORY ──────────────────────────────────────
# Set direktori kerja di dalam container.
# Semua perintah selanjutnya (COPY, RUN, CMD) akan relatif
# terhadap direktori ini.
WORKDIR /app

# ── INSTALL SYSTEM DEPENDENCIES ────────────────────────────
# Beberapa library Python (seperti markitdown) membutuhkan
# system-level packages untuk bisa diinstall.
# - gcc, g++: compiler C/C++ untuk compile extension Python
# - libffi-dev: library untuk Foreign Function Interface
# - Setelah install, bersihkan cache apt agar image tetap kecil.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        gcc \
        g++ \
        libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# ── COPY & INSTALL PYTHON DEPENDENCIES ─────────────────────
# Salin requirements.txt terlebih dahulu (SEBELUM copy source code).
# Ini memanfaatkan Docker layer caching:
# - Jika requirements.txt tidak berubah, Docker akan menggunakan
#   cache dari build sebelumnya (tidak perlu pip install ulang).
# - Ini mempercepat build saat hanya source code yang berubah.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── COPY SOURCE CODE ──────────────────────────────────────
# Salin semua source code aplikasi ke dalam container.
# Ini dilakukan TERAKHIR agar perubahan kode tidak menginvalidasi
# cache layer pip install di atas.
COPY . .

# ── JALANKAN APLIKASI ─────────────────────────────────────
# CMD menentukan perintah yang dijalankan saat container start.
# - "python" = interpreter Python
# - "-u" = unbuffered output, agar print() langsung terlihat
#   di docker logs (tanpa buffer delay)
# - "app/main.py" = entry point aplikasi kita
CMD ["python", "-u", "app/main.py"]

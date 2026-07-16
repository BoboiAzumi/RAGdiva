# ============================================================
# main.py — Entry Point Service Document Converter
# ============================================================
# File ini adalah titik masuk (entry point) aplikasi.
# Saat dijalankan, file ini akan:
# 1. Setup logging
# 2. Connect ke RabbitMQ (dengan retry mechanism)
# 3. Deklarasi queue
# 4. Mulai consuming message (menunggu & memproses pesan)
#
# KONSEP ENTRY POINT:
# ===================
# Setiap aplikasi Python punya satu file yang dijalankan pertama.
# File ini biasanya hanya berisi "orkestrasi" — memanggil dan
# menghubungkan module-module lain. Logic berat ada di module
# masing-masing (converter.py, worker.py).
# ============================================================

import sys
import time
import logging
import signal

import pika

from app.config import Config
from app.worker import ConversionWorker

# ============================================================
# SETUP LOGGING
# ============================================================
# Konfigurasi logging agar semua log di seluruh aplikasi
# memiliki format yang sama dan konsisten.
#
# Format: "2026-07-14 18:20:00 - app.worker - INFO - Pesan log"
#   %(asctime)s  = Waktu kejadian
#   %(name)s     = Nama module (misal: app.worker)
#   %(levelname)s = Level log (DEBUG/INFO/WARNING/ERROR)
#   %(message)s  = Pesan yang di-log
#
# Level INFO berarti: tampilkan INFO, WARNING, ERROR, CRITICAL
# (abaikan DEBUG yang terlalu detail).
# ============================================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def create_connection() -> pika.BlockingConnection:
    """
    Membuat koneksi ke RabbitMQ dengan retry mechanism.

    KENAPA PERLU RETRY?
    ===================
    Saat menggunakan Docker Compose, semua service start bersamaan.
    Tapi RabbitMQ butuh waktu ~10-30 detik untuk fully ready.
    Tanpa retry, service Python akan crash karena RabbitMQ belum siap.

    Dengan retry: coba connect → gagal → tunggu 5 detik → coba lagi
    → ... sampai berhasil atau mencapai batas percobaan.

    KONSEP BLOCKING CONNECTION:
    ===========================
    pika.BlockingConnection = koneksi synchronous (blocking).
    Artinya setiap operasi (connect, publish, consume) akan
    MENUNGGU sampai selesai sebelum lanjut ke baris berikutnya.

    Ada juga SelectConnection (async) yang lebih kompleks tapi
    lebih efisien untuk high-throughput. Untuk pembelajaran,
    BlockingConnection lebih mudah dipahami.

    Return:
    -------
    pika.BlockingConnection — Koneksi aktif ke RabbitMQ.

    Raises:
    -------
    SystemExit — Jika gagal connect setelah semua percobaan.
    """
    for attempt in range(1, Config.RABBITMQ_RETRY_COUNT + 1):
        try:
            logger.info(
                f"Mencoba connect ke RabbitMQ "
                f"({attempt}/{Config.RABBITMQ_RETRY_COUNT})..."
            )

            # ── CONNECTION PARAMETERS ──────────────────────
            # ConnectionParameters menentukan detail koneksi:
            #
            # host: Alamat RabbitMQ server
            #   - "localhost" jika di mesin yang sama
            #   - "rabbitmq" jika pakai Docker Compose (nama service)
            #
            # port: Port AMQP (default 5672)
            #   - 5672 = AMQP protocol (untuk aplikasi)
            #   - 15672 = Management UI (untuk browser monitoring)
            #
            # credentials: Username & password
            #   - PlainCredentials = autentikasi dasar (user + pass)
            #   - "guest/guest" hanya bisa connect dari localhost
            #     (aman untuk development, JANGAN untuk production)
            #
            # heartbeat: Interval (detik) untuk "detak jantung"
            #   - Client & server saling kirim heartbeat
            #   - Jika tidak ada heartbeat selama 2x interval,
            #     koneksi dianggap mati dan ditutup
            #   - 600 detik = 10 menit (cukup longgar untuk konversi
            #     dokumen besar yang memakan waktu lama)
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(
                    host=Config.RABBITMQ_HOST,
                    port=Config.RABBITMQ_PORT,
                    credentials=pika.PlainCredentials(
                        Config.RABBITMQ_USER,
                        Config.RABBITMQ_PASS
                    ),
                    heartbeat=600
                )
            )

            logger.info("Berhasil connect ke RabbitMQ!")
            return connection

        except pika.exceptions.AMQPConnectionError as e:
            # ── HANDLE CONNECTION ERROR ────────────────────
            # AMQPConnectionError = gagal connect (server belum ready,
            # salah host/port, credential salah, dll.)
            logger.warning(
                f"Gagal connect (attempt {attempt}): {e}"
            )

            if attempt < Config.RABBITMQ_RETRY_COUNT:
                # Masih ada sisa percobaan → tunggu lalu coba lagi
                logger.info(
                    f"Menunggu {Config.RABBITMQ_RETRY_DELAY} detik "
                    f"sebelum retry..."
                )
                time.sleep(Config.RABBITMQ_RETRY_DELAY)
            else:
                # Semua percobaan habis → exit dengan error
                logger.error(
                    "Gagal connect ke RabbitMQ setelah "
                    f"{Config.RABBITMQ_RETRY_COUNT} percobaan. Exiting."
                )
                sys.exit(1)


def main():
    """
    Fungsi utama yang menjalankan service.

    Alur:
    1. Connect ke RabbitMQ
    2. Buat channel
    3. Deklarasi queue
    4. Set QoS (prefetch)
    5. Daftarkan callback consumer
    6. Mulai consuming (infinite loop menunggu message)
    """

    # ── CONNECT KE RABBITMQ ────────────────────────────────
    connection = create_connection()

    # ── BUAT CHANNEL ───────────────────────────────────────
    # Channel = "jalur komunikasi" di dalam connection.
    # Satu connection bisa punya banyak channel.
    #
    # ANALOGI:
    # - Connection = kabel internet dari rumah ke ISP
    # - Channel = tab browser yang berbeda-beda
    # Setiap tab (channel) bisa melakukan hal berbeda,
    # tapi semua lewat kabel (connection) yang sama.
    #
    # KENAPA CHANNEL, BUKAN MULTIPLE CONNECTION?
    # Connection = heavy resource (TCP socket, TLS handshake)
    # Channel = lightweight (multiplexed di atas connection)
    # Jadi lebih efisien buat 1 connection + banyak channel.
    channel = connection.channel()

    # ── DEKLARASI QUEUE ────────────────────────────────────
    # queue_declare() membuat queue jika belum ada,
    # atau memastikan queue sudah ada dengan konfigurasi yang benar.
    #
    # Parameter:
    # - queue: Nama queue
    # - durable=True: Queue BERTAHAN setelah RabbitMQ restart.
    #   Tanpa durable, queue hilang saat RabbitMQ restart
    #   dan semua message di dalamnya juga hilang.
    #
    # PENTING: Producer (Node.js) dan Consumer (Python) HARUS
    # mendeklarasi queue dengan parameter yang SAMA.
    # Jika berbeda (misal satu durable=True, satu durable=False),
    # RabbitMQ akan throw error.
    channel.queue_declare(
        queue=Config.QUEUE_NAME,
        durable=True
    )

    # ── SET QOS (QUALITY OF SERVICE) ───────────────────────
    # basic_qos(prefetch_count=N) membatasi jumlah message
    # yang dikirim ke consumer SEBELUM di-acknowledge.
    #
    # ANALOGI PREFETCH:
    # Bayangkan antrian kasir supermarket:
    # - prefetch_count=1: Kasir ambil 1 barang, scan, baru ambil berikutnya
    # - prefetch_count=10: Kasir ambil 10 barang sekaligus, scan satu-satu
    #
    # Kita set = MAX_WORKERS agar:
    # - Thread pool terisi optimal (tidak ada thread nganggur)
    # - Tapi tidak terlalu banyak message menumpuk di memory
    #
    # Jika prefetch terlalu besar dan consumer crash, semua
    # message yang sudah di-deliver tapi belum di-ack akan
    # dikirim ulang ke consumer lain (message tidak hilang,
    # tapi ada delay).
    channel.basic_qos(prefetch_count=Config.MAX_WORKERS)

    # ── BUAT WORKER ────────────────────────────────────────
    # ConversionWorker mengelola thread pool dan bridge antara
    # RabbitMQ message dengan converter logic.
    worker = ConversionWorker(connection)

    # ── DAFTARKAN CONSUMER ─────────────────────────────────
    # basic_consume() mendaftarkan callback function yang akan
    # dipanggil setiap kali ada message baru di queue.
    #
    # Parameter:
    # - queue: Nama queue yang di-consume
    # - on_message_callback: Fungsi yang dipanggil per-message
    # - auto_ack=False: MANUAL acknowledgment mode
    #
    # TENTANG AUTO_ACK:
    # - auto_ack=True: RabbitMQ langsung hapus message setelah
    #   dikirim ke consumer (bahkan sebelum diproses).
    #   BAHAYA: Jika consumer crash, message hilang selamanya!
    #
    # - auto_ack=False: Message baru dihapus setelah consumer
    #   mengirim ACK (basic_ack). Jika consumer crash sebelum
    #   ACK, message dikirim ulang ke consumer lain.
    #   AMAN: Message tidak pernah hilang (at-least-once delivery).
    #
    # Kita gunakan auto_ack=False karena konversi dokumen
    # memakan waktu dan kita tidak mau kehilangan message.
    channel.basic_consume(
        queue=Config.QUEUE_NAME,
        on_message_callback=worker.process_message,
        auto_ack=False
    )

    # ── GRACEFUL SHUTDOWN HANDLER ──────────────────────────
    # signal.signal() mendaftarkan handler untuk OS signals.
    #
    # SIGINT = signal dari Ctrl+C di terminal
    # SIGTERM = signal dari docker stop atau kill command
    #
    # Saat signal diterima:
    # 1. Hentikan consuming (stop menerima message baru)
    # 2. Shutdown thread pool (tunggu konversi yang sedang berjalan)
    # 3. Tutup koneksi RabbitMQ
    # 4. Exit program
    def graceful_shutdown(signum, frame):
        """Handler untuk shutdown signal (Ctrl+C atau docker stop)."""
        logger.info(f"Menerima signal {signum}, memulai shutdown...")
        channel.stop_consuming()     # Stop terima message baru
        worker.shutdown()            # Tunggu thread pool selesai
        connection.close()           # Tutup koneksi RabbitMQ
        logger.info("Service berhasil di-shutdown. Bye!")
        sys.exit(0)

    signal.signal(signal.SIGINT, graceful_shutdown)
    signal.signal(signal.SIGTERM, graceful_shutdown)

    # ── MULAI CONSUMING ───────────────────────────────────
    # start_consuming() memulai infinite loop:
    # 1. Tunggu message dari RabbitMQ
    # 2. Saat message datang → panggil callback (worker.process_message)
    # 3. Kembali ke langkah 1 (loop selamanya)
    #
    # Loop ini hanya berhenti saat:
    # - channel.stop_consuming() dipanggil
    # - Koneksi terputus
    # - Exception terjadi
    logger.info(
        f"Service siap! Menunggu message di queue '{Config.QUEUE_NAME}'..."
    )
    logger.info(
        f"Thread pool: {Config.MAX_WORKERS} workers | "
        f"Prefetch: {Config.MAX_WORKERS} messages"
    )

    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        # ── HANDLE CTRL+C ─────────────────────────────────
        # Pada beberapa OS, KeyboardInterrupt bisa terjadi
        # sebelum signal handler sempat dieksekusi.
        # Kita handle di sini sebagai safety net.
        logger.info("KeyboardInterrupt, shutting down...")
        worker.shutdown()
        connection.close()


# ============================================================
# PYTHON IDIOM: if __name__ == "__main__"
# ============================================================
# Baris ini memastikan main() HANYA dijalankan saat file ini
# dieksekusi langsung (python app/main.py), BUKAN saat di-import
# oleh module lain (from app.main import ...).
#
# __name__ = variabel spesial Python:
# - Bernilai "__main__" jika file dijalankan langsung
# - Bernilai nama module (misal "app.main") jika di-import
#
# Ini adalah best practice Python yang sangat umum.
# ============================================================
if __name__ == "__main__":
    main()

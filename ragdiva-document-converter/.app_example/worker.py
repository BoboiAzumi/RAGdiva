# ============================================================
# worker.py — Thread Pool Manager
# ============================================================
# Module ini mengelola thread pool untuk memproses konversi
# dokumen secara concurrent (bersamaan).
#
# KONSEP UTAMA: ThreadPoolExecutor
# ================================================
# Bayangkan sebuah restoran dengan 4 koki (threads):
# - Pesanan 1-4: Langsung ditangani masing-masing koki
# - Pesanan 5+: ANTRI di meja kasir sampai ada koki yang selesai
# - Saat koki selesai masak, dia ambil pesanan berikutnya dari antrian
#
# Ini PERSIS cara kerja ThreadPoolExecutor:
# - max_workers = jumlah koki (thread)
# - submit() = memasukkan pesanan baru
# - Jika semua thread sibuk, task masuk antrian OTOMATIS
# - Python mengelola antrian internal ini untuk kita
#
# KENAPA THREAD POOL?
# ================================================
# 1. TANPA thread pool: Setiap request = buat thread baru.
#    Jika ada 1000 request bersamaan = 1000 thread → crash!
# 2. DENGAN thread pool: Maksimal 4 thread berjalan bersamaan.
#    Request ke-5+ antri dengan aman → resource terkontrol.
# ============================================================

import json
import logging
from concurrent.futures import ThreadPoolExecutor

import pika

from app.config import Config
from app.converter import convert_document

# ── SETUP LOGGING ──────────────────────────────────────────
# Logging = mencatat aktivitas program ke console/file.
# Lebih baik dari print() karena:
# 1. Ada level (DEBUG, INFO, WARNING, ERROR) → bisa difilter
# 2. Ada timestamp otomatis
# 3. Bisa diarahkan ke file, service monitoring, dll.
logger = logging.getLogger(__name__)
# __name__ = nama module saat ini ("app.worker")
# Ini membantu identifikasi sumber log saat debugging.


# ============================================================
# CLASS CONVERSION WORKER
# ============================================================
class ConversionWorker:
    """
    Worker yang mengelola thread pool untuk konversi dokumen.

    Kelas ini menjembatani antara RabbitMQ (message broker)
    dan converter.py (logic konversi). Alurnya:

    1. Menerima message dari RabbitMQ (berisi file_path)
    2. Submit task konversi ke thread pool
    3. Saat konversi selesai, kirim hasilnya kembali ke RabbitMQ

    Atribut:
    --------
    connection : pika.BlockingConnection
        Koneksi ke RabbitMQ (dibutuhkan untuk publish result)
    executor : ThreadPoolExecutor
        Pool of worker threads untuk konversi
    """

    def __init__(self, connection: pika.BlockingConnection):
        """
        Inisialisasi worker dengan koneksi RabbitMQ.

        Parameter:
        ----------
        connection : pika.BlockingConnection
            Koneksi aktif ke RabbitMQ. Koneksi ini digunakan
            untuk membuat channel baru saat mengirim hasil
            konversi kembali ke client.
        """
        self.connection = connection

        # ── BUAT THREAD POOL ───────────────────────────────
        # ThreadPoolExecutor(max_workers=N) membuat pool
        # dengan maksimal N thread.
        #
        # PENTING tentang max_workers:
        # - Terlalu kecil (1-2): Konversi lambat, antrian panjang
        # - Terlalu besar (50+): Boros memory, context switching
        # - Sweet spot: 2-8 tergantung CPU dan tipe pekerjaan
        #
        # Karena konversi dokumen adalah I/O-bound (baca file,
        # parse content), bukan CPU-bound, thread pool cocok.
        # Untuk CPU-bound tasks, gunakan ProcessPoolExecutor.
        self.executor = ThreadPoolExecutor(max_workers=Config.MAX_WORKERS)

        logger.info(f"Thread pool dibuat dengan {Config.MAX_WORKERS} workers")

    def process_message(
        self,
        channel: pika.channel.Channel,
        method: pika.spec.Basic.Deliver,
        properties: pika.spec.BasicProperties,
        body: bytes
    ):
        """
        Callback function yang dipanggil setiap kali ada message
        baru dari RabbitMQ.

        KONSEP CALLBACK:
        ================
        Callback = fungsi yang kita "daftarkan" untuk dipanggil
        oleh sistem lain saat event tertentu terjadi.
        Dalam kasus ini: RabbitMQ memanggil fungsi ini setiap
        kali ada message baru di queue.

        Parameter (diberikan oleh Pika/RabbitMQ):
        ------------------------------------------
        channel : Channel
            Channel RabbitMQ tempat message diterima.
            Digunakan untuk basic_ack (konfirmasi message).

        method : Basic.Deliver
            Metadata delivery: exchange, routing_key,
            delivery_tag (ID unik message untuk ack).

        properties : BasicProperties
            Properties message yang dikirim oleh producer:
            - reply_to: Nama queue untuk mengirim response
            - correlation_id: ID unik untuk mencocokkan
              request dengan response (RPC pattern)

        body : bytes
            Isi message dalam bentuk bytes.
            Kita decode ke string lalu parse sebagai JSON.
        """
        # ── DECODE MESSAGE ─────────────────────────────────
        # body adalah bytes (b'{"file_path": "/data/doc.pdf"}')
        # .decode("utf-8") mengubahnya menjadi string Python
        # json.loads() mem-parse string JSON menjadi dict Python
        try:
            message = json.loads(body.decode("utf-8"))
            file_path = message.get("file_path", "")

            logger.info(f"Menerima request konversi: {file_path}")

            # ── SUBMIT KE THREAD POOL ──────────────────────
            # executor.submit(fn, *args) mengirim fungsi ke pool:
            # - Jika ada thread kosong → langsung dieksekusi
            # - Jika semua thread sibuk → masuk ANTRIAN otomatis
            #
            # submit() mengembalikan Future object yang merepresentasikan
            # hasil komputasi yang BELUM selesai.
            #
            # PENTING: submit() sendiri TIDAK blocking!
            # Artinya kode di bawah langsung lanjut tanpa menunggu
            # konversi selesai. Ini yang memungkinkan kita menerima
            # message berikutnya sambil konversi masih berjalan.
            future = self.executor.submit(convert_document, file_path)

            # ── CALLBACK SAAT KONVERSI SELESAI ─────────────
            # add_done_callback() mendaftarkan fungsi yang akan
            # dipanggil SETELAH future selesai (berhasil/gagal).
            #
            # Kita gunakan lambda untuk membuat closure yang
            # "menangkap" variabel yang dibutuhkan:
            # - properties: untuk reply_to dan correlation_id
            # - method: untuk delivery_tag (ack)
            # - channel: untuk basic_ack
            #
            # KONSEP CLOSURE:
            # Lambda ini "mengingat" variabel dari scope luar
            # (properties, method, channel) meskipun process_message()
            # sudah selesai dieksekusi. Ini memungkinkan callback
            # mengakses variabel tersebut nanti saat future selesai.
            future.add_done_callback(
                lambda fut: self._on_conversion_done(
                    fut, properties, method.delivery_tag, channel
                )
            )

        except json.JSONDecodeError as e:
            # ── HANDLE JSON INVALID ────────────────────────
            # Jika body bukan JSON valid, langsung kirim error
            # tanpa masuk thread pool (tidak perlu thread untuk ini).
            logger.error(f"Message bukan JSON valid: {e}")
            self._send_error_reply(
                channel, properties, method.delivery_tag,
                "Format message tidak valid (bukan JSON)"
            )

    def _on_conversion_done(
        self,
        future,
        properties: pika.spec.BasicProperties,
        delivery_tag: int,
        channel: pika.channel.Channel
    ):
        """
        Callback yang dipanggil setelah konversi selesai.

        PENTING: Callback ini berjalan di THREAD POOL (bukan main thread).
        Pika (library RabbitMQ) TIDAK thread-safe untuk operasi publish
        langsung dari thread lain. Oleh karena itu, kita gunakan
        connection.add_callback_threadsafe() untuk menjadwalkan
        operasi publish di main thread (I/O loop thread Pika).

        KONSEP THREAD SAFETY:
        =====================
        Thread safety = aman diakses dari beberapa thread bersamaan.
        Pika connection TIDAK thread-safe, artinya jika 2 thread
        mencoba publish bersamaan, bisa terjadi race condition
        (data corrupt, crash, dll).

        Solusi: add_callback_threadsafe() menjadwalkan operasi
        untuk dieksekusi di main thread Pika, menghindari konflik.

        Parameter:
        ----------
        future : Future
            Object yang berisi hasil konversi (atau exception).
        properties : BasicProperties
            Properties dari message asli (berisi reply_to, correlation_id).
        delivery_tag : int
            ID unik message untuk acknowledgment.
        channel : Channel
            Channel untuk publish result dan ack.
        """

        try:
            # ── AMBIL HASIL DARI FUTURE ────────────────────
            # future.result() mengambil return value dari
            # convert_document(). Jika convert_document() throw
            # exception, future.result() juga akan throw exception.
            result = future.result()

        except Exception as e:
            # ── HANDLE EXCEPTION DI THREAD ─────────────────
            # Jika konversi crash (unexpected error), tangkap
            # dan buat error response.
            logger.error(f"Exception dalam thread konversi: {e}")
            result = {
                "success": False,
                "data": None,
                "error": f"Internal error: {str(e)}"
            }

        # ── SERIALIZE RESULT KE JSON ───────────────────────
        # json.dumps() mengubah dict Python menjadi string JSON.
        # ensure_ascii=False memastikan karakter non-ASCII
        # (misal huruf Indonesia: é, ñ) tidak di-escape.
        response_body = json.dumps(result, ensure_ascii=False)

        # ── JADWALKAN PUBLISH DI MAIN THREAD ───────────────
        # add_callback_threadsafe() mengirim fungsi ke event loop
        # Pika di main thread. Ini WAJIB karena kita sedang di
        # worker thread, dan Pika tidak thread-safe.
        #
        # Fungsi yang dijadwalkan:
        # 1. Publish result ke reply_to queue
        # 2. Acknowledge message (basic_ack)
        self.connection.add_callback_threadsafe(
            lambda: self._publish_and_ack(
                channel, properties, delivery_tag, response_body
            )
        )

    def _publish_and_ack(
        self,
        channel: pika.channel.Channel,
        properties: pika.spec.BasicProperties,
        delivery_tag: int,
        response_body: str
    ):
        """
        Mengirim hasil konversi ke reply queue dan acknowledge message.
        Fungsi ini SELALU dijalankan di main thread (via add_callback_threadsafe).

        KONSEP ACKNOWLEDGMENT (ACK):
        ============================
        Acknowledgment = konfirmasi ke RabbitMQ bahwa message sudah
        berhasil diproses. Tanpa ack:
        - RabbitMQ menganggap message belum diproses
        - Jika consumer mati, message dikirim ulang ke consumer lain
        - Ini mencegah message hilang (at-least-once delivery)

        Alur:
        1. basic_publish() → kirim result ke reply_to queue
        2. basic_ack() → konfirmasi message sudah diproses

        Parameter:
        ----------
        channel : Channel
            Channel RabbitMQ untuk publish dan ack.
        properties : BasicProperties
            Properties asli (berisi reply_to, correlation_id).
        delivery_tag : int
            ID message untuk di-ack.
        response_body : str
            JSON string hasil konversi.
        """
        try:
            # ── PUBLISH RESULT ─────────────────────────────
            # basic_publish() mengirim message ke exchange/queue.
            #
            # Parameter:
            # - exchange="": Default exchange (direct routing)
            # - routing_key=reply_to: Kirim ke queue yang diminta
            #   oleh producer (backend Node.js)
            # - body: Isi message (JSON result)
            # - properties: Kita sertakan correlation_id agar
            #   producer bisa mencocokkan response ini dengan
            #   request yang dikirim sebelumnya.
            #
            # KONSEP RPC (Remote Procedure Call) PATTERN:
            # ==========================================
            # 1. Client (Node.js) membuat queue temporary (callback queue)
            # 2. Client publish message dengan:
            #    - reply_to = nama callback queue
            #    - correlation_id = ID unik (UUID)
            # 3. Server (Python) proses message, lalu publish result ke
            #    reply_to queue dengan correlation_id yang SAMA
            # 4. Client menerima result, cocokkan correlation_id
            #    untuk tahu ini response dari request yang mana
            channel.basic_publish(
                exchange="",
                routing_key=properties.reply_to,
                body=response_body.encode("utf-8"),
                properties=pika.BasicProperties(
                    # Kirim balik correlation_id yang sama!
                    # Ini kunci dari RPC pattern — tanpa ini,
                    # client tidak tahu response ini untuk request mana.
                    correlation_id=properties.correlation_id,
                    # content_type menandakan format body (JSON)
                    content_type="application/json"
                )
            )

            # ── ACKNOWLEDGE MESSAGE ────────────────────────
            # basic_ack() memberitahu RabbitMQ: "Message ini sudah
            # berhasil saya proses, silakan hapus dari queue."
            #
            # delivery_tag = ID unik per-message per-channel.
            # RabbitMQ menggunakan ini untuk tracking message mana
            # yang sudah di-ack dan mana yang belum.
            #
            # JIKA TIDAK DI-ACK:
            # - Message tetap di queue (status: unacknowledged)
            # - Jika consumer disconnect, message dikirim ulang
            #   ke consumer lain (redelivery)
            channel.basic_ack(delivery_tag=delivery_tag)

            logger.info(
                f"Result dikirim ke {properties.reply_to} "
                f"(correlation_id: {properties.correlation_id})"
            )

        except Exception as e:
            logger.error(f"Gagal publish result: {e}")
            # Tetap ack agar message tidak stuck di queue selamanya.
            # Di production, bisa implementasi dead letter queue
            # untuk message yang gagal diproses.
            try:
                channel.basic_ack(delivery_tag=delivery_tag)
            except Exception:
                pass

    def _send_error_reply(
        self,
        channel: pika.channel.Channel,
        properties: pika.spec.BasicProperties,
        delivery_tag: int,
        error_message: str
    ):
        """
        Mengirim error response langsung (tanpa thread pool).

        Digunakan untuk error yang terjadi SEBELUM konversi dimulai,
        misalnya: message bukan JSON valid, field wajib tidak ada, dll.

        Karena dipanggil dari main thread (callback RabbitMQ),
        kita bisa langsung publish tanpa add_callback_threadsafe().
        """
        result = {
            "success": False,
            "data": None,
            "error": error_message
        }
        response_body = json.dumps(result, ensure_ascii=False)

        try:
            channel.basic_publish(
                exchange="",
                routing_key=properties.reply_to,
                body=response_body.encode("utf-8"),
                properties=pika.BasicProperties(
                    correlation_id=properties.correlation_id,
                    content_type="application/json"
                )
            )
            channel.basic_ack(delivery_tag=delivery_tag)
        except Exception as e:
            logger.error(f"Gagal kirim error reply: {e}")

    def shutdown(self):
        """
        Shutdown thread pool secara graceful.

        executor.shutdown(wait=True):
        - wait=True: Tunggu semua task yang sedang berjalan selesai
          sebelum shutdown. Ini mencegah konversi terpotong di tengah.
        - wait=False: Langsung shutdown tanpa menunggu (data bisa corrupt)

        KONSEP GRACEFUL SHUTDOWN:
        ========================
        Saat service diminta berhenti (Ctrl+C, docker stop):
        1. Berhenti menerima message baru
        2. Tunggu konversi yang sedang berjalan sampai selesai
        3. Baru kemudian tutup koneksi dan exit

        Ini penting agar tidak ada konversi yang terpotong dan
        message yang hilang (karena sudah di-consume tapi belum di-ack).
        """
        logger.info("Shutting down thread pool...")
        self.executor.shutdown(wait=True)
        logger.info("Thread pool berhasil di-shutdown")

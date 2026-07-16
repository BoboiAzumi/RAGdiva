// ============================================================
// document-converter-service.ts
// ============================================================
// File ini adalah REFERENSI BELAJAR untuk memahami cara
// berkomunikasi dengan RabbitMQ dari Node.js menggunakan amqplib.
//
// FILE INI BELUM DIINTEGRASIKAN ke routes/handlers.
// Tujuannya murni untuk mempelajari konsep:
// 1. Connect ke RabbitMQ dari Node.js
// 2. RPC Pattern (Request-Reply)
// 3. Correlation ID untuk mencocokkan request-response
// 4. Callback queue (exclusive, auto-delete)
//
// DEPENDENCY YANG DIBUTUHKAN (belum di-install):
//   npm install amqplib
//   npm install -D @types/amqplib
// ============================================================

import amqplib from "amqplib";
import type { Channel, Connection, ConsumeMessage } from "amqplib"
import { randomUUID } from "crypto";

// ============================================================
// INTERFACE — Tipe data untuk TypeScript
// ============================================================

/**
 * Hasil konversi yang diterima dari Python service.
 * Interface ini HARUS cocok dengan format JSON yang dikirim
 * oleh Python converter (app/converter.py).
 */
interface ConversionResult {
  success: boolean;
  data: {
    metadata: {
      filename: string;
      file_size: number;
      file_type: string;
      converted_at: string;
    };
    content: string; // Markdown content
  } | null;
  error: string | null;
}

/**
 * Konfigurasi koneksi RabbitMQ.
 * Bisa di-extend sesuai kebutuhan (SSL, vhost, dll).
 */
interface RabbitMQConfig {
  host: string;
  port: number;
  username: string;
  password: string;
}

// ============================================================
// CLASS DOCUMENT CONVERTER SERVICE
// ============================================================
/**
 * Service untuk mengirim request konversi dokumen ke Python
 * service melalui RabbitMQ, menggunakan RPC pattern.
 *
 * KONSEP RPC (Remote Procedure Call) di RabbitMQ:
 * ===============================================
 * RPC memungkinkan kita "memanggil fungsi" di service lain
 * seolah-olah fungsi itu ada di local, padahal sebenarnya
 * request dikirim via message broker (RabbitMQ).
 *
 * Alur RPC:
 * 1. Client buat exclusive queue (callback queue) untuk menerima response
 * 2. Client publish message ke queue server dengan:
 *    - reply_to: nama callback queue
 *    - correlation_id: ID unik (UUID)
 * 3. Server proses message, lalu publish result ke reply_to queue
 * 4. Client terima result di callback queue, cocokkan correlation_id
 *
 *       Client (Node.js)          RabbitMQ           Server (Python)
 *       ================          ========           ===============
 *       1. Buat callback queue
 *       2. Publish request -----→ [document_convert] ---→ process_message()
 *       3. Tunggu response...                              convert_document()
 *       4. Terima result   ←----- [callback_queue]  ←---- publish result
 *       5. Resolve Promise
 */
class DocumentConverterService {
  // ── PROPERTIES ──────────────────────────────────────────
  // connection & channel disimpan sebagai nullable karena
  // belum tersedia saat constructor (connect itu async).
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  // Nama queue yang di-consume oleh Python service.
  // HARUS SAMA dengan QUEUE_NAME di Python config.
  private readonly queueName = "document_convert";

  // Nama callback queue untuk menerima response.
  // Akan di-set saat connect() karena queue-nya auto-generated.
  private callbackQueue = "";

  // ── RESPONSE MAP ────────────────────────────────────────
  // Map untuk menyimpan "pending requests" yang menunggu response.
  //
  // Key: correlation_id (UUID string)
  // Value: { resolve, reject } dari Promise
  //
  // KONSEP:
  // Saat kita kirim request, kita buat Promise baru dan simpan
  // resolve/reject-nya di Map ini dengan key = correlation_id.
  // Saat response datang, kita cari correlation_id di Map,
  // panggil resolve() dengan data result, dan hapus dari Map.
  //
  // Ini memungkinkan BANYAK request pending bersamaan,
  // dan setiap response bisa dicocokkan dengan request-nya.
  private responseMap = new Map<
    string,
    {
      resolve: (value: ConversionResult) => void;
      reject: (reason: Error) => void;
    }
  >();

  constructor(private config: RabbitMQConfig) {}

  // ============================================================
  // CONNECT — Hubungkan ke RabbitMQ
  // ============================================================
  /**
   * Membuat koneksi dan channel ke RabbitMQ, serta setup
   * callback queue untuk menerima response RPC.
   *
   * Fungsi ini HARUS dipanggil sebelum convertDocument().
   * Biasanya dipanggil sekali saat aplikasi startup.
   */
  async connect(): Promise<void> {
    // ── BUAT KONEKSI ────────────────────────────────────
    // amqplib.connect() membuat TCP connection ke RabbitMQ.
    // Format URL: amqp://username:password@host:port
    //
    // AMQP = Advanced Message Queuing Protocol
    // Protokol standar yang digunakan RabbitMQ untuk komunikasi.
    const url =
      `amqp://${this.config.username}:${this.config.password}` +
      `@${this.config.host}:${this.config.port}`;

    this.connection = (await amqplib.connect(url));
    console.log("[DocumentConverter] Connected to RabbitMQ");

    // ── BUAT CHANNEL ──────────────────────────────────
    // Channel = jalur komunikasi virtual di dalam connection.
    // Semua operasi (publish, consume, declare) dilakukan
    // melalui channel, bukan connection langsung.
    //
    // Satu connection bisa punya banyak channel.
    // Channel itu lightweight, connection itu heavyweight.
    this.channel = await this.connection.createChannel();

    // ── DEKLARASI QUEUE UTAMA ─────────────────────────
    // assertQueue() = pastikan queue ada (buat jika belum).
    // durable: true = queue bertahan setelah RabbitMQ restart.
    //
    // PENTING: Parameter HARUS SAMA dengan yang dideklarasi
    // di Python service. Jika berbeda → error!
    await this.channel.assertQueue(this.queueName, { durable: true });

    // ── BUAT CALLBACK QUEUE ───────────────────────────
    // Callback queue = queue KHUSUS untuk menerima response.
    //
    // { exclusive: true }:
    //   - Queue hanya bisa diakses oleh connection yang membuatnya
    //   - Otomatis DIHAPUS saat connection tertutup
    //   - Nama queue di-generate otomatis oleh RabbitMQ
    //     (contoh: "amq.gen-Xa2k9sLm...")
    //
    // Kenapa exclusive?
    // Karena response ini hanya untuk KITA (Node.js instance ini).
    // Tidak ada consumer lain yang boleh membaca response kita.
    const { queue } = await this.channel.assertQueue("", {
      exclusive: true,
    });
    this.callbackQueue = queue;
    console.log(`[DocumentConverter] Callback queue: ${this.callbackQueue}`);

    // ── CONSUME CALLBACK QUEUE ────────────────────────
    // Mulai "mendengarkan" response dari Python service
    // di callback queue.
    //
    // { noAck: true }:
    //   - Auto-acknowledge setiap message yang diterima
    //   - Kita tidak perlu manual ack untuk callback queue
    //     karena response ini hanya untuk kita sendiri
    //   - Jika connection mati, queue juga mati (exclusive),
    //     jadi tidak ada risiko message hilang
    this.channel.consume(
      this.callbackQueue,
      (msg: ConsumeMessage | null) => {
        // ── HANDLE RESPONSE ─────────────────────────
        // Callback ini dipanggil setiap kali ada message
        // baru di callback queue (= response dari Python).
        if (!msg) return;

        // Ambil correlation_id dari properties message.
        // Ini ID yang kita kirim bersama request tadi.
        const correlationId = msg.properties.correlationId;

        // Cari pending request yang cocok di responseMap.
        const pending = this.responseMap.get(correlationId);

        if (pending) {
          // ── COCOK! Parse response dan resolve Promise ──
          // msg.content adalah Buffer, perlu di-convert ke string.
          // JSON.parse() mengubah string JSON menjadi object JS.
          const result: ConversionResult = JSON.parse(
            msg.content.toString()
          );

          // resolve() menyelesaikan Promise yang sedang ditunggu
          // oleh pemanggil convertDocument(). Setelah ini,
          // await convertDocument() akan mendapat nilainya.
          pending.resolve(result);

          // Hapus dari Map karena request ini sudah selesai.
          // Ini mencegah memory leak (Map membesar terus).
          this.responseMap.delete(correlationId);
        }
        // Jika correlationId tidak ditemukan di Map, abaikan.
        // Ini bisa terjadi jika response datang setelah timeout.
      },
      { noAck: true }
    );
  }

  // ============================================================
  // CONVERT DOCUMENT — Kirim request konversi
  // ============================================================
  /**
   * Mengirim file path ke Python service untuk dikonversi
   * ke Markdown, dan menunggu hasilnya.
   *
   * @param filePath - Path absolut ke file yang akan dikonversi
   * @param timeoutMs - Timeout dalam milidetik (default 30 detik)
   * @returns Promise<ConversionResult> - Hasil konversi
   *
   * KONSEP PROMISE:
   * ===============
   * Promise merepresentasikan nilai yang BELUM tersedia sekarang
   * tapi AKAN tersedia di masa depan. Cocok untuk operasi async
   * seperti RPC yang butuh waktu (kirim request → tunggu → terima result).
   *
   * Cara kerja:
   * 1. Buat Promise baru
   * 2. Simpan resolve/reject ke responseMap (key = correlationId)
   * 3. Publish request ke RabbitMQ
   * 4. return Promise (caller akan await)
   * 5. ... waktu berlalu ... Python memproses ...
   * 6. Response datang → callback consume dipanggil
   * 7. Cocokkan correlationId → panggil resolve(result)
   * 8. Promise resolved → await selesai, caller mendapat result
   */
  async convertDocument(
    filePath: string,
    timeoutMs: number = 30000
  ): Promise<ConversionResult> {
    // Pastikan sudah connect
    if (!this.channel) {
      throw new Error("Belum connect ke RabbitMQ. Panggil connect() dulu!");
    }

    // ── GENERATE CORRELATION ID ─────────────────────────
    // randomUUID() menghasilkan UUID v4 yang unik.
    // Contoh: "550e8400-e29b-41d4-a716-446655440000"
    //
    // Correlation ID = "nomor antrian" yang mencocokkan
    // request dengan response-nya. Tanpa ini, kalau ada
    // 10 request bersamaan, kita tidak tahu response mana
    // untuk request yang mana.
    const correlationId = randomUUID();

    // ── BUAT PROMISE ────────────────────────────────────
    // Promise baru yang akan di-resolve saat response datang,
    // atau di-reject saat timeout.
    return new Promise<ConversionResult>((resolve, reject) => {
      // ── SET TIMEOUT ───────────────────────────────────
      // Jika response tidak datang dalam timeoutMs milidetik,
      // reject Promise dengan error timeout.
      //
      // Ini mencegah Promise "menggantung" selamanya jika
      // Python service crash atau message hilang.
      const timer = setTimeout(() => {
        this.responseMap.delete(correlationId);
        reject(
          new Error(`Konversi timeout setelah ${timeoutMs}ms: ${filePath}`)
        );
      }, timeoutMs);

      // ── SIMPAN KE RESPONSE MAP ────────────────────────
      // Simpan resolve/reject yang dibungkus dengan logic
      // untuk clear timeout saat response diterima.
      this.responseMap.set(correlationId, {
        resolve: (value: ConversionResult) => {
          clearTimeout(timer); // Cancel timeout karena sudah dapat response
          resolve(value);      // Resolve Promise dengan result
        },
        reject: (reason: Error) => {
          clearTimeout(timer);
          reject(reason);
        },
      });

      // ── PUBLISH REQUEST KE RABBITMQ ───────────────────
      // sendToQueue() mengirim message langsung ke queue
      // (tanpa melalui exchange — menggunakan default exchange).
      //
      // Parameter:
      // - queue: Nama queue tujuan ("document_convert")
      // - content: Buffer berisi JSON message
      // - options:
      //   - correlationId: ID untuk mencocokkan response
      //   - replyTo: Nama callback queue untuk menerima response
      //   - persistent: true = message bertahan setelah RabbitMQ restart
      //     (disimpan ke disk, bukan hanya di memory)
      //   - contentType: Menandakan format body (JSON)
      //
      // PENTING: persistent hanya bekerja jika queue juga durable.
      // Jika queue tidak durable, message hilang saat restart
      // meskipun persistent=true.
      this.channel!.sendToQueue(
        this.queueName,
        Buffer.from(JSON.stringify({ file_path: filePath })),
        {
          correlationId: correlationId,
          replyTo: this.callbackQueue,
          persistent: true,
          contentType: "application/json",
        }
      );

      console.log(
        `[DocumentConverter] Request terkirim: ${filePath} ` +
        `(correlationId: ${correlationId})`
      );
    });
  }

  // ============================================================
  // DISCONNECT — Tutup koneksi
  // ============================================================
  /**
   * Menutup channel dan connection ke RabbitMQ.
   * Panggil saat aplikasi shutdown (graceful shutdown).
   *
   * PENTING: Tutup channel DULU, baru connection.
   * Jika connection ditutup duluan, channel otomatis tertutup
   * tapi bisa menyebabkan error/warning di log.
   */
  async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        console.log("[DocumentConverter] Channel closed");
      }
      if (this.connection) {
        await this.connection.close();
        console.log("[DocumentConverter] Connection closed");
      }
    } catch (error) {
      console.error("[DocumentConverter] Error saat disconnect:", error);
    }
  }
}

// ============================================================
// EXPORT & CONTOH PENGGUNAAN
// ============================================================

// Export class agar bisa di-import dari file lain.
// Contoh: import { DocumentConverterService } from "./services/document-converter-service"
export { DocumentConverterService };
export type { ConversionResult, RabbitMQConfig };

// ============================================================
// CONTOH PENGGUNAAN (untuk referensi, belum diimplementasikan)
// ============================================================
//
// import { DocumentConverterService } from "./services/document-converter-service";
//
// // 1. Buat instance service
// const converterService = new DocumentConverterService({
//   host: "localhost",
//   port: 5672,
//   username: "guest",
//   password: "guest",
// });
//
// // 2. Connect ke RabbitMQ (sekali saat startup)
// await converterService.connect();
//
// // 3. Kirim request konversi (bisa dipanggil berkali-kali)
// const result = await converterService.convertDocument("/data/uploads/laporan.pdf");
//
// if (result.success) {
//   console.log("Metadata:", result.data?.metadata);
//   console.log("Markdown:", result.data?.content);
// } else {
//   console.error("Error:", result.error);
// }
//
// // 4. Disconnect saat shutdown
// await converterService.disconnect();
// ============================================================

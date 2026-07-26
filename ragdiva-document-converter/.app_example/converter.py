# ============================================================
# converter.py — Logic Konversi Dokumen dengan MarkItDown
# ============================================================
# Module ini berisi fungsi untuk mengkonversi file dokumen
# (PDF, DOCX, PPTX, XLSX, dll.) menjadi Markdown menggunakan
# library MarkItDown dari Microsoft.
#
# TANGGUNG JAWAB MODULE INI:
# 1. Menerima file path dari pemanggil
# 2. Mengkonversi dokumen ke Markdown via MarkItDown
# 3. Mengekstrak metadata file (nama, ukuran, tipe, waktu)
# 4. Mengembalikan hasil dalam format dict (siap dijadikan JSON)
#
# Module ini TIDAK tahu tentang RabbitMQ — itu bukan urusannya.
# Prinsip ini disebut "Separation of Concerns".
# ============================================================

import os
import mimetypes
from datetime import datetime, timezone

from markitdown import MarkItDown


# ============================================================
# INISIALISASI MARKITDOWN
# ============================================================
# Buat instance MarkItDown sekali saja (singleton pattern).
# Instance ini bisa dipakai berulang kali tanpa perlu dibuat ulang.
# Ini lebih efisien daripada membuat instance baru setiap konversi.
# ============================================================
md_converter = MarkItDown()


def convert_document(file_path: str) -> dict:
    """
    Mengkonversi dokumen di file_path menjadi Markdown.

    Parameter:
    ----------
    file_path : str
        Path absolut ke file yang akan dikonversi.
        Contoh: "/data/uploads/laporan.pdf"

    Return:
    -------
    dict — Hasil konversi dalam format:
        {
            "success": True/False,
            "data": {
                "metadata": { ... },    # Info tentang file
                "content": "# ..."      # Isi Markdown
            },
            "error": None / "pesan error"
        }

    Catatan:
    --------
    Fungsi ini di-desain untuk dipanggil dari thread pool.
    Artinya beberapa konversi bisa berjalan BERSAMAAN di thread
    yang berbeda. MarkItDown aman digunakan secara concurrent
    (thread-safe) karena setiap pemanggilan convert() independen.
    """

    try:
        # ── VALIDASI: Cek apakah file ada ──────────────────
        # os.path.exists() mengecek keberadaan file di filesystem.
        # Kita validasi dulu sebelum mencoba konversi agar
        # error message lebih jelas dan spesifik.
        if not os.path.exists(file_path):
            return _build_error_response(f"File tidak ditemukan: {file_path}")

        # ── EKSTRAK METADATA ───────────────────────────────
        # Kumpulkan informasi tentang file sebelum konversi.
        # Metadata ini berguna untuk tracking dan debugging.
        metadata = _extract_metadata(file_path)

        # ── KONVERSI DENGAN MARKITDOWN ─────────────────────
        # md_converter.convert() adalah fungsi utama MarkItDown.
        # Fungsi ini:
        # 1. Mendeteksi tipe file secara otomatis
        # 2. Menggunakan converter yang sesuai (PDF/DOCX/dll.)
        # 3. Mengembalikan object dengan atribut .text_content
        #    yang berisi hasil konversi dalam format Markdown
        result = md_converter.convert(file_path)

        # ── BANGUN RESPONSE SUKSES ─────────────────────────
        # result.text_content berisi string Markdown.
        # .strip() menghapus whitespace di awal/akhir string.
        return {
            "success": True,
            "data": {
                "metadata": metadata,
                "content": result.text_content.strip() if result.text_content else ""
            },
            "error": None
        }

    except Exception as e:
        # ── TANGKAP SEMUA ERROR ────────────────────────────
        # Jika terjadi error apapun saat konversi (file corrupt,
        # format tidak didukung, dll.), kita tangkap dan kembalikan
        # sebagai response error — BUKAN exception yang crash.
        # Ini penting karena kita di thread pool: jika satu
        # konversi gagal, thread lain tidak boleh terpengaruh.
        return _build_error_response(f"Gagal konversi: {str(e)}")


def _extract_metadata(file_path: str) -> dict:
    """
    Mengekstrak metadata dari file.

    Fungsi ini diawali underscore (_) yang merupakan konvensi Python
    untuk menandakan fungsi "private" — hanya digunakan di dalam
    module ini, bukan untuk dipanggil dari luar.

    Parameter:
    ----------
    file_path : str
        Path absolut ke file.

    Return:
    -------
    dict — Metadata file berisi:
        - filename: Nama file (tanpa path)
        - file_size: Ukuran file dalam bytes
        - file_type: MIME type (misal "application/pdf")
        - converted_at: Timestamp konversi (ISO 8601 format)
    """

    # ── os.path.basename() ─────────────────────────────────
    # Mengambil nama file dari path lengkap.
    # Contoh: "/data/uploads/laporan.pdf" → "laporan.pdf"
    filename = os.path.basename(file_path)

    # ── os.path.getsize() ──────────────────────────────────
    # Mengambil ukuran file dalam bytes.
    # Contoh: 102400 (= 100 KB)
    file_size = os.path.getsize(file_path)

    # ── mimetypes.guess_type() ─────────────────────────────
    # Menebak MIME type berdasarkan ekstensi file.
    # Return: (type, encoding) → kita ambil [0] saja.
    # Contoh:
    #   .pdf  → "application/pdf"
    #   .docx → "application/vnd.openxmlformats-officedocument..."
    #   .txt  → "text/plain"
    # Jika tidak dikenali, return None → kita default "unknown"
    file_type = mimetypes.guess_type(file_path)[0] or "unknown"

    # ── datetime.now(timezone.utc) ─────────────────────────
    # Ambil waktu saat ini dalam UTC timezone.
    # .isoformat() mengubahnya ke format ISO 8601 string:
    # "2026-07-14T11:20:00+00:00"
    # Format ini standar internasional dan mudah di-parse
    # oleh frontend/backend manapun.
    converted_at = datetime.now(timezone.utc).isoformat()

    return {
        "filename": filename,
        "file_size": file_size,
        "file_type": file_type,
        "converted_at": converted_at
    }


def _build_error_response(error_message: str) -> dict:
    """
    Helper untuk membuat response error yang konsisten.

    Dengan helper function ini, semua error response memiliki
    format yang sama. Konsistensi format penting agar consumer
    (backend Node.js) bisa handle response dengan mudah —
    cukup cek field "success" tanpa perlu parsing yang berbeda
    untuk setiap jenis error.

    Parameter:
    ----------
    error_message : str
        Pesan error yang menjelaskan apa yang salah.

    Return:
    -------
    dict — Response error dengan format standar.
    """
    return {
        "success": False,
        "data": None,
        "error": error_message
    }

import os
import logging
import requests
import tempfile
from app.config import Config
from markitdown import MarkItDown

md_converter = MarkItDown()
logger = logging.getLogger(__name__)

def convert_document(data: any) -> dict:
    try:
        response = requests.get(f"{Config.MAIN_BACKEND}/file/{data['id']}?download=true")
        response.raise_for_status()

        logger.info(response.headers.get("Content-Disposition"))

        filename = response.headers.get("Content-Disposition").split(";")[-1].strip()
        extension = ".bin"

        if "filename=" in filename:
            extension = os.path.splitext(filename.split("filename=")[-1].strip('"'))[1]

        tmp = tempfile.NamedTemporaryFile(
            suffix=extension,
            dir="./temp",
            delete=False
        )

        tmp.write(response.content)
        tmp.close()

        result = md_converter.convert(tmp.name)

        return {
            "success": True,
            "data": {
                "metadata": {
                    "id": data["id"],
                    "title": result.title,
                    "file_title": data["title"],
                    "file_name": data["fileName"],
                    "file_hash": data["fileHash"],
                    "mime_type": data["mimeType"],
                    "created_at": data["createdAt"],
                },
                "content": result.markdown
            },
            "error": None
        }
    except Exception as e:
        logger.error(e)
        return _build_error_response(str(e))

    finally: 
        os.remove(tmp.name)

def _build_error_response(error_message: str) -> dict:
    return {
        "success": False,
        "data": None,
        "error": error_message
    }

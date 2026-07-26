import pika
import json
import logging
from concurrent.futures import ThreadPoolExecutor

from app.config import Config
from app.converter import convert_document

logger = logging.getLogger(__name__)

class ConversionWorker:
    def __init__(self, connection: pika.BlockingConnection):
        self.connection = connection
        self.executor = ThreadPoolExecutor(max_workers=int(Config.MAX_WORKERS))

        logger.info(
            f"Thread pool berhasil dibuat dengan {Config.MAX_WORKERS} workers"
        )

    def process_message(
            self,
            channel: pika.channel.Channel,
            method: pika.spec.Basic.Deliver,
            properties: pika.spec.BasicProperties,
            body: bytes
    ):
        try:
            message = json.loads(body.decode("utf-8"))
            
            logger.info(
                f"Menerima {message}"
            )

            future = self.executor.submit(convert_document, message)

            future.add_done_callback(
                lambda fut: self._on_conversion_done(
                    fut, properties, method.delivery_tag, channel
                )
            )
            
        except json.JSONDecodeError as e:
            logger.error(
                f"Message bukan JSON valid : {e}"
            )
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
        try:
            result = future.result()
        except Exception as e:
            logger.error(f"Exception : {e}")
            result = {
                "success": False,
                "data": None,
                "error": f"Internal Error: {str(e)}"
            }

        response_body = json.dumps(result, ensure_ascii=False)
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

            logger.info(
                f"Result dikirim ke {properties.reply_to} "
                f"Correlation id : {properties.correlation_id}"
            )

        except Exception as e:
            logger.error(f"Gagal publish result: {e}")

            try:
                channel.basic_ack(delivery_tag=delivery_tag)
            except Exception:
                pass

    def _send_error_reply(
        self,
        channel: pika.channel.Channel,
        properties: pika.spec.BasicProperties,
        delivery_tag: int,
        error_message: str,
    ):
        try:
            result = {
                "success": False,
                "data": None,
                "error": error_message
            }

            response_body = json.dumps(result, ensure_ascii=False)

            channel.basic_publish(
                exchange="",
                routing_key=properties.reply_to,
                body = response_body.encode("utf-8"),
                properties=pika.BasicProperties(
                    correlation_id=properties.correlation_id,
                    content_type="application/json"
                )
            )
            channel.basic_ack(delivery_tag=delivery_tag)

        except Exception as e:
            logger.error(f"Gagal kirim error reply: {e}")

    def shutdown(self):
        logger.info("Shutting down thread pool...")
        self.executor.shutdown(wait=True)
        logger.info("Thread pool berhasil di-shutdown")
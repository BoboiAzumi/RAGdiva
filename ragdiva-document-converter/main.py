import sys
import time
import pika
import signal
import logging

from app.config import Config
from app.worker import ConversionWorker

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

def create_connection() -> pika.BlockingConnection:
    for attempt in range(1, int(Config.RABBITMQ_RETRY_COUNT) + 1):
        try:
            logger.info(
                f"Mencoba connect ke RabbitMQ "
                f"({attempt})/({Config.RABBITMQ_RETRY_COUNT}) ..."
            )

            connection = pika.BlockingConnection(
                pika.ConnectionParameters(
                    host=Config.RABBITMQ_HOST,
                    port=Config.RABBITMQ_PORT,
                    credentials=pika.PlainCredentials(
                        username=Config.RABBITMQ_USER,
                        password=Config.RABBITMQ_PASS
                    ),
                    heartbeat=30
                )
            )

            logger.info("Berhasil connect ke RabbitMQ")
            return connection
        except pika.exceptions.AMQPConnectionError as e:
            logger.warning(
                f"Gagal connect (attempt {attempt}): {e}"
            )

            if attempt < int(Config.RABBITMQ_RETRY_COUNT):
                logger.info(
                    f"Menunggu {Config.RABBITMQ_RETRY_DELAY} detik sebelum retry"
                )
                time.sleep(Config.RABBITMQ_RETRY_DELAY)

            else:
                logger.error(
                    f"Gagal connect ke RabbitMQ setelah {Config.RABBITMQ_RETRY_COUNT} percobaan. Exiting ..."
                )

                sys.exit(1)

def main():
    connection = create_connection()
    channel = connection.channel()

    channel.queue_declare(
        queue=Config.QUEUE_NAME,
        durable=True
    )

    channel.basic_qos(
        prefetch_count=int(Config.MAX_WORKERS)
    )

    worker = ConversionWorker(connection)

    channel.basic_consume(
        queue=Config.QUEUE_NAME,
        on_message_callback=worker.process_message,
        auto_ack=False
    )

    def graceful_shutdown(signum, frame):
        logger.info(f"Menerima signal {signum}, memulai shutdown...")
        channel.stop_consuming()
        worker.shutdown()
        connection.close()
        logger.info("Service berhasil di-shutdown. Bye!")
        sys.exit(0)

    signal.signal(signal.SIGINT, graceful_shutdown)
    signal.signal(signal.SIGTERM, graceful_shutdown)

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
        logger.info("KeyboardInterrupt, shutting down...")
        worker.shutdown()
        connection.close()
    
    return

if __name__ == "__main__":
    main()
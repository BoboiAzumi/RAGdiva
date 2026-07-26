import amqp, { type Channel, type RecoveringChannelModel } from "amqplib";
import { v4 } from "uuid";

export class RabbitMQConnection {
    connection: RecoveringChannelModel | null = null;
    channel: Map<string, Promise<Channel>> = new Map<
        string,
        Promise<Channel>
    >();
    channelReply: Map<string, string> = new Map<string, string>();
    channelPending: Map<string, Map<string, (data: unknown) => void>> =
        new Map();

    ready: boolean = false;

    constructor() {}

    async connect() {
        this.connection = await amqp.connect(process.env.RABBITMQ_URL!);
        this.ready = true;
        this.connection.on("disconnect", () => {
            console.log("RabbitMQ Disconnect")
            this.ready = false;
            this.channel.clear();
            this.channelReply.clear();
            this.channelPending.clear();
        });
        this.connection.on("connect", () => {
            this.ready = true;
        });
        this.connection.on("error", (err) => {
            console.error("RabbitMQ connection error", err);
        });
    }

    private createChannel(key: string): Promise<Channel> {
        if (this.connection === null) {
            throw new Error("RabbitMQ not connected");
        }
        const promise = this.connection.createChannel();
        promise.catch(() => this.channel.delete(key));
        return promise;
    }

    async getChannel(key: string) {
        if (this.connection === null) {
            throw new Error("RabbitMQ not connected");
        }

        if (!this.channel.has(key)) {
            this.channel.set(key, this.createChannel(key));
        }

        return this.channel.get(key);
    }

    isReady() {
        return this.ready;
    }

    async sendToQueueWithReply(
        queueName: string,
        channel: string,
        data: unknown,
    ) {
        if (this.connection === null) {
            throw new Error("RabbitMQ not connected");
        }

        if (!this.channel.has(channel)) {
            this.channel.set(channel, this.createChannel(channel));
            this.channelPending.set(channel, new Map());

            try {
                const chan = await this.channel.get(channel)!;

                const reply = await chan.assertQueue("", {
                    exclusive: true,
                });

                this.channelReply.set(channel, reply?.queue!);

                await chan.consume(reply?.queue!, (msg) => {
                    if (!msg) {
                        return;
                    }
                    const resolve = this.channelPending
                        .get(channel)!
                        .get(msg.properties.correlationId);
                    try {
                        if (resolve) {
                            resolve(JSON.parse(msg.content.toString()));
                        } else {
                            throw Error();
                        }
                    } catch {
                        if (!resolve) {
                            return;
                        }
                        resolve(null);
                    } finally {
                        chan.ack(msg);
                        this.channelPending
                            .get(channel)
                            ?.delete(msg.properties.correlationId);
                    }
                });
            } catch (err) {
                this.channelPending.delete(channel);
                this.channelReply.delete(channel);
                throw err;
            }
        }

        const chan = await this.channel.get(channel)!;
        const correlationId = v4();

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                this.channelPending.get(channel)?.delete(correlationId);
                reject(new Error(`Timeout waiting reply for ${correlationId}`));
            }, 300_000);

            this.channelPending.get(channel)?.set(correlationId, (data) => {
                clearTimeout(timeout);
                resolve(data);
            });

            chan.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
                replyTo: this.channelReply.get(channel)!,
                correlationId,
            });
        });
    }

    async close() {
        if (this.connection) {
            await this.connection.close();
            this.connection = null;
            this.ready = false;
            this.channel.clear();
            this.channelReply.clear();
            this.channelPending.clear();
        }
    }
}

export const rabbitmq = new RabbitMQConnection();

import "dotenv/config";
import { serve } from "@hono/node-server";
import { Context, Hono } from "hono";
import { authRoute } from "./routes/auth-route.js";
import type { HTTPResponseError } from "hono/types";
import { HTTPException } from "hono/http-exception";
import { SSEStreamingApi, streamSSE } from "hono/streaming";
import { v4 } from "uuid";
import { broadcastPool } from "./lib/broadcast/broadcast.js";
import { criteriaRoute } from "./routes/criteria-route.js";
import { fileRoute } from "./routes/file-route.js";
import { dashboardService } from "./services/dashboard-service.js";
import { AuthenticationMiddleware } from "./middleware/authentication-middleware.js";
import { aichatRoute } from "./routes/aichat-route.js";
import { rabbitmq } from "./lib/rabbitmq/rabbitmq.js";
import { prisma } from "./lib/database/database.js";
import { findFileById } from "./repositories/file-repo.js";
import { clearCollection, milvusSetup } from "./lib/milvus/milvus.js";
import { retrievalService } from "./services/rag-service.js";

async function main() {
    const app = new Hono();
    await rabbitmq.connect();
    await milvusSetup(parseInt(process.env.MILVUS_DEFAULT_EMBEDDING_DIM ?? "") || 2048)

    app.get("/", AuthenticationMiddleware, async (c: Context) => {
        const dashboardData = await dashboardService();
        return c.json({
            message: "Successfully fetch dashboard",
            data: dashboardData,
        });
    });

    app.route("/auth", authRoute);
    app.route("/criteria", criteriaRoute);
    app.route("/file", fileRoute);
    app.route("/aichat", aichatRoute);

    app.get("/mqtest/:id", async (c: Context) => {
        const file = await findFileById(c.req.param()["id"]);

        if (!rabbitmq.isReady()) {
            throw new HTTPException(500, { message: "RabbitMQ not ready" });
        }

        if (!file) {
            throw new HTTPException(404, { message: "File not found" });
        }

        const feedBack = await rabbitmq.sendToQueueWithReply(
            "document.converter",
            "node-python",
            file,
        );

        return c.json(feedBack);
    });

    app.get("/query", async (c: Context) => {
        const result = await retrievalService(c.req.query()["q"] || "");

        return c.json(result);
    });

    app.get("/stream", async (c: Context) => {
        return streamSSE(c, async (stream: SSEStreamingApi) => {
            const id = v4();
            const write = async (event: string, data: string) => {
                await stream.writeSSE({
                    event,
                    data,
                });
            };

            const client = { id, write };

            broadcastPool.add(client);

            stream.onAbort(() => {
                broadcastPool.delete(client);
            });

            while (!stream.aborted) {
                await stream.sleep(10000);
                await stream.writeSSE({
                    event: "ping",
                    data: "keep-alive",
                });
            }
        });
    });

    app.onError(
        async (err: Error | HTTPResponseError | HTTPException, c: Context) => {
            if (err instanceof HTTPException) {
                return c.json(
                    {
                        message: err.message,
                        data: [],
                    },
                    err.status,
                );
            }

            return c.json(
                {
                    message: "Internal Server Error : " + err.message,
                    data: [],
                },
                500,
            );
        },
    );

    serve(
        {
            fetch: app.fetch,
            port: 3000,
        },
        (info) => {
            console.log(`Server is running on http://localhost:${info.port}`);
        },
    );

    process.on("SIGINT", () => {
        rabbitmq.close();
        prisma.$disconnect();
    });

    process.on("SIGTERM", () => {
        (rabbitmq.close(), prisma.$disconnect());
    });
}

main().catch((e) => console.log(e));

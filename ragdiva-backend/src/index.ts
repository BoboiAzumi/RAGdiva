import "dotenv/config";
import { serve } from "@hono/node-server";
import { Context, Hono } from "hono";
import { authRoute } from "./routes/auth-route.js";
import type { HTTPResponseError } from "hono/types";
import { HTTPException } from "hono/http-exception";
import { SSEStreamingApi, streamSSE } from "hono/streaming";
import { v4 } from "uuid";
import { broadcastPool } from "./lib/broadcast.js";
import { criteriaRoute } from "./routes/criteria-route.js";
import { fileRoute } from "./routes/file-route.js";
import { dashboardService } from "./services/dashboard-service.js";
import { AuthenticationMiddleware } from "./middleware/authentication-middleware.js";
import { aichatRoute } from "./routes/aichat-route.js";

const app = new Hono();

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

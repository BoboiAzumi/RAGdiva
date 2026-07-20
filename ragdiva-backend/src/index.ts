import "dotenv/config";
import { serve } from "@hono/node-server";
import { Context, Hono } from "hono";
import { authRoute } from "./routes/auth-route.js";
import type { HTTPResponseError } from "hono/types";
import { HTTPException } from "hono/http-exception";
import { SSEStreamingApi, streamSSE } from "hono/streaming";
import { v4 } from "uuid";
import { broadcastPool } from "./lib/broadcast.js";

const app = new Hono();

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.route("/auth", authRoute);

app.get("/stream", async (c: Context) => {
    return streamSSE(c, async (stream: SSEStreamingApi) => {
		const id = v4()
		const write = async (event: string, data: string) => {
			await stream.writeSSE({
				event,
				data
			})
		}

		broadcastPool.add({id, write})

		stream.onAbort(() => {
			broadcastPool.delete({ 
				id, 
				write 
			})
		})

		while(!stream.abort) {
			await stream.sleep(3000)
			await stream.writeSSE({
				event: "ping",
				data: "keep-alive"
			})
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

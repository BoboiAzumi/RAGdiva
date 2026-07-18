import type { Context, Next } from "hono";
import { verifyToken } from "../services/auth-service.js";
import { HTTPException } from "hono/http-exception";

export async function AuthenticationMiddleware(c: Context, next: Next) {
    const token = c.req.header()["authorization"];

    if (!token) {
        throw new HTTPException(403, { message: "unauthenticated" });
    }

    if (await verifyToken(token.replaceAll("Bearer", "").trim())) {
        await next();
    }
}

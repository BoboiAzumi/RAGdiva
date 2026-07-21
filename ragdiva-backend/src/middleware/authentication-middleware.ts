import type { Context, Next } from "hono";
import { verifyToken } from "../services/auth-service.js";
import { HTTPException } from "hono/http-exception";

export async function AuthenticationMiddleware(c: Context, next: Next) {
    const token = c.req.header()["authorization"];

    if (!token) {
        throw new HTTPException(403, { message: "unauthenticated" });
    }

    const verify = await verifyToken(token.replaceAll("Bearer", "").trim())

    if (verify) {
        c.set("userid", verify.id)
        c.set("fullName", verify.fullName)
        await next();
    }
    else {
        throw new HTTPException(403, { message: "invalid credential" })
    }
}

import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { verifyToken } from "../services/auth-service.js";
import type { Level } from "../prisma/enums.js";

export function AuthorizationMiddleware(role: Level[]) {
    return async function (c: Context, next: Next) {
        const token = c.req.header()["authorization"];

        if (!token) {
            throw new HTTPException(403, { message: "unauthenticated" });
        }

        const verify = await verifyToken(token.replaceAll("Bearer", "").trim())

        if(!role.includes(verify?.level as Level)){
            throw new HTTPException(403, { message: "access forbidden" })
        }

        c.set("level", verify?.level)
        c.set("userid", verify?.id)
        c.set("fullName", verify?.fullName)

        await next()
    };
}

import type { Context } from "hono";
import { authenticate, verifyToken } from "../services/auth-service.js";

export async function authPost(c: Context) {
    const body = await c.req.json()

    const token = await authenticate(body.username as string, body.password as string)

    return c.json({
        message: "success",
        data: {
            token
        }
    })
}

export async function getMe(c: Context) {
    const token = c.req.header()["authorization"].replaceAll("Bearer", "").trim()

    const user = await verifyToken(token)

    return c.json({
        message: "success",
        data: {
            id: user?.id,
            username: user?.username,
            fullName: user?.fullName,
            level: user?.level.toLowerCase(),
            majors: user?.majorAccess
        }
    })
}
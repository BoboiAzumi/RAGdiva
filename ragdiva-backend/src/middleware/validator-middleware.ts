import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ZodObject } from "zod";

export function ValidatorMiddleware(schema: ZodObject) {
    return async function (c: Context, next: Next) {
        const isJson = c.req.header("Content-Type")?.startsWith("application/json")
        const data = isJson ? c.req.json() : c.req.parseBody()
        const parser = schema.safeParse(await data)

        if (!parser.success) {
            throw new HTTPException(401, { message: `Bad Request:${JSON.parse(parser.error.message).map((v: any) => ` ${v.message}`)}` })
        }

        await next();
    };
}

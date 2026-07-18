import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ZodObject } from "zod";

export function ValidatorMiddleware(schema: ZodObject) {
    return async function (c: Context, next: Next) {
        const parser = schema.safeParse(await c.req.json());

        if (!parser.success) {
            throw new HTTPException(401, { message: `Bad Request:${JSON.parse(parser.error.message).map((v: any) => ` ${v.message}`)}` })
        }

        await next();
    };
}

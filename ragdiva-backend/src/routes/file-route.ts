import { Context, Hono } from "hono";
import { AuthorizationMiddleware } from "../middleware/authorization-middleware.js";
import { bodyLimit } from "hono/body-limit";
import { HTTPException } from "hono/http-exception";
import {
    deleteFile,
    getFile,
    postFile,
    updateFile,
} from "../handlers/file-handler.js";

export const fileRoute = new Hono();

fileRoute.post(
    "/:cid",
    AuthorizationMiddleware(["Admin", "User"]),
    bodyLimit({
        maxSize: 1024 * 1024 * 1024,
        onError: (c: Context) => {
            throw new HTTPException(413, { message: "File too large" });
        },
    }),
    postFile,
);
fileRoute.get("/:id", getFile);
fileRoute.patch(
    "/:cid/:fid",
    AuthorizationMiddleware(["Admin", "User"]),
    updateFile,
);
fileRoute.delete(
    "/:cid/:fid",
    AuthorizationMiddleware(["Admin", "User"]),
    deleteFile,
);

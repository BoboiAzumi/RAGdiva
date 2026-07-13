import { Hono } from "hono";
import { ValidatorMiddleware } from "../middleware/validator-middleware.js";
import { LoginSchema } from "../schema/auth-schema.js";
import { authPost, getMe } from "../handlers/auth-handler.js";
import { AuthenticationMiddleware } from "../middleware/authentication-middleware.js";

export const authRoute = new Hono()

authRoute.get("/me", AuthenticationMiddleware, getMe)
authRoute.post("/", ValidatorMiddleware(LoginSchema), authPost)
import { Hono } from "hono";
import { AuthenticationMiddleware } from "../middleware/authentication-middleware.js";
import { createSession, deleteAiChatHistorySession, getAiChatHistory, getModels, getSession, streamAiChat } from "../handlers/aichat-handler.js";

export const aichatRoute = new Hono();

aichatRoute.get("/", AuthenticationMiddleware, getSession)
aichatRoute.get("/models", AuthenticationMiddleware, getModels)
aichatRoute.get("/:session_id", AuthenticationMiddleware, getAiChatHistory)
aichatRoute.delete("/:session_id", AuthenticationMiddleware, deleteAiChatHistorySession)
aichatRoute.post("/new", AuthenticationMiddleware, createSession)
aichatRoute.post("/stream", AuthenticationMiddleware, streamAiChat)
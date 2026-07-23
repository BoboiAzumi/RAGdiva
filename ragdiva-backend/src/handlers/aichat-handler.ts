import type { Context } from "hono";
import { createNewAIChatSessionService, deleteAIChatHistoryService, findAIChatHistoryService, findAISessionService } from "../services/aichat-service.js";
import { getAiModel } from "../repositories/ai-model-repo.js";
import { streamSSE } from "hono/streaming";
import { agent } from "../lib/agent.js";

export async function createSession(c: Context){
    const userid = c.get("userid")
    const body = await c.req.json()

    const session = await createNewAIChatSessionService(userid, body.message)
    
    return c.json({
        message: "Successfully create session",
        data: {
            sessionId: session.id
        }
    })
}

export async function getSession(c: Context){
    const sessions = await findAISessionService(c.get("userid"))

    return c.json({
        message: "Successfully fetch AI Session",
        data: sessions
    })
}

export async function getModels(c: Context){
    const aiModel = await getAiModel()

    return c.json({
        message: "Successfully get AI Model",
        data: aiModel
    })
}

export async function getAiChatHistory(c: Context){
    const sessionId = c.req.param()["session_id"]
    const history = await findAIChatHistoryService(sessionId)

    return c.json({
        message: "Successfully get AI history chat",
        data: history
    })
}

export async function streamAiChat(c: Context){
    const body = await c.req.json()

    const sessionId = body.sessionId
    const model = body.model
    const message = body.message

    return streamSSE(c, async (stream) => {
        if(!agent.isAgentReady()){
            await stream.writeSSE({
                data: "Agent is not ready",
                event: "agent-error"
            })
            stream.abort()
            return
        }
        
        agent.chat(sessionId, model, message, async (result) => {
            await stream.writeSSE({
                data: JSON.stringify(result),
                event: "agent-result"
            })
        })
        .then(() => stream.abort())
        .catch(async (e) => {
            await stream.writeSSE({
                data: JSON.stringify(e),
                event: "agent-error"
            })
            stream.abort()
        })

        while (!stream.aborted) {
            await stream.sleep(10000);
            await stream.writeSSE({
                event: "ping",
                data: "keep-alive",
            });
        }
    })
}

export async function deleteAiChatHistorySession(c: Context){
    const sessionId = c.req.param()["session_id"]

    await deleteAIChatHistoryService(sessionId)

    return c.json({
        message: "Successfully delete AI Chat history service"
    })
}
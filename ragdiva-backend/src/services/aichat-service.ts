import { getAiChatHistory } from "../repositories/ai-chat-history-repo.js";
import { createAiChatSession, deleteAiChatSession, findAllSessionByUserId } from "../repositories/ai-chat-session-repo.js";

export async function createNewAIChatSessionService(userId: string, message: string){
    return await createAiChatSession(message, userId)
}

export async function findAISessionService(userId: string){
    return await findAllSessionByUserId(userId)
}

export async function findAIChatHistoryService(sessionId: string){
    return await getAiChatHistory(sessionId)
}

export async function deleteAIChatHistoryService(sessionId: string){
    return await deleteAiChatSession(sessionId)
}
import { prisma } from "../lib/database.js";

export async function getAiChatHistory(sessionId: string, truncate?: number) {
    return await prisma.aIChatHistory.findMany({
        where: {
            sessionId
        },
        ...truncate ? {
            orderBy: {
                createdAt: "desc"
            },
            take: truncate
        } : {},
        ...(!truncate) ? {
            orderBy: {
                createdAt: "desc"
            }
        } : {}
    })
}

export async function insertAiChatHistory(sessionId: string, role: string, content: string) {
    return await prisma.aIChatHistory.create({
        data: {
            sessionId,
            role,
            content
        }
    })
}
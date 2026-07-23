import { prisma } from "../lib/database.js";

export async function createAiChatSession(topic: string, userId: string) {
    return await prisma.aISession.create({
        data: {
            topic,
            userId,
        },
    });
}

export async function findAllSessionByUserId(userId: string){
    return await prisma.aISession.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: "asc"
        }
    })
}

export async function deleteAiChatSession(id: string) {
    await prisma.aIChatHistory.deleteMany({
        where: {
            sessionId: id,
        },
    });

    return await prisma.aISession.delete({
        where: {
            id,
        },
    });
}

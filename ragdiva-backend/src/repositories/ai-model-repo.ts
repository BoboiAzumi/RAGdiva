import { prisma } from "../lib/database/database.js";

export async function getAiModel(){
    return await prisma.aIModel.findMany()
}
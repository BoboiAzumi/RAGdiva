import { prisma } from "../lib/database.js";

export async function getAiModel(){
    return await prisma.aIModel.findMany()
}
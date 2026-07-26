import { prisma } from "../lib/database/database.js";

export function findUserMajorAccess(userId: string){
    return prisma.majorAccess.findMany({
        where: {
            userId
        }
    })
}
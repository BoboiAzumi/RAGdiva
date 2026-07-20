import { prisma } from "../lib/database.js";

export async function findUserByUsername(username: string){
    return await prisma.users.findFirst({
        where: {
            username
        }
    })
}

export async function findUserById(id: string){
    return await prisma.users.findFirst({
        where: {
            id
        },
        include: {
            majorAccess: {
                include: {
                    majors: true
                }
            }
        }
    })
}
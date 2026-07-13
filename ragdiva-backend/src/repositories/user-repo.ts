import { prisma } from "../utils/database.js";

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
            majors: true
        }
    })
}
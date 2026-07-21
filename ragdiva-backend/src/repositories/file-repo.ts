import { prisma } from "../lib/database.js";
import type { FileType } from "../types/file-type.js";

export async function insertFile(files: FileType[]){
    return prisma.files.createMany({
        data: files
    })
}

export async function findFileByHash(fileHash: string){
    return await prisma.files.findFirst({
        where: {
            fileHash
        }
    })
}

export async function findFileById(id: string){
    return await prisma.files.findFirst({
        where: {
            id
        }
    })
}

export async function deleteFile(id: string){
    return await prisma.files.delete({
        where: {
            id
        }
    })
}

export async function updateFile(id: string, file: FileType){
    return await prisma.files.update({
        where: {
            id
        },
        data: file
    })
}
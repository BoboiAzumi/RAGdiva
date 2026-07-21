import { HTTPException } from "hono/http-exception";
import { prisma } from "../lib/database.js";

export async function setLinkByHash(cid: string, hash: string, clink: string, page: number = 1){
    const file = await prisma.files.findFirst({
        where: {
            fileHash: hash
        }
    })

    if(!file){
        throw new HTTPException(500, { message: 'Internal server error' })
    }
    
    return await prisma.fileLink.create({
        data: {
            id: undefined,
            criteriaId: cid,
            fileId: file.id,
            criteriaLink: clink,
            page
        }
    })
}

export async function findLinkByHashCriteria(cid: string, hash: string){
    return await prisma.fileLink.findFirst({
        where: {
            criteriaId: cid,
            files: {
                fileHash: hash
            }
        }
    })
}

export async function countLinkByFileId(fileId: string){
    return await prisma.fileLink.count({
        where: {
            fileId
        }
    })
}

export async function findLink(fid: string, cid: string){
    return await prisma.fileLink.findMany({
        where: {
            fileId: fid,
            criteriaId: cid,
        }
    })
}

export async function unLink(id: string[]){
    return await prisma.fileLink.deleteMany({
        where: {
            id: {
                in: id
            }
        }
    })
}

export async function unLinkGroup(criteriaId: string[], fileId: string[]){
    return await prisma.fileLink.deleteMany({
        where: {
            AND: [
                {
                    criteriaId: {
                        in: criteriaId
                    }
                },
                {
                    fileId: {
                        in: fileId
                    }
                }
            ]
        }
    })
}

export async function updatePage(fid: string, cid: string, page: number){
    return await prisma.fileLink.updateMany({
        where: {
            fileId: fid,
            criteriaId: cid
        },
        data: {
            page
        }
    })
}

export async function findFileLinksByCriteriaIdListOuter(fileIds: string[], criteriaIds: string[]){
    return await prisma.fileLink.findMany({
        where: {
            AND: [
                {
                    fileId: {
                        in: fileIds
                    },
                    criteriaId: {
                        notIn: criteriaIds
                    }
                }
            ]
        }
    })
}
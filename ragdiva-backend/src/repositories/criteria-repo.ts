import { prisma } from "../lib/database.js";
import type { CriteriaFindType, CriteriaType } from "../types/criteria-type.js";

export async function findCriteria(by?: CriteriaFindType){
    return await prisma.criteria.findMany({
        ...by ? {
            where: {
                id: by.id ?? undefined,
                parent: by.parent,
                OR: [
                    {
                        access: {
                            in: by.access ?? []
                        }
                    },
                    {
                        access: null
                    }
                ]
            }
        } : {}
    })
}

export async function createCriteria(data: CriteriaType) {
    return await prisma.criteria.create({
        data
    })
}

export async function updateCriteria(id: string, data: CriteriaType){
    return await prisma.criteria.update({
        where: {
            id
        },
        data
    })
}
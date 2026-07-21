import { createCriteria, findCriteria, updateCriteria } from "../repositories/criteria-repo.js";
import type { CriteriaFindType, CriteriaType } from "../types/criteria-type.js";

export async function findCriteriaService(by?: CriteriaFindType){
    const criteria = await findCriteria(by)

    criteria.sort((a, b) => a.code.localeCompare(b.code))

    return criteria
}

export async function newCriteriaService(data: CriteriaType) {
    return await createCriteria(data)
}

export async function updateCriteriaService(id: string, data: CriteriaType){
    return await updateCriteria(id, data)
}
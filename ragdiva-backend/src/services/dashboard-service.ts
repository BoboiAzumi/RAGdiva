import { countCriteria, countCriteriaHasFile } from "../repositories/criteria-repo.js";
import { countFile } from "../repositories/file-repo.js";
import { countMajors } from "../repositories/majors-repo.js";

export async function dashboardService() {
    const majorCount = await countMajors()
    const parentCriteriaCount = await countCriteria(true)
    const criteriaCount = await countCriteria(false)
    const fileCount = await countFile()
    const criteriaHasFile = (
        await countCriteriaHasFile()).map((v) => (
            { criteria: `${v.code ? `${v.code}. ` : ''}${v.name}`, count: v._count.fileLinks, major: v.major?.majorName ?? null}
        )
    )

    return {
        majorCount,
        parentCriteriaCount,
        criteriaCount,
        fileCount,
        criteriaHasFile
    }
}
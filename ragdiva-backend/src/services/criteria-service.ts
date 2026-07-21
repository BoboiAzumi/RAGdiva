import { unlinkSync } from "fs";
import {
    createCriteria,
    createCriteriaLink,
    deleteCriteriaMultipleId,
    findCriteria,
    traversalChildren,
    updateCriteria,
} from "../repositories/criteria-repo.js";
import {
    findFileLinksByCriteriaIdListOuter,
    patchClinkByCid,
    unLinkGroup,
} from "../repositories/file-link-repo.js";
import {
    deleteFileMultipleId,
    findFileByCriteriaIdList,
} from "../repositories/file-repo.js";
import type { CriteriaFindType, CriteriaType } from "../types/criteria-type.js";

export async function findCriteriaService(by?: CriteriaFindType) {
    const criteria = await findCriteria(by);

    criteria.sort((a, b) => a.code.localeCompare(b.code));

    return criteria;
}

export async function newCriteriaService(data: CriteriaType) {
    return await createCriteria(data);
}

export async function updateCriteriaService(id: string, data: CriteriaType) {
    const criteria = await updateCriteria(id, data);
    const clink = await createCriteriaLink(id)

    await patchClinkByCid(clink, criteria.id)
}

export async function deleteCriteriaService(id: string) {
    const children = await traversalChildren(id);
    const parent = await findCriteria({ id });
    const deletedList = children.concat(parent);
    const linkedFile = await findFileByCriteriaIdList(
        deletedList.map((v) => v.id),
    );

    const usagedFile = await findFileLinksByCriteriaIdListOuter(
        linkedFile.map((v) => v.id),
        deletedList.map((v) => v.id),
    );

    const deletedFileList = linkedFile.filter(
        (v) => !usagedFile.map((w) => w.fileId).includes(v.id),
    );

    await unLinkGroup(
        deletedList.map((v) => v.id),
        linkedFile.map((v) => v.id),
    );

    deletedFileList.map((v) => {
        try {
            unlinkSync(`./files/${v.fileName}`);
        }
        catch {
            return
        }
    });

    await deleteFileMultipleId(deletedFileList.map((v) => v.id));
    await deleteCriteriaMultipleId(deletedList.map((v) => v.id));
}

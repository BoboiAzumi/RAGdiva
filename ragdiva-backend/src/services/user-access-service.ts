import { findUserMajorAccess } from "../repositories/major-access-repo.js";

export async function getUserAccessService(userid: string) {
    const access = await findUserMajorAccess(userid)
    const accessIdArray = access.map((v) => v.majorId)

    return accessIdArray
}
import { prisma } from "../lib/database/database.js";

export async function countMajors(){
    return await prisma.majors.count()
}
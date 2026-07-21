import type { Status } from "../prisma/enums.js"

export type FileType = {
    title: string,
    fileName: string,
    fileHash: string,
    mimeType: string,
    status: Status
}

export type FileWithHashType = {
    file: File,
    hash: string,
    isExist?: boolean
}
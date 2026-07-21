import { readFileSync, unlinkSync, writeFileSync } from "fs";
import {
    deleteFile,
    findFileByHash,
    findFileById,
    insertFile,
    updateFile,
} from "../repositories/file-repo.js";
import type { FileWithHashType } from "../types/file-type.js";
import { fileHash } from "../utils/file-hash.js";
import { v4 } from "uuid";
import { createCriteriaLink } from "../repositories/criteria-repo.js";
import {
    countLinkByFileId,
    findLink,
    findLinkByHashCriteria,
    setLinkByHash,
    unLink,
    updatePage,
} from "../repositories/file-link-repo.js";
import { HTTPException } from "hono/http-exception";

export async function insertFileService(
    files: File[],
    cid: string,
    page: number = 1,
) {
    const clink = await createCriteriaLink(cid);

    const fileWithHash = await Promise.all(
        files.map(async (v): Promise<FileWithHashType> => {
            const hash = await fileHash(v);
            return { file: v, hash };
        }),
    );

    const fileWithExist = await Promise.all(
        fileWithHash.map(async (v): Promise<FileWithHashType> => {
            const fileInDB = await findFileByHash(v.hash);

            return { ...v, isExist: fileInDB ? true : false };
        }),
    );

    await Promise.all(
        fileWithExist.map(async (v) => {
            const fileNameSplit = v.file.name.split(".");
            const ext = fileNameSplit[fileNameSplit.length - 1];
            const newFileName = `${v4()}.${ext}`;

            if (!v.isExist) {
                writeFileSync(
                    `./files/${newFileName}`,
                    Buffer.from(await v.file.arrayBuffer()),
                );
                await insertFile([
                    {
                        title: v.file.name,
                        fileName: newFileName,
                        fileHash: v.hash,
                        mimeType: v.file.type,
                        status: "Processing",
                    },
                ]);
            }

            const existingLink = await findLinkByHashCriteria(cid, v.hash);
            if (!existingLink) {
                await setLinkByHash(cid, v.hash, clink, page);
            }
        }),
    );
}

export async function deleteFileService(criteriaId: string, fileId: string) {
    const file = await findFileById(fileId);
    const countLink = await countLinkByFileId(fileId);
    const links = await findLink(fileId, criteriaId);

    if (!file || links.length == 0) {
        throw new HTTPException(404, { message: "File not found" });
    }

    await unLink(links.map((v) => v.id));

    if (countLink > 1) {
        return;
    }

    await deleteFile(file.id);

    unlinkSync(`./files/${file.fileName}`);

    return file;
}

export async function getFileService(id: string) {
    const fileInDB = await findFileById(id);

    if (!fileInDB) {
        throw new HTTPException(404, { message: "File not found" });
    }

    const file = readFileSync(`./files/${fileInDB?.fileName}`);

    return { file, fileInDB };
}

export async function updateFileService(file: File, fid: string) {
    const fileInDB = await findFileById(fid);

    if (!fileInDB) {
        throw new HTTPException(404, { message: "File not found" });
    }

    const hash = await fileHash(file);

    if (fileInDB.fileHash == hash) {
        return;
    }

    unlinkSync(`./files/${fileInDB.fileName}`)

    const fileNameSplit = file.name.split(".");
    const ext = fileNameSplit[fileNameSplit.length - 1];
    const newFileName = `${v4()}.${ext}`;

    writeFileSync(
        `./files/${newFileName}`,
        Buffer.from(await file.arrayBuffer()),
    );

    await updateFile(fid, {
        title: file.name,
        fileName: newFileName,
        fileHash: hash,
        mimeType: file.type,
        status: "Processing",
    });
}

export async function updatePageService(fid: string, cid: string, page: number){
    return await updatePage(fid, cid, page)
}

import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import {
    deleteFileService,
    getFileService,
    insertFileService,
    updateFileService,
    updateFileStatusService,
    updatePageService,
} from "../services/file-service.js";
import { broadcasting } from "../lib/broadcast/broadcast.js";
import { dataInsertService } from "../services/rag-service.js";

export async function postFile(c: Context) {
    const cid = c.req.param()["cid"];
    const body = await c.req.parseBody();
    const value = body["files"];

    const files = Array.isArray(value)
        ? value.filter((item): item is File => item instanceof File)
        : value instanceof File
          ? [value]
          : [];

    if (files.length === 0) {
        throw new HTTPException(403, { message: "File not attached" });
    }

    const inserted = await insertFileService(
        files,
        cid,
        parseInt((body["page"] as string) ?? "1"),
    );

    const fileList = inserted.filter((v) => v != null)

    if(fileList.length != 0){
        dataInsertService(fileList.map((v) => v.id))
            .catch((e) => console.log(e))   
    }

    for (const file of files) {
        broadcasting("file", {
            message: "File Ditambahkan",
            data: `${c.get("fullName")} telah mengupload ${file.name}`,
        }).catch((e) => console.log(`ERROR: ${e.message}`));
    }

    return c.json({
        message: "File inserted",
    });
}

export async function deleteFile(c: Context) {
    const param = c.req.param();
    const criteriaId = param["cid"];
    const fileId = param["fid"];

    const file = await deleteFileService(criteriaId, fileId);

    broadcasting("file", {
        message: "File dihapus",
        data: `${c.get("fullName")} telah menghapus ${file?.title}`,
    }).catch((e) => console.log(`ERROR: ${e.message}`));

    return c.json({
        message: "File deleted",
    });
}

export async function getFile(c: Context) {
    const fileId = c.req.param()["id"];
    const isDownload = c.req.query()["download"];

    const { file, fileInDB } = await getFileService(fileId);

    return c.body(file, 200, {
        "Content-Type": fileInDB.mimeType,
        ... isDownload ? { "Content-Disposition": `attachment; filename="${fileInDB.title}"` } : {},
    });
}

export async function updateFile(c: Context) {
    const param = c.req.param();
    const body = await c.req.parseBody();
    const file = body["file"];
    const page = body["page"];
    const cid = param["cid"];
    const fid = param["fid"];

    if (!file) {
        throw new HTTPException(400, { message: "File not attached" });
    }

    if (!(file instanceof File)) {
        throw new HTTPException(400, { message: "File is not string" });
    }

    if (page instanceof File) {
        throw new HTTPException(400, { message: "Page is string" });
    }

    await updateFileService(file, fid);

    if (page) {
        await updatePageService(fid, cid, parseInt(page));
    }

    broadcasting("file", {
        message: "File Diperbarui",
        data: `${c.get("fullName")} telah memperbarui ${file.name}`,
    }).catch((e) => console.log(`ERROR: ${e.message}`));

    return c.json({
        message: "File updated",
    });
}

export async function reIngestion(c: Context){
    const { fileId } = await c.req.json()

    await updateFileStatusService(fileId, "Reprocessing")

    dataInsertService([fileId])
        .catch((e) => console.log(e))

    return c.json({
        message: "File re ingestions, please wait",
    });
}

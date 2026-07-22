import type { Context } from "hono";
import {
    deleteCriteriaService,
    findCriteriaService,
    newCriteriaService,
    updateCriteriaService,
} from "../services/criteria-service.js";
import { getUserAccessService } from "../services/user-access-service.js";
import type { CriteriaType } from "../types/criteria-type.js";
import { broadcasting } from "../lib/broadcast.js";
import { HTTPException } from "hono/http-exception";
import { findFilesByCriteriaIdService } from "../services/file-service.js";

export async function getRootCriteria(c: Context) {
    const access = await getUserAccessService(c.get("userid"));
    const criteria = await findCriteriaService({
        access,
        parent: null,
    });
    
    return c.json(
        {
            message: "Successfully fetch criteria",
            data: criteria,
        },
        200,
    );
}

export async function postCriteria(c: Context) {
    const body = await c.req.json();
    const parent = c.req.param();

    const data: CriteriaType = {
        parent: parent["id"] ?? null,
        code: body.code ?? "",
        name: body.name,
        description: body.description ?? "",
        access: body.access ? body.access : body.access === "" ? null : null,
    };

    await newCriteriaService(data);

    broadcasting("criteria", {
        message: parent == undefined ? "Dokumen Baru" : "Kriteria Baru",
        data: `${c.get("fullName")} telah menambahkan "${body.code ? `${body.code}. ` : ""}${body.name}"`,
    }).catch((e) => console.log(`ERROR: ${e.message}`));

    return c.json({ message: "criteria created" });
}

export async function getCriteria(c: Context) {
    const access = await getUserAccessService(c.get("userid"));
    const parent = c.req.param();
    const criteria = await findCriteriaService({
        access,
        id: parent["id"],
    });

    const children = await findCriteriaService({
        access,
        parent: parent["id"],
    });

    const files = await findFilesByCriteriaIdService(parent["id"]);

    return c.json(
        {
            message: "Successfully fetch data",
            data: {
                criteria: criteria.length != 0 ? criteria[0] : {},
                children: children.length != 0 ? children : [],
                files,
            },
        },
        200,
    );
}

export async function patchCriteria(c: Context) {
    const id = c.req.param()["id"];
    const data = await c.req.json();

    const body = await findCriteriaService({ id });

    if (body.length == 0) {
        throw new HTTPException(404, { message: "Criteria not found" });
    }

    await updateCriteriaService(id, data);

    broadcasting("criteria", {
        message:
            body[0].parent == undefined
                ? "Dokumen Diperbarui"
                : "Kriteria Diperbarui",
        data: `${c.get("fullName")} telah memperbarui "${body[0].code ? `${body[0].code}. ` : ""}${body[0].name}"`,
    }).catch((e) => console.log(`ERROR: ${e.message}`));

    return c.json({
        message: "Successfully patch criteria",
    });
}

export async function deleteCriteria(c: Context) {
    const id = c.req.param()["id"];
    const criteria = await findCriteriaService({ id });

    if (criteria.length === 0) {
        throw new HTTPException(404, { message: "Criteria not found" });
    }

    await deleteCriteriaService(id);

    broadcasting("criteria", {
        message: "Dokumen Dihapus",
        data: `${c.get("fullName")} telah memperbarui "${criteria[0].code ? `${criteria[0].code}. ` : ""}${criteria[0].name}"`,
    }).catch((e) => console.log(`ERROR: ${e.message}`));

    return c.json({
        message: "Successfully delete criteria",
    });
}

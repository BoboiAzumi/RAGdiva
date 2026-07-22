import type { FileType } from "./file-types";

export type CriteriaType = {
    id: string;
    parent: string | null;
    code: string;
    name: string;
    description: string;
    access: string | null;
};

export type CriteriaResponseType = {
    message: string;
    data: CriteriaType[];
};

export type CriteriaDetailData = {
    criteria: CriteriaType;
    children: CriteriaType[];
    files: FileType[];
};

export type CriteriaGetResponseType = {
    message: string;
    data: CriteriaDetailData;
};

export type CriteriaPostType = Omit<CriteriaType, "id" | "parent">;
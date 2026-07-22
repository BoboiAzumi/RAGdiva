export type CriteriaType = {
    id: string;
    parent: string | null;
    code: string;
    name: string;
    description: string;
    access: string | null;
};

export type CriteriaResponseType = {
    message: string,
    data: CriteriaType[]
}

export type CriteriaPostType = Omit<CriteriaType, "id" | "parent">
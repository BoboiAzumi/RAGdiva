export type CriteriaFindType = {
    id?: string,
    parent?: string | null,
    access?: string[],
    name?: string
}

export type CriteriaType = {
    parent?: string,
    code?: string,
    name: string,
    description?: string,
    access?: string
}
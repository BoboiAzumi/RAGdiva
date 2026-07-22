export const criteriaKeys = {
    all: ["criteria"] as const,
    search: (v: string) => ["criteria", v],
    get: (id: string, q: string) => ["criteria", id, q]
}
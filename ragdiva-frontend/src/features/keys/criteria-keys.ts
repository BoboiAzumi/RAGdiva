export const criteriaKeys = {
    all: ["criteria"] as const,
    search: (v: string) => ["criteria", v]
}
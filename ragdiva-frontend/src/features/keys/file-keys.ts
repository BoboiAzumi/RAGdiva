export const fileKeys = {
    all: ["file"] as const,
    search: (v: string) => ["file", v]
}

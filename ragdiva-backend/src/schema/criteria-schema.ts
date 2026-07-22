import z from "zod";

export const CriteriaPostSchema = z.object({
    code: z.string().optional(),
    name: z.string(),
    description: z.string().optional(),
    access: z.string().optional().nullable(),
    id: z.string().optional()
})
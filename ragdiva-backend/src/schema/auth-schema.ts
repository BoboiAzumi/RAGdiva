import z from "zod";

export const LoginSchema = z.object({
    username: z.string().min(4),
    password: z.string().min(8)
})
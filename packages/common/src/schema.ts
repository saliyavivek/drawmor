import { z } from "zod";

export const authSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters"),

    password: z
        .string()
        .min(4, "Password must be at least 4 characters")
        .max(20, "Password must be at most 20 characters")
});

export const roomSchema = z.object({
    name: z.string()
        .min(3, "Canvas name must be at least 3 characters")
        .max(10, "Canvas name must be at most 10 characters"),

    password: z.string().optional().or(z.literal('')),

    isPrivate: z.boolean()
})
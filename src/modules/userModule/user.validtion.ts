import z from "zod"

export const confirmEmailSchema = z.object({
    name: z.string().min(5)
})
import z from "zod";
export  const urlValidation=z.object({
    url: z.string().url(),
    code: z.string().optional(),
}) 
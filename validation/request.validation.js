import z, { email, string } from "zod";
export const signupPostRequestValidation=z.object({
    firstName: string(),
    lastName: string().optional(),
    email: email(),
    password : string().min(3),
})
export const loginPostRequestValidation=z.object({
    email: z.email(),
    password: z.string().min(3),
})
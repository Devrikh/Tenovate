import {z} from "zod"

export const orgCreateSchema= z.object({
    orgName: z
    .string()
    .trim()
    .min(2)
    .max(100),

  planName: z
    .string()
    .trim()
    .min(2)
    .max(100),
})

export const rolePatchSchema= z.object({
    roleName: z
    .string()
    .trim()
    .min(2)
    .max(100)
})
import {z} from "zod";

export const tokenSchema= z.object({
   
  token: z
    .string()
    .length(64, "Invalid token")
    .regex(/^[a-f0-9]+$/, "Invalid token format")
})

export const invitationSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),

  role: z.enum(["MEMBER", "ADMIN"] as const)
});
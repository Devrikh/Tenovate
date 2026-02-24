import { z } from "zod";
export const userSignupSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email address"),
    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(64, "Password must be at most 64 characters")
        .regex(/[A-Z]/, "Password must include at least one uppercase letter")
        .regex(/[a-z]/, "Password must include at least one lowercase letter")
        .regex(/[0-9]/, "Password must include at least one number"),
});
export const userLoginSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(64, "Password must be at most 64 characters")
});
//# sourceMappingURL=authSchema.js.map
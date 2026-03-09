import { z } from "zod";
export const createProjectSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Project name must be at least 2 characters")
        .max(100, "Project name must be at most 100 characters")
        .regex(/^[a-zA-Z0-9\s\-_.]+$/, "Project name can only contain letters, numbers, spaces, dash, underscore, and dot"),
});
export const patchProjectSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Project name must be at least 2 characters")
        .max(100, "Project name must be at most 100 characters")
        .regex(/^[a-zA-Z0-9\s\-_.]+$/, "Project name can only contain letters, numbers, spaces, dash, underscore, and dot"),
});
export const deleteProjectSchema = z.object({
    projectId: z
        .string()
        .cuid("Invalid project ID")
});
export const fetchProjectSchema = z.object({
    projectId: z
        .string()
        .cuid("Invalid project ID")
});
//# sourceMappingURL=projectSchema.js.map
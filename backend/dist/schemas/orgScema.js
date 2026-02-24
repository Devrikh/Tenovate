import { z } from "zod";
export const orgCreateSchema = z.object({
    orgName: z
        .string()
        .trim()
        .min(2)
        .max(100),
    planId: z
        .string()
        .cuid("Invalid plan ID"),
});
//# sourceMappingURL=orgScema.js.map
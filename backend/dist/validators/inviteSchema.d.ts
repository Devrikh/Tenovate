import { z } from "zod";
export declare const tokenSchema: z.ZodObject<{
    token: z.ZodString;
}, z.core.$strip>;
export declare const invitationSchema: z.ZodObject<{
    email: z.ZodString;
    role: z.ZodEnum<{
        MEMBER: "MEMBER";
        ADMIN: "ADMIN";
        MODERATOR: "MODERATOR";
    }>;
}, z.core.$strip>;
//# sourceMappingURL=inviteSchema.d.ts.map
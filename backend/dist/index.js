import express from "express";
import cors from "cors";
import { prismaClient } from "./lib/prisma.js";
import authRouter from "./routes/authRoutes.js";
import env from "dotenv";
import orgRouter from "./routes/orgRoutes.js";
import projRouter from "./routes/projectRoutes.js";
const app = express();
env.config();
app.use(express.json());
app.use(cors());
const PORT = 3000;
app.get("/", (req, res) => {
    res.json({
        message: "API Running"
    });
});
app.get("/test-db", async (req, res) => {
    await prismaClient.$connect();
    res.json({
        message: "connected"
    });
});
app.get("/seed-db", async (req, res) => {
    try {
        await prismaClient.$connect();
        console.log("Seeding database");
        await prismaClient.$connect();
        const adminRole = await prismaClient.role.upsert({
            where: { name: "Admin" },
            update: {},
            create: { name: "Admin" },
        });
        const memberRole = await prismaClient.role.upsert({
            where: { name: "Member" },
            update: {},
            create: { name: "Member" },
        });
        const projectCreatePermission = await prismaClient.permission.upsert({
            where: { key: "project:create" },
            update: {},
            create: { key: "project:create" },
        });
        const projectReadPermission = await prismaClient.permission.upsert({
            where: { key: "project:read" },
            update: {},
            create: { key: "project:read" },
        });
        const projectDeletePermission = await prismaClient.permission.upsert({
            where: { key: "project:delete" },
            update: {},
            create: { key: "project:delete" },
        });
        const memberInvitePermission = await prismaClient.permission.upsert({
            where: { key: "member:invite" },
            update: {},
            create: { key: "member:invite" },
        });
        //Admin has all permissions
        await prismaClient.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: adminRole.id,
                    permissionId: projectCreatePermission.id,
                },
            },
            update: {},
            create: {
                roleId: adminRole.id,
                permissionId: projectCreatePermission.id,
            },
        });
        await prismaClient.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: adminRole.id,
                    permissionId: projectReadPermission.id,
                },
            },
            update: {},
            create: {
                roleId: adminRole.id,
                permissionId: projectReadPermission.id,
            },
        });
        await prismaClient.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: adminRole.id,
                    permissionId: projectDeletePermission.id,
                },
            },
            update: {},
            create: {
                roleId: adminRole.id,
                permissionId: projectDeletePermission.id,
            },
        });
        await prismaClient.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: adminRole.id,
                    permissionId: memberInvitePermission.id,
                },
            },
            update: {},
            create: {
                roleId: adminRole.id,
                permissionId: memberInvitePermission.id,
            },
        });
        //Members only read
        await prismaClient.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: memberRole.id,
                    permissionId: projectReadPermission.id,
                },
            },
            update: {},
            create: {
                roleId: memberRole.id,
                permissionId: projectReadPermission.id,
            },
        });
        const freePlan = await prismaClient.plan.upsert({
            where: { name: "FREE" },
            update: {},
            create: { name: "FREE" },
        });
        const proPlan = await prismaClient.plan.upsert({
            where: { name: "PRO" },
            update: {},
            create: { name: "PRO" },
        });
        const mythicPlan = await prismaClient.plan.upsert({
            where: { name: "MYTHIC" },
            update: {},
            create: { name: "MYTHIC" },
        });
        const projectCreateFeature = await prismaClient.feature.upsert({
            where: { key: "project:create" },
            update: {},
            create: { key: "project:create" },
        });
        const memberInviteFeature = await prismaClient.feature.upsert({
            where: { key: "member:invite" },
            update: {},
            create: { key: "member:invite" },
        });
        await prismaClient.planFeature.upsert({
            where: { planId_featureId: { planId: freePlan.id, featureId: projectCreateFeature.id } },
            update: {},
            create: { planId: freePlan.id, featureId: projectCreateFeature.id, limit: 3 },
        });
        await prismaClient.planFeature.upsert({
            where: { planId_featureId: { planId: freePlan.id, featureId: memberInviteFeature.id } },
            update: {},
            create: { planId: freePlan.id, featureId: memberInviteFeature.id, limit: 2 },
        });
        await prismaClient.planFeature.upsert({
            where: { planId_featureId: { planId: proPlan.id, featureId: projectCreateFeature.id } },
            update: {},
            create: { planId: proPlan.id, featureId: projectCreateFeature.id, limit: 10 },
        });
        await prismaClient.planFeature.upsert({
            where: { planId_featureId: { planId: proPlan.id, featureId: memberInviteFeature.id } },
            update: {},
            create: { planId: proPlan.id, featureId: memberInviteFeature.id, limit: 10 },
        });
        await prismaClient.planFeature.upsert({
            where: { planId_featureId: { planId: mythicPlan.id, featureId: projectCreateFeature.id } },
            update: {},
            create: { planId: mythicPlan.id, featureId: projectCreateFeature.id, limit: 50 },
        });
        await prismaClient.planFeature.upsert({
            where: { planId_featureId: { planId: mythicPlan.id, featureId: memberInviteFeature.id } },
            update: {},
            create: { planId: mythicPlan.id, featureId: memberInviteFeature.id, limit: null },
        });
        console.log("Database seeding complete.");
    }
    catch (e) {
        console.error(e);
        res.json({
            e
        });
    }
    res.json({
        message: "Seeded"
    });
});
app.use("/auth", authRouter);
app.use("/org", orgRouter);
app.use("/project", projRouter);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map
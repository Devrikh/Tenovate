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
        const projectCreate = await prismaClient.permission.upsert({
            where: { key: "project:create" },
            update: {},
            create: { key: "project:create" },
        });
        const projectRead = await prismaClient.permission.upsert({
            where: { key: "project:read" },
            update: {},
            create: { key: "project:read" },
        });
        const projectDelete = await prismaClient.permission.upsert({
            where: { key: "project:delete" },
            update: {},
            create: { key: "project:delete" },
        });
        const memberInvite = await prismaClient.permission.upsert({
            where: { key: "member:invite" },
            update: {},
            create: { key: "member:invite" },
        });
        //Admin has all permissions
        await prismaClient.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: adminRole.id,
                    permissionId: projectCreate.id,
                },
            },
            update: {},
            create: {
                roleId: adminRole.id,
                permissionId: projectCreate.id,
            },
        });
        await prismaClient.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: adminRole.id,
                    permissionId: projectRead.id,
                },
            },
            update: {},
            create: {
                roleId: adminRole.id,
                permissionId: projectRead.id,
            },
        });
        await prismaClient.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: adminRole.id,
                    permissionId: projectDelete.id,
                },
            },
            update: {},
            create: {
                roleId: adminRole.id,
                permissionId: projectDelete.id,
            },
        });
        await prismaClient.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: adminRole.id,
                    permissionId: memberInvite.id,
                },
            },
            update: {},
            create: {
                roleId: adminRole.id,
                permissionId: memberInvite.id,
            },
        });
        //Members only read
        await prismaClient.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: memberRole.id,
                    permissionId: projectRead.id,
                },
            },
            update: {},
            create: {
                roleId: memberRole.id,
                permissionId: projectRead.id,
            },
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
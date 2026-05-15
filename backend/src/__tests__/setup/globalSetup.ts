import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";

export default async function globalSetup(): Promise<void> {
  console.log("🔧 Running database migrations for test environment...");
  execSync("npx prisma migrate reset --force --skip-seed", {
    stdio: "inherit",
    env: { ...process.env },
  });

  const prisma = new PrismaClient();
  try {
    console.log("🌱 Seeding required baseline data...");

    await prisma.plan.upsert({ where: { name: "FREE" }, update: {}, create: { name: "FREE" } });
    await prisma.plan.upsert({ where: { name: "PRO" }, update: {}, create: { name: "PRO" } });
    await prisma.plan.upsert({ where: { name: "MYTHIC" }, update: {}, create: { name: "MYTHIC" } });

    const permissionKeys = [
      "role:read", "role:create", "role:update", "role:delete", "role:write",
      "member:read", "member:write", "member:delete", "member:update_role",
      "member:remove", "member:invite",
      "project:read", "project:create", "project:update", "project:delete", "project:write",
      "org:read", "org:update", "org:delete",
      "invite:create", "invite:read",
      "audit:read", "usage:read",
    ];

    for (const key of permissionKeys) {
      await prisma.permission.upsert({
        where: { key },
        update: {},
        create: { key },
      });
    }

    const ownerRole = await prisma.role.upsert({
      where: { name: "OWNER" },
      update: {},
      create: { name: "OWNER" },
    });

    await prisma.role.upsert({
  where: { name: "MEMBER" },
  update: {},
  create: { name: "MEMBER" },
});

    const allPerms = await prisma.permission.findMany();
    for (const perm of allPerms) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: ownerRole.id, permissionId: perm.id } },
        update: {},
        create: { roleId: ownerRole.id, permissionId: perm.id },
      });
    }

    const featureKeys = ["project:create", "member:invite"];
    for (const key of featureKeys) {
      await prisma.feature.upsert({
        where: { key },
        update: {},
        create: { key },
      });
    }

    // Only PRO and MYTHIC get features — FREE is intentionally ungated
    const paidPlans = await prisma.plan.findMany({
      where: { name: { in: ["PRO", "MYTHIC"] } },
    });
    const allFeatures = await prisma.feature.findMany();

    for (const plan of paidPlans) {
      for (const feature of allFeatures) {
        await prisma.planFeature.upsert({
          where: { planId_featureId: { planId: plan.id, featureId: feature.id } },
          update: {},
          create: { planId: plan.id, featureId: feature.id, limit: 3 },
        });
      }
    }

    console.log("✅ Test database ready.");
  } finally {
    await prisma.$disconnect();
  }
}
import type { Permission, Role } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient();
import bcrypt from "bcrypt";

const prisma = prismaClient;
async function main() {

  console.log("Seeding..")
  // --- Features ---
  const featureCreate = await prisma.feature.upsert({
    where: { key: "project:create" },
    update: {},
    create: { key: "project:create" },
  });

  const featureInvite = await prisma.feature.upsert({
    where: { key: "member:invite" },
    update: {},
    create: { key: "member:invite" },
  });

  // --- Plans ---
  const planFree = await prisma.plan.upsert({
    where: { name: "FREE" },
    update: {},
    create: { name: "FREE" },
  });

  const planPro = await prisma.plan.upsert({
    where: { name: "PRO" },
    update: {},
    create: { name: "PRO" },
  });

  const planMythic = await prisma.plan.upsert({
    where: { name: "MYTHIC" },
    update: {},
    create: { name: "MYTHIC" },
  });

  // --- Plan Features ---
  await prisma.planFeature.createMany({
    data: [
      { planId: planFree.id, featureId: featureCreate.id, limit: 3 },
      { planId: planFree.id, featureId: featureInvite.id, limit: 2 },
      { planId: planPro.id, featureId: featureCreate.id, limit: 10 },
      { planId: planPro.id, featureId: featureInvite.id, limit: 10 },
      { planId: planMythic.id, featureId: featureCreate.id, limit: 50 },
      { planId: planMythic.id, featureId: featureInvite.id, limit: null },
    ],
    skipDuplicates: true,
  });

  // --- Permissions ---
  const permissionKeys = [
    "org:read",
    "org:update",
    "org:delete",

    "project:create",
    "project:read",
    "project:update",
    "project:delete",

    "member:invite",
    "member:read",
    "member:update_role",
    "member:remove",

    "role:create",
    "role:read",
    "role:update",
    "role:delete",

    "billing:read",
    "billing:update",
    "usage:read",

    "audit:read",
  ];

  const permissions = new Map<string, Permission>();

  for (const key of permissionKeys) {
    const perm = await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key },
    });
    permissions.set(key, perm);
  }

  // --- Roles ---
  const roleNames = ["OWNER", "ADMIN", "MODERATOR", "MEMBER"];
  const roles = new Map<string, Role>();

  for (const name of roleNames) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    roles.set(name, role);
  }

  // --- Assign Permissions to Roles ---
  const rolePermissionsMap: { [key: string]: string[] } = {
    OWNER: permissionKeys,
    ADMIN: [
      "org:read",
      "org:update",

      "project:create",
      "project:read",
      "project:update",
      "project:delete",

      "member:invite",
      "member:read",
      "member:update_role",
      "member:remove",

      "role:create",
      "role:read",
      "role:update",
      "role:delete",

      "billing:read",
      "usage:read",

      "audit:read",
    ],
    MODERATOR: [
      "project:create",
      "project:read",
      "project:update",
      "project:delete",
      "member:invite",
      "member:read",
      "member:update_role",
      "usage:read",
    ],
    MEMBER: ["project:read", "org:read"],
  };

  for (const roleName of roleNames) {
    const permsForRole = rolePermissionsMap[roleName];
    const roleObj = roles.get(roleName);
    if (!roleObj) continue;

    for (const key of permsForRole!) {
      const permObj = permissions.get(key);
      if (!permObj) continue;

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId: roleObj.id, permissionId: permObj.id },
        },
        update: {},
        create: { roleId: roleObj.id, permissionId: permObj.id },
      });
    }
  }

  // --- Organization ---
  const org = await prisma.organization.upsert({
    where: { name: "ExampleOrg" },
    update: {},
    create: { name: "ExampleOrg", planId: planFree.id },
  });

  // --- Users ---
  const adminPassword = await bcrypt.hash("Admin123", 10);
  const memberPassword = await bcrypt.hash("Member123", 10);
  const ownerPassword = await bcrypt.hash("Owner123", 10);
  const moderatorPassword = await bcrypt.hash("Moderator123", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@example.com",
      password: adminPassword,
    },
  });

  const memberUser = await prisma.user.upsert({
    where: { email: "member@example.com" },
    update: {},
    create: {
      username: "member",
      email: "member@example.com",
      password: memberPassword,
    },
  });

  const ownerUser = await prisma.user.upsert({
    where: { email: "owner@example.com" },
    update: {},
    create: {
      username: "owner",
      email: "owner@example.com",
      password: ownerPassword,
    },
  });

  const moderatorUser = await prisma.user.upsert({
    where: { email: "moderator@example.com" },
    update: {},
    create: {
      username: "moderator",
      email: "moderator@example.com",
      password: moderatorPassword,
    },
  });

  // --- Employment ---
  const adminRole = roles.get("ADMIN");
  const memberRole = roles.get("MEMBER");
  const ownerRole = roles.get("OWNER");
  const moderatorRole = roles.get("MODERATOR");

  if (adminRole) {
    await prisma.membership.upsert({
      where: { userId_orgId: { userId: adminUser.id, orgId: org.id } },
      update: {},
      create: { userId: adminUser.id, orgId: org.id, roleId: adminRole.id },
    });
  }

  if (memberRole) {
    await prisma.membership.upsert({
      where: { userId_orgId: { userId: memberUser.id, orgId: org.id } },
      update: {},
      create: { userId: memberUser.id, orgId: org.id, roleId: memberRole.id },
    });
  }

   if (moderatorRole) {
    await prisma.membership.upsert({
      where: { userId_orgId: { userId: moderatorUser.id, orgId: org.id } },
      update: {},
      create: { userId: moderatorUser.id, orgId: org.id, roleId: moderatorRole.id },
    });
  }

   if (ownerRole) {
    await prisma.membership.upsert({
      where: { userId_orgId: { userId: ownerUser.id, orgId: org.id } },
      update: {},
      create: { userId: ownerUser.id, orgId: org.id, roleId: ownerRole.id },
    });
  }


  console.log(
    "Seed complete : 1 org, 4 users, 4 roles, permissions, plans, features",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

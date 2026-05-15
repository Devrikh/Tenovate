import request from "supertest";
import app from "@app";
import { PrismaClient } from "@prisma/client";
import { signupAndLogin, createOrg } from "../helpers/testHelpers";

const prisma = new PrismaClient();

const GATED_ENDPOINT = (orgId: string) =>
  `/api/v1/organizations/${orgId}/projects`;

describe("Feature Gating Middleware", () => {
  let adminToken: string;
  let freeOrgId: string;
  let proOrgId: string;

  beforeAll(async () => {
    ({ token: adminToken } = await signupAndLogin({
      email: "feature-gate@example.com",
      password: "P@ssw0rd!",
    }));

    freeOrgId = await createOrg(adminToken, "Free Tier Org", "FREE");
    proOrgId  = await createOrg(adminToken, "Pro Tier Org", "PRO");

    // Seed the feature and link it to PRO plan only
    await prisma.feature.upsert({
      where: { key: "project:create" },
      update: {},
      create: { key: "project:create" },
    });

    const feature = await prisma.feature.findUnique({ where: { key: "project:create" } });
    const proPlan = await prisma.plan.findUnique({ where: { name: "PRO" } });

    await prisma.planFeature.upsert({
      where: { planId_featureId: { planId: proPlan!.id, featureId: feature!.id } },
      update: {},
      create: { planId: proPlan!.id, featureId: feature!.id, limit: 10 },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("403 – FREE org cannot use a PRO-only feature", async () => {
    const res = await request(app)
      .post(GATED_ENDPOINT(freeOrgId))
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Blocked Project" });

    expect(res.status).toBe(403);
  });

  it("201 – PRO org can use the feature-gated endpoint", async () => {
    const res = await request(app)
      .post(GATED_ENDPOINT(proOrgId))
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Allowed Project" });

    expect(res.status).toBe(201);
  });

  it("403 – removing feature from plan immediately blocks access", async () => {
    const feature = await prisma.feature.findUnique({ where: { key: "project:create" } });
    const proPlan = await prisma.plan.findUnique({ where: { name: "PRO" } });

    await prisma.planFeature.delete({
      where: { planId_featureId: { planId: proPlan!.id, featureId: feature!.id } },
    });

    const res = await request(app)
      .post(GATED_ENDPOINT(proOrgId))
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Now Blocked Project" });

    expect(res.status).toBe(403);
  });
});
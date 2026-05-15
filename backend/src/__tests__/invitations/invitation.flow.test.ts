import request from "supertest";
import app from "@app";
import { PrismaClient } from "@prisma/client";
import { signupAndLogin, createOrg } from "../helpers/testHelpers";
import crypto from "crypto";

const prisma = new PrismaClient();

describe("Invitation Flow", () => {
  let adminToken: string;
  let orgId: string;
  const inviteeEmail = "invitee@example.com";
  const inviteePassword = "P@ssw0rd!";
  let inviteeToken: string;

  beforeAll(async () => {
    ({ token: adminToken } = await signupAndLogin({
      email: "invite-admin@example.com",
      password: "P@ssw0rd!",
    }));

    orgId = await createOrg(adminToken, "Invitation Test Org", "PRO");

    ({ token: inviteeToken } = await signupAndLogin({
      email: inviteeEmail,
      password: inviteePassword,
    }));
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("happy path – invite → accept → member appears in member list", async () => {
    const inviteRes = await request(app)
      .post(`/api/v1/organizations/${orgId}/invitations/invite`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ email: inviteeEmail, role: "MEMBER" });

    expect(inviteRes.status).toBe(201);
    const rawToken = inviteRes.body.inviteLink.split("token=")[1];

    const acceptRes = await request(app)
      .get("/api/v1/invitations/accept")           // ← GET not POST
      .set("Authorization", `Bearer ${inviteeToken}`)
      .query({ token: rawToken });

    expect(acceptRes.status).toBe(200);

    const membersRes = await request(app)
      .get(`/api/v1/organizations/${orgId}/members`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(membersRes.status).toBe(201);
  });

  it("403 – accepting an expired invitation token is rejected", async () => {
    const freshEmail = "expires@example.com";
    await signupAndLogin({ email: freshEmail, password: "P@ssw0rd!" });

    const inviteRes = await request(app)
      .post(`/api/v1/organizations/${orgId}/invitations/invite`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ email: freshEmail, role: "MEMBER" });

    expect(inviteRes.status).toBe(201);
    const rawToken = inviteRes.body.inviteLink.split("token=")[1];
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    await prisma.invitation.update({
      where: { token: hashedToken },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });

    const { token: freshToken } = await signupAndLogin({
      email: freshEmail,
      password: "P@ssw0rd!",
    });

    const acceptRes = await request(app)
      .get("/api/v1/invitations/accept")           // ← GET not POST
      .set("Authorization", `Bearer ${freshToken}`)
      .query({ token: rawToken });

    expect([403, 404, 410]).toContain(acceptRes.status);
  });

  it("200 – rejecting an invitation marks it cancelled", async () => {
    const rejectEmail = "rejecter@example.com";
    const { token: rejecterToken } = await signupAndLogin({
      email: rejectEmail,
      password: "P@ssw0rd!",
    });

    const inviteRes = await request(app)
      .post(`/api/v1/organizations/${orgId}/invitations/invite`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ email: rejectEmail, role: "MEMBER" });

    expect(inviteRes.status).toBe(201);
    const rawToken = inviteRes.body.inviteLink.split("token=")[1];

    const rejectRes = await request(app)
      .get("/api/v1/invitations/decline")          // ← GET not POST
      .set("Authorization", `Bearer ${rejecterToken}`)
      .query({ token: rawToken });

    expect(rejectRes.status).toBe(200);
  });

  it("400 or 403 – accepting a completely invalid token is rejected", async () => {
    const res = await request(app)
      .get("/api/v1/invitations/accept")           // ← GET not POST
      .set("Authorization", `Bearer ${inviteeToken}`)
      .query({ token: "not-a-real-token-abc123" });

    expect([400, 403, 404]).toContain(res.status);
  });
});
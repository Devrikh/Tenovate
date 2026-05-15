import request from "supertest";
import app from "@app";
import { signupAndLogin, createOrg, createRole } from "../helpers/testHelpers";

describe("RBAC Permission Middleware", () => {
  let adminToken: string;
  let memberToken: string;
  let memberId: string;
  let orgId: string;
  let memberRoleId: string;

  beforeAll(async () => {
    ({ token: adminToken } = await signupAndLogin({
      email: "rbac-admin@example.com",
      password: "P@ssw0rd!",
    }));

    orgId = await createOrg(adminToken, "RBAC Test Org", "PRO");

    memberRoleId = await createRole(adminToken, orgId, "ReadOnlyMember", [
      "project:read",
    ]);

    const memberCreds = { email: "rbac-member@example.com", password: "P@ssw0rd!" };
    let memberUserId: string;
    ({ token: memberToken, userId: memberUserId } = await signupAndLogin(memberCreds));
    memberId = memberUserId;

    const inviteRes = await request(app)
      .post(`/api/v1/organizations/${orgId}/invitations/invite`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ email: memberCreds.email, role: "MEMBER" });

    if (inviteRes.status === 201) {
      const rawToken = inviteRes.body.inviteLink.split("token=")[1];
      await request(app)
        .post("/api/v1/invitations/accept")
        .set("Authorization", `Bearer ${memberToken}`)
        .query({ token: rawToken });
    }
  });

  it("403 – MEMBER cannot change another member's role", async () => {
    const res = await request(app)
      .patch(`/api/v1/organizations/${orgId}/members/${memberId}/role`)
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ roleId: memberRoleId });
    expect(res.status).toBe(403);
  });

  it("403 – MEMBER cannot remove another member from the org", async () => {
    const res = await request(app)
      .delete(`/api/v1/organizations/${orgId}/members/${memberId}`)
      .set("Authorization", `Bearer ${memberToken}`);
    expect(res.status).toBe(403);
  });

  it("403 – MEMBER cannot create a new role", async () => {
    const res = await request(app)
      .post(`/api/v1/organizations/${orgId}/roles`)
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ roleName: "Infiltrator", permissions: ["project:read"] });
    expect(res.status).toBe(403);
  });

  it("403 or 404 – MEMBER cannot update an existing role", async () => {
    const res = await request(app)
      .patch(`/api/v1/organizations/${orgId}/roles/${memberRoleId}`)
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ permissions: ["project:read", "project:write"] });
    expect([403, 404]).toContain(res.status);
  });

  it("403 or 404 – MEMBER cannot delete a role", async () => {
    const res = await request(app)
      .delete(`/api/v1/organizations/${orgId}/roles/${memberRoleId}`)
      .set("Authorization", `Bearer ${memberToken}`);
    expect([403, 404]).toContain(res.status);
  });

  it("201 – ADMIN can list members (admin permission)", async () => {
    const res = await request(app)
      .get(`/api/v1/organizations/${orgId}/members`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(201);
  });

  it("403 – MEMBER without org membership cannot list projects", async () => {
    const res = await request(app)
      .get(`/api/v1/organizations/${orgId}/projects`)
      .set("Authorization", `Bearer ${memberToken}`);
    expect(res.status).toBe(403);
  });
});
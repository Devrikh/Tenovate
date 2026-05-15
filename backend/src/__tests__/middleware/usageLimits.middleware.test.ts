import request from "supertest";
import app from "@app";
import { signupAndLogin, createOrg } from "../helpers/testHelpers";

const MAX_PROJECTS_FREE = 3;

describe("Usage Limit Enforcement — max projects", () => {
  let adminToken: string;
  let orgId: string;
  const createdProjectIds: string[] = [];

  beforeAll(async () => {
    ({ token: adminToken } = await signupAndLogin({
      email: "usage-limit@example.com",
      password: "P@ssw0rd!",
    }));

    orgId = await createOrg(adminToken, "Usage Limit Org", "PRO");
  });

  it(`201 – can create up to ${MAX_PROJECTS_FREE} projects`, async () => {
    for (let i = 0; i < MAX_PROJECTS_FREE; i++) {
      const res = await request(app)
        .post(`/api/v1/organizations/${orgId}/projects`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: `Project ${i + 1}` });

      expect(res.status).toBe(201);
      createdProjectIds.push(res.body.project.id as string);
    }
  });

  it("403 – creating one more project beyond the limit is rejected", async () => {
    const res = await request(app)
      .post(`/api/v1/organizations/${orgId}/projects`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Over-limit Project" });

    expect(res.status).toBe(403);
    expect(res.body.message ?? res.body.error).toMatch(
      /limit|quota|maximum|exceeded|not available/i
    );
  });

  it("usage endpoint reports the org is at its project limit", async () => {
    const res = await request(app)
      .get(`/api/v1/organizations/${orgId}/usage`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(201);
    const projectUsage = res.body.usage.find(
      (u: { featureKey: string }) => u.featureKey === "project:create"
    );
    expect(projectUsage.count).toBe(MAX_PROJECTS_FREE);
    expect(projectUsage.limit).toBe(MAX_PROJECTS_FREE);
  });

  it("201 – deleting a project frees quota and allows a new create", async () => {
    const toDelete = createdProjectIds[0];
    const deleteRes = await request(app)
      .delete(`/api/v1/organizations/${orgId}/projects/${toDelete}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect([200, 201]).toContain(deleteRes.status);

    const createRes = await request(app)
      .post(`/api/v1/organizations/${orgId}/projects`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Replacement Project" });

    expect(createRes.status).toBe(201);
  });
});

describe("Usage Limit Enforcement — max members", () => {
  it.todo("403 – inviting beyond the member limit is rejected");
  it.todo("usage endpoint reports member count correctly");
});
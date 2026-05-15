import request from "supertest";
import app from "../../app";

// ─── Auth helpers ───────────────────────────────────────────────────────────

export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  token: string;
  userId: string;
}

export async function signupAndLogin(creds: UserCredentials): Promise<AuthResult> {
  const username = creds.email.split("@")[0]!.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 20);
  
  await request(app).post("/api/v1/auth/signup").send({
    username,
    ...creds,
  });

  const res = await request(app).post("/api/v1/auth/login").send(creds);
  
  if (res.status !== 200) {
    throw new Error(`Login failed with ${res.status}: ${JSON.stringify(res.body)}`);
  }

  return {
    token: res.body.token,
    userId: res.body.user.id,
  };
}
// ─── Org helpers ─────────────────────────────────────────────────────────────

export async function createOrg(token: string, name = "Test Org", planName = "FREE"): Promise<string> {
  const res = await request(app)
    .post("/api/v1/organizations")
    .set("Authorization", `Bearer ${token}`)
    .send({ orgName: name, planName });

  if (res.status !== 201) {
    throw new Error(`createOrg failed with ${res.status}: ${JSON.stringify(res.body)}`);
  }
  return res.body.organization.id as string;
}

// ─── Role helpers ─────────────────────────────────────────────────────────────

export async function createRole(
  token: string,
  orgId: string,
  roleName: string,
  permissions: string[]
): Promise<string> {
  const res = await request(app)
    .post(`/api/v1/organizations/${orgId}/roles`)
    .set("Authorization", `Bearer ${token}`)
    .send({ roleName, permissions });

  if (res.status !== 201) {
    throw new Error(`createRole failed with ${res.status}: ${JSON.stringify(res.body)}`);
  }

  const rolesRes = await request(app)
    .get(`/api/v1/organizations/${orgId}/roles`)
    .set("Authorization", `Bearer ${token}`);

  const role = rolesRes.body.roles.find((r: { name: string }) => r.name === roleName);
  return role.id as string;
}

// ─── Member helpers ───────────────────────────────────────────────────────────

export async function assignRole(
  adminToken: string,
  orgId: string,
  userId: string,
  roleId: string
): Promise<void> {
  const res = await request(app)
    .patch(`/api/v1/organizations/${orgId}/members/${userId}/role`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ roleId });

  expect(res.status).toBe(200);
}

// ─── Feature helpers ──────────────────────────────────────────────────────────

export async function setFeature(
  adminToken: string,
  orgId: string,
  featureKey: string,
  enabled: boolean
): Promise<void> {
  const res = await request(app)
    .patch(`/api/v1/organizations/${orgId}/features`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ [featureKey]: enabled });

  expect(res.status).toBe(200);
}

// ─── Token forge helpers ──────────────────────────────────────────────────────

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "test-secret";

/** Create a token that expired 1 hour ago */
export function makeExpiredToken(userId = "fake-user-id"): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: -3600 });
}

/** Create a token signed with a wrong secret */
export function makeTamperedToken(userId = "fake-user-id"): string {
  return jwt.sign({ userId }, "wrong-secret", { expiresIn: "1h" });
}
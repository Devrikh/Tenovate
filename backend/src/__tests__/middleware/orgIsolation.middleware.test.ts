/**
 * Organization Isolation Tests  (the critical multi-tenant boundary)
 *
 * These tests verify that a user who belongs to Org A cannot read, write,
 * or delete any resources belonging to Org B.
 *
 * This is the most important security invariant in a multi-tenant system.
 * A breach here means tenant data leaks across customers — game over.
 *
 * Coverage:
 *   GET  /organizations/:orgId            → 403 for outsider
 *   GET  /organizations/:orgId/members    → 403 for outsider
 *   GET  /organizations/:orgId/projects   → 403 for outsider
 *   POST /organizations/:orgId/projects   → 403 for outsider
 *   GET  /organizations/:orgId/audit-logs → 403 for outsider
 */

import request from "supertest";
import app from "@app";
import {
  signupAndLogin,
  createOrg,
} from "../helpers/testHelpers";

describe("Organization Context Middleware — tenant isolation", () => {
  // Tenant A: the legitimate owner of their org.
  let tokenA: string;
  let orgAId: string;

  // Tenant B: a completely separate customer.
  let tokenB: string;

  beforeAll(async () => {
    ({ token: tokenA } = await signupAndLogin({
      email: "tenant-a@example.com",
      password: "P@ssw0rd!",
    }));

    ({ token: tokenB } = await signupAndLogin({
      email: "tenant-b@example.com",
      password: "P@ssw0rd!",
    }));

    // Only Tenant A creates an org — B has no membership in it.
    orgAId = await createOrg(tokenA, "Tenant A Corp");
  });

  // ── Read org ──────────────────────────────────────────────────────────────

  it("403 – user from Org B cannot read Org A's details", async () => {
    const res = await request(app)
      .get(`/api/v1/organizations/${orgAId}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.status).toBe(403);
  });

  // ── Read members ──────────────────────────────────────────────────────────

  it("403 – user from Org B cannot list Org A's members", async () => {
    const res = await request(app)
      .get(`/api/v1/organizations/${orgAId}/members`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.status).toBe(403);
  });

  // ── Read projects ─────────────────────────────────────────────────────────

  it("403 – user from Org B cannot list Org A's projects", async () => {
    const res = await request(app)
      .get(`/api/v1/organizations/${orgAId}/projects`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.status).toBe(403);
  });

  // ── Write project ─────────────────────────────────────────────────────────

  it("403 – user from Org B cannot create a project inside Org A", async () => {
    const res = await request(app)
      .post(`/api/v1/organizations/${orgAId}/projects`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ name: "Injected Project" });

    expect(res.status).toBe(403);
  });

  // ── Delete org ────────────────────────────────────────────────────────────

  it("403 – user from Org B cannot delete Org A", async () => {
    const res = await request(app)
      .delete(`/api/v1/organizations/${orgAId}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.status).toBe(403);
  });

  // ── Read audit logs ───────────────────────────────────────────────────────

  it("403 – user from Org B cannot read Org A's audit logs", async () => {
    const res = await request(app)
      .get(`/api/v1/organizations/${orgAId}/audit-logs`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.status).toBe(403);
  });

  // ── Sanity: owner still has access ────────────────────────────────────────

  it("200 – Org A's own member can still read their org", async () => {
    const res = await request(app)
      .get(`/api/v1/organizations/${orgAId}`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.organization.id).toBe(orgAId);
  });
});

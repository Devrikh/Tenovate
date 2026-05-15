/**
 * Auth Middleware Tests
 *
 * Verifies that the JWT authentication middleware correctly rejects:
 *   - Expired tokens            → 401
 *   - Tampered / bad-sig tokens → 401
 *   - Missing token             → 401
 *
 * A valid token should pass through and reach the protected route.
 */

import request from "supertest";
import app from "@app";
import {
  signupAndLogin,
  makeExpiredToken,
  makeTamperedToken,
} from "../helpers/testHelpers";

// Any protected endpoint works here; /auth/me is purpose-built for this check.
const PROTECTED = "/api/v1/auth/me";

describe("Auth Middleware", () => {
  let validToken: string;

  beforeAll(async () => {
    const creds = { email: "auth-mw@example.com", password: "P@ssw0rd!" };
    ({ token: validToken } = await signupAndLogin(creds));
  });

  // ── Happy path ────────────────────────────────────────────────────────────

  it("200 – valid token reaches the protected route", async () => {
    const res = await request(app)
      .get(PROTECTED)
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
  });

  // ── Expired token ─────────────────────────────────────────────────────────

  it("401 – expired JWT is rejected", async () => {
    const expiredToken = makeExpiredToken();

    const res = await request(app)
      .get(PROTECTED)
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
    // The response body should signal WHY — not just that access is denied.
    expect(res.body.message ?? res.body.error).toMatch(/expired/i);
  });

  // ── Tampered token ────────────────────────────────────────────────────────

  it("401 – token signed with wrong secret is rejected", async () => {
    const tamperedToken = makeTamperedToken();

    const res = await request(app)
      .get(PROTECTED)
      .set("Authorization", `Bearer ${tamperedToken}`);

    expect(res.status).toBe(401);
    expect(res.body.message ?? res.body.error).toMatch(/invalid|signature/i);
  });

  // ── Missing token ─────────────────────────────────────────────────────────

  it("401 – request with no Authorization header is rejected", async () => {
    const res = await request(app).get(PROTECTED);

    expect(res.status).toBe(401);
  });

  // ── Malformed header ──────────────────────────────────────────────────────

  it("401 – 'Bearer ' prefix with no token is rejected", async () => {
    const res = await request(app)
      .get(PROTECTED)
      .set("Authorization", "Bearer ");

    expect(res.status).toBe(401);
  });
});

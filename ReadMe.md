# Tenovate — Multi-Tenant SaaS Infrastructure Backend

> **Live API Docs → [https://tenovate.onrender.com/api/v1/docs/](https://tenovate.onrender.com/api/v1/docs/)**

![CI](https://img.shields.io/github/actions/workflow/status/Devrikh/Tenovate/ci.yml?style=for-the-badge&label=CI&logo=githubactions&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

A reusable backend infrastructure layer for building SaaS applications. Instead of rebuilding authentication, multi-tenancy, RBAC, feature gating, usage limits, and audit logging for every product, Tenovate centralizes these into a modular API that any SaaS application can integrate with.

---

## Core Capabilities

- Multi-tenant organization management with strict tenant isolation
- Database-driven role-based access control (RBAC)
- Secure token-based invitation and onboarding flow
- Feature gating per subscription plan (Free / Pro / Mythic)
- Usage tracking and limit enforcement per organization
- Audit logging for all significant actions

---

## Middleware Pipeline

Every request passes through a layered pipeline. Each layer has a single responsibility and fails fast — controllers only run if all checks pass.

```mermaid
flowchart TD
    A([Incoming Request]) --> B[Auth Middleware\nVerifies JWT · Attaches user to req]
    B --> C[Org Context Middleware\nVerifies membership · Attaches org + features to req]
    C --> D[RBAC Permission Check\nLooks up role permissions in DB · 403 if missing]
    D --> E[Feature Access Check\nChecks plan features in DB · 403 if not enabled]
    E --> F[Usage Limit Enforcement\nChecks usage count vs limit · 403 if exceeded]
    F --> G([Controller\nPure business logic — no auth checks needed])

    B -->|Invalid / expired JWT| X1([401 Unauthorized])
    C -->|Not a member of this org| X2([403 Forbidden])
    D -->|Missing permission| X3([403 Forbidden])
    E -->|Feature not on plan| X4([403 Forbidden])
    F -->|Quota exhausted| X5([403 Limit Reached])
```

---

## Database Schema

```mermaid
erDiagram
    User {
        string id PK
        string username
        string email
        string password
    }
    Organization {
        string id PK
        string name
        string planId FK
    }
    Membership {
        string id PK
        string userId FK
        string orgId FK
        string roleId FK
    }
    Role {
        string id PK
        string name
    }
    Permission {
        string id PK
        string key
    }
    RolePermission {
        string roleId FK
        string permissionId FK
    }
    Plan {
        string id PK
        string name
    }
    Feature {
        string id PK
        string key
    }
    PlanFeature {
        string planId FK
        string featureId FK
        int limit
    }
    UsageLog {
        string id PK
        string orgId FK
        string featureKey
        int count
    }
    Invitation {
        string id PK
        string email
        string orgId FK
        string roleId FK
        string token
        enum status
        datetime expiresAt
    }
    Project {
        string id PK
        string name
        string orgId FK
    }
    AuditLog {
        string id PK
        string userId
        string orgId
        string action
        datetime createdAt
    }

    User ||--o{ Membership : "belongs to"
    Organization ||--o{ Membership : "has"
    Role ||--o{ Membership : "assigned via"
    Role ||--o{ RolePermission : "has"
    Permission ||--o{ RolePermission : "granted by"
    Plan ||--o{ Organization : "used by"
    Plan ||--o{ PlanFeature : "includes"
    Feature ||--o{ PlanFeature : "included in"
    Organization ||--o{ UsageLog : "tracked in"
    Organization ||--o{ Invitation : "sends"
    Organization ||--o{ Project : "owns"
    Role ||--o{ Invitation : "assigned via"
```

---

## Design Decisions

### Why database-driven RBAC instead of hardcoded roles?

Most backends start with `if (user.role === "ADMIN")` scattered across controllers. This works until requirements change — and they always do. Adding a "Moderator" role means finding every permission check in the codebase and updating it.

Tenovate stores roles and permissions in the database with a `Role → RolePermission → Permission` join table. The middleware looks up permissions at runtime. Adding a new role or changing what a role can do requires no code changes — just a database update. This is how production SaaS systems are built.

The tradeoff is one extra DB lookup per request on permission-gated routes. This is acceptable and addressable with a Redis cache layer (listed under future improvements).

### Why a layered middleware pipeline instead of per-controller checks?

Each middleware layer handles exactly one concern. Controllers never check auth, membership, permissions, or feature access — that's all done before they run. This means:

- Controllers are testable without mocking auth
- Adding a new permission to a route is one line in the router
- Security rules can't be accidentally skipped in a new controller
- The pipeline is auditable — you can read the middleware chain and know exactly what's enforced

### Why token-based invitations with hashed storage?

Invitation tokens are generated as random 32-byte hex strings, then SHA-256 hashed before storage. The raw token is sent to the user; only the hash lives in the database. This means a database breach doesn't expose valid invitation tokens — the same pattern used for password reset tokens.

---

## Test Coverage

The middleware pipeline is integration-tested end-to-end against a real PostgreSQL database (Docker).

```
Auth Middleware         5 tests   Expired JWT → 401, tampered token → 401
Org Isolation           7 tests   Cross-tenant boundary — Org B cannot touch Org A's resources
RBAC                    7 tests   Member role blocked from every admin endpoint
Feature Gating          3 tests   FREE plan blocked, PRO allowed, DB change takes effect immediately
Usage Limits            4 tests   Fills to limit → blocked, delete frees quota → allowed again
Invitation Flow         4 tests   Happy path, expired token, rejection, invalid token
─────────────────────────────────────────────────────
Total                  30 passing
```

Run tests:

```bash
# Requires Docker — starts a clean Postgres container
docker run --name tenovate-test-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=tenovate_test \
  -p 5432:5432 -d postgres:16

npm test
```

---

## Technology Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT |
| API Docs | Swagger / OpenAPI |
| Testing | Jest + Supertest |

---

## Project Structure

```
src/
├── app.ts
├── server.ts
├── lib/
│   └── prisma/
├── middlewares/
│   ├── authMiddleware.ts
│   ├── orgMiddleware.ts
│   ├── permissionMiddleware.ts
│   ├── featureMiddleware.ts
│   └── usageMiddleware.ts
├── modules/
│   ├── auth/
│   ├── organizations/
│   ├── membership/
│   ├── roles/
│   ├── invitations/
│   ├── projects/
│   ├── features/
│   ├── usage/
│   └── audit/
├── routes/
│   └── index.ts
├── validators/
└── config/
    └── swagger.ts
```

---

## API Endpoints

Base URL: `/api/v1` — Interactive docs at **[https://tenovate.onrender.com/api/v1/docs/](https://tenovate.onrender.com/api/v1/docs/)**

```
Authentication
  POST   /auth/signup
  POST   /auth/login
  GET    /auth/me

Organizations
  POST   /organizations
  GET    /organizations/my
  GET    /organizations/:orgId
  DELETE /organizations/:orgId

Members
  GET    /organizations/:orgId/members
  PATCH  /organizations/:orgId/members/:userId/role
  DELETE /organizations/:orgId/members/:userId

Invitations
  POST   /organizations/:orgId/invitations/invite
  GET    /organizations/:orgId/invitations
  GET    /invitations/accept?token=
  GET    /invitations/decline?token=

Roles
  GET    /organizations/:orgId/roles
  POST   /organizations/:orgId/roles

Projects
  POST   /organizations/:orgId/projects
  GET    /organizations/:orgId/projects
  GET    /organizations/:orgId/projects/:projectId
  PATCH  /organizations/:orgId/projects/:projectId
  DELETE /organizations/:orgId/projects/:projectId

Features
  GET    /organizations/:orgId/features

Usage
  GET    /organizations/:orgId/usage
  GET    /organizations/:orgId/usage/:featureKey

Audit Logs
  GET    /organizations/:orgId/audit-logs
```

---

## Getting Started

```bash
git clone <repo-url>
cd backend
npm install
```

Create `.env`:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/tenovate
JWT_SECRET=your-secret
PORT=3000
```

```bash
npx prisma migrate dev
npm run dev
```

---

## Future Improvements

- Billing integration (Stripe)
- API key management per organization
- Rate limiting per organization
- Redis caching for permission lookups
- Background job processing

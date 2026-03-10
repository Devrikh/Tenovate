# Multi-Tenant SaaS Infrastructure Backend

## Quick Summary

A reusable backend infrastructure layer for building SaaS applications.

Instead of implementing authentication, organizations, RBAC, feature gating, usage limits, and collaboration systems from scratch for every SaaS product, this backend centralizes those capabilities into a modular API that other applications can integrate with.

### Core Capabilities

* Multi-tenant organization management
* Role-based access control (RBAC)
* Team invitations and membership management
* Feature gating for subscription plans
* Usage tracking and limit enforcement
* Audit logging for organizational activity

API documentation available at:

```
/api/v1/docs
```

---

# Overview

Building a SaaS product requires much more than application-specific logic.
Most SaaS platforms must implement foundational backend systems such as:

* Authentication
* Organizations / workspaces
* Role-based permissions
* Team onboarding
* Feature gating
* Usage tracking
* Activity auditing

These systems are frequently implemented repeatedly across products, often in inconsistent or tightly coupled ways.

This project provides a **reusable backend infrastructure layer** that standardizes these capabilities and exposes them through modular APIs.

Instead of rebuilding these systems for every SaaS product, applications can **integrate with this infrastructure and focus on their core business logic**.

---

# Problem

Most SaaS platforms encounter similar architectural challenges:

* Tenant isolation implemented incorrectly
* Hardcoded roles such as `ADMIN` and `USER`
* Feature access scattered across application logic
* Missing usage tracking or quota enforcement
* Poorly designed invitation workflows
* Lack of centralized auditing

These issues lead to backend systems that are difficult to scale, extend, and secure.

---

# Solution

This project implements a modular SaaS backend infrastructure that provides:

* Organization-based tenant isolation
* Database-driven RBAC authorization
* Secure invitation-based onboarding
* Feature access control per organization
* Usage tracking with enforceable limits
* Audit logging for important actions

By separating these concerns into an infrastructure layer, SaaS products can reuse a consistent and scalable backend foundation.

---

# Architecture

The backend is structured around a layered middleware pipeline that handles cross-cutting concerns before reaching business logic.

### Request Flow

```
Request
   ↓
Auth Middleware
   ↓
Organization Context Middleware
   ↓
RBAC Permission Check
   ↓
Feature Access Check
   ↓
Usage Limit Enforcement
   ↓
Controller
```

Each layer handles a specific responsibility, allowing controllers to remain clean and focused on application logic.

---

# System Architecture

```
Client Application
        │
        ▼
SaaS Infrastructure API
        │
        ├── Authentication
        ├── Organizations
        ├── RBAC Permissions
        ├── Invitations
        ├── Feature Flags
        ├── Usage Tracking
        └── Audit Logs
        │
        ▼
     PostgreSQL Database
```

Applications built on top of this system interact with the infrastructure API to manage tenants, permissions, and usage policies.

---

# Key Capabilities

## Multi-Tenant Organizations

Organizations act as isolated tenants within the system.

* Users can belong to multiple organizations
* All resources are scoped by `organizationId`
* Middleware ensures strict tenant isolation

---

## Role-Based Access Control (RBAC)

Authorization is implemented using a database-driven RBAC model.

* Roles stored in the database
* Permissions mapped through a `RolePermission` relationship
* Middleware enforces permissions per request

This allows roles to evolve without modifying application logic.

---

## Organization and Team Management

Organizations can manage collaborative workspaces.

Features include:

* Member management
* Role assignment
* Permission updates
* Member removal

---

## Invitation System

Secure invitation flow for onboarding new members.

Capabilities include:

* Token-based invitations
* Role assignment during onboarding
* Token expiration handling
* Acceptance and rejection flows

---

## Projects

Projects demonstrate how product-level resources can be scoped to organizations and integrated with RBAC and usage limits.

---

## Feature Gating

Features can be enabled or disabled for organizations.

This enables subscription tiers such as:

* Free
* Pro
* Mythic

Feature checks are enforced through middleware.

---

## Usage Tracking

The system tracks organization-level usage of certain features.

Examples include:

* Maximum number of projects
* Maximum number of members

Requests exceeding limits are automatically rejected.

---

## Audit Logs

Important organization activities can be recorded for security and traceability.

Audit logs support:

* Activity tracking
* Security monitoring
* Operational debugging

---

# Technology Stack

Backend

* Node.js
* Express
* TypeScript

Database

* PostgreSQL
* Prisma ORM

Authentication

* JWT

API Documentation

* Swagger (OpenAPI)

---

# Project Structure

```
src
│
├── app.ts
├── server.ts
│
├── lib
│   └── prisma.ts
│
├── middlewares
│   ├── auth.middleware.ts
│   ├── org.middleware.ts
│   ├── permission.middleware.ts
│   └── error.middleware.ts
│
├── routes
│   └── index.ts
│
├── modules
│
│   ├── auth
│   ├── organizations
│   ├── members
│   ├── roles
│   ├── invitations
│   ├── projects
│   ├── features
│   ├── usage
│   └── audit
│
└── config
    └── swagger.ts
```

The codebase follows a **modular domain-based architecture**, where each domain has its own routes and controllers.

---

# API Endpoints

Base URL

```
/api/v1
```

## Authentication

```
POST   /auth/signup
POST   /auth/login
GET    /auth/me
POST   /auth/logout
POST   /auth/refresh
```

## Organizations

```
POST   /organizations
GET    /organizations/my
GET    /organizations/:orgId
DELETE /organizations/:orgId
```

## Members

```
GET    /organizations/:orgId/members
PATCH  /organizations/:orgId/members/:userId/role
DELETE /organizations/:orgId/members/:userId
```

## Invitations

```
POST   /organizations/:orgId/invitations/invite
GET    /organizations/:orgId/invitations

POST   /organizations/invitations/accept
POST   /organizations/invitations/reject
```

## Roles

```
GET    /organizations/:orgId/roles
POST   /organizations/:orgId/roles
PATCH  /organizations/:orgId/roles/:roleId
DELETE /organizations/:orgId/roles/:roleId
```

## Projects

```
POST   /organizations/:orgId/projects
GET    /organizations/:orgId/projects
GET    /organizations/:orgId/projects/:projectId
PATCH  /organizations/:orgId/projects/:projectId
DELETE /organizations/:orgId/projects/:projectId
```

## Features

```
GET    /organizations/:orgId/features
PATCH  /organizations/:orgId/features
```

## Usage

```
GET    /organizations/:orgId/usage
GET    /organizations/:orgId/usage/:featureKey
```

## Audit Logs

```
GET /organizations/:orgId/audit-logs
```

## System

```
GET /health
GET /docs
```

---

# Getting Started

### Clone the repository

```
git clone <repo-url>
cd project
```

### Install dependencies

```
npm install
```

### Setup environment variables

Create `.env`

```
DATABASE_URL=
JWT_SECRET=
PORT=3000
```

### Run database migrations

```
npx prisma migrate dev
```

### Start the development server

```
npm run dev
```

---

# API Documentation

Interactive Swagger documentation available at:

```
/api/v1/docs
```

---

# What This Project Demonstrates

* Designing scalable **multi-tenant backend infrastructure**
* Implementing **database-driven RBAC**
* Building modular **Express architecture**
* Enforcing **feature access and usage limits**
* Structuring maintainable backend systems

---

# Future Improvements

* Billing integration
* API key management
* Rate limiting per organization
* Redis caching layer
* Background job processing

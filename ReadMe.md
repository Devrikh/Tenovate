# Multi-Tenant SaaS Infrastructure Platform

## Overview

Early-stage SaaS applications often struggle with correctly implementing multi-tenancy, access control, and subscription logic. These systems are critical for scalability and security, but are frequently built in an ad-hoc or hardcoded way.

This project is a production-ready backend infrastructure layer that provides:

* Multi-tenant architecture (organizations)
* Database-driven RBAC (roles and permissions)
* Subscription plans with feature gating
* Usage tracking and limit enforcement
* Invitation-based onboarding

It is designed to serve as a reusable foundation for building real-world SaaS products.

---

## Problem

Most SaaS backends face the following issues:

* Weak or missing tenant isolation
* Hardcoded roles (e.g. `ADMIN`) instead of flexible permissions
* No structured way to manage feature access across plans
* Lack of usage tracking and enforcement
* Poor onboarding flows for teams

These limitations lead to systems that are difficult to scale, extend, or secure.

---

## Solution

This project provides a clean and modular backend that solves these problems through:

* Organization-scoped data isolation enforced via middleware
* Role and permission management stored in the database
* Plan-based feature access control
* Usage tracking with enforceable limits
* Secure invitation flow for team collaboration

---

## Features

### Multi-Tenancy

* Users can belong to multiple organizations
* All data is scoped by `organizationId`
* Middleware enforces strict isolation

### RBAC (Role-Based Access Control)

* Roles and permissions stored in database
* Many-to-many mapping via `RolePermission`
* Permissions resolved at request time
* Middleware-based enforcement (`requirePermission`)

### Plans and Feature Gating

* Organizations are assigned subscription plans
* Features are mapped to plans
* Middleware (`requireFeature`) restricts access

### Usage Tracking

* Tracks feature usage per organization
* Enforces limits (e.g. number of projects)
* Supports free and paid tiers

### Invitation System

* Invite users via token-based flow
* Assign roles during onboarding
* Secure validation and expiration handling

---

## Architecture

### Request Flow

```
Auth Middleware
   ↓
Org Middleware 
   ↓
Permission Check (RBAC)
   ↓
Feature Check (Plan)
   ↓
Usage Limit Check
   ↓
Controller
```

---

## Tech Stack

* Backend: Node.js, Express
* Frontend: Next.js
* ORM: Prisma
* Database: PostgreSQL
* Authentication: JWT

---

## Project Structure

```
/src
  /routes
  /middlewares
  /controllers
  /lib
/prisma
```

---

## Example Use Case

**Scenario:** Organization on Free Plan (limit: 3 projects)

1. User creates project → allowed
2. User creates 4th project → request blocked (limit reached)
3. Organization upgrades plan → limit increases

---

## Getting Started

### 1. Clone Repository

```
git clone <your-repo-url>
cd <project-name>
```

### 2. Install Dependencies

```
npm install
```

### 3. Setup Environment Variables

Create a `.env` file:

```
DATABASE_URL=
JWT_SECRET=
```

### 4. Run Migrations

```
npx prisma migrate dev
```

### 5. Start Development Server

```
npm run dev
```

---

## API Overview

### Auth

* `POST /auth/signup`
* `POST /auth/login`

### Organization

* `POST /org/create`
* `GET /org/my-orgs`

### Projects

* `POST /project/create`
* `GET /project/my-projects`

### Invitations

* `POST /org/invite`
* `POST /org/invite/accept`

---

## What This Project Demonstrates

* Designing a scalable multi-tenant backend
* Implementing database-driven RBAC
* Enforcing feature access via subscription plans
* Handling usage limits and quotas
* Building clean middleware-based architecture

---

## Future Improvements

* Billing integration (e.g. Stripe)
* API key management
* Rate limiting per organization
* Audit logs
* Caching layer (Redis)

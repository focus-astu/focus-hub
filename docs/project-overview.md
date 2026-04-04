# Focus Hub — Project Overview

## What Is Focus Hub?

Focus Hub is a role-based web platform for the **Focus ASTU** fellowship. It provides structured learning, mentorship, counseling, and community coordination for university students. The platform is **private** — only verified Focus members can access it after an admin approval process.

---

## Platform Purpose

| Pillar | Description |
|--------|-------------|
| Structured Learning | Teachers create tasks, assignments, and learning roadmaps that students follow |
| Mentorship | Teachers monitor progress and guide students through milestones |
| Counseling | Counselors provide emotional support, academic guidance, financial advice, and university life mentorship |
| Community Coordination | General Leaders handle announcements, event schedules, meeting locations, and blog posts |
| Administrative Governance | Admins control access, assign roles, moderate content, and monitor platform health |

---

## Core Principles

1. **Approval-based access** — No one enters the platform without admin approval
2. **Least-privilege roles** — Everyone starts as a Student; elevated permissions are granted explicitly by Admins
3. **No social-reaction features** — The platform focuses on informational and educational clarity, not engagement metrics (no likes, reactions, etc.)
4. **Role switching** — Any elevated user (Teacher, Counselor, etc.) retains Student access. They can view the platform as a Student and switch into their elevated role when needed
5. **Centralized role management** — Only Admins assign or change roles
6. **Audit accountability** — Sensitive admin actions (role changes, bans, suspensions) are logged

---

## User Roles

| Role | Access Level | How Assigned |
|------|-------------|--------------|
| **Student** | Base (standard internal access) | Automatic upon admin approval |
| **Tech Student** | Student + Tech Community Hub | Subset of Student with additional tech-specific access |
| **Teacher** | Academic management | Admin promotes a Student |
| **Counselor** | Student support | Admin promotes a Student |
| **General Leader** | Logistical communication | Admin promotes a Student |
| **Admin** | Global system control | Admin promotes a Student (first registrant is auto-promoted) |

A user can hold **multiple elevated roles simultaneously** (e.g., a user can be both a Teacher and a General Leader). All elevated users also retain full Student access.

---

## High-Level System Flow

```
1. Guest visits the platform
2. Guest registers with university details
3. System sends email verification link
4. Guest verifies email
5. Account enters "Pending Approval" state
6. Admin reviews and approves (or rejects)
7. Approved user becomes a Student (base role)
8. Admin may promote user to elevated roles
9. Role-based features become available
```

---

## Guest View (Unauthenticated)

Guests can:
- View the Student Fellowships landing page
- Read publicly available blog posts
- Navigate informational pages

Guests cannot:
- Access dashboards or internal content
- Interact with platform features
- Register for internal activities without creating an account

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) with React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Authentication | BetterAuth (email verification, organization plugin, admin plugin) |
| Database | MongoDB |
| Package Manager | pnpm |
| Architecture | Clean Architecture with feature-based module organization |

---

## Architecture Summary

The project follows **Clean Architecture** organized by feature modules. Each feature owns its full stack:

```
src/core/[feature]/
├── domain/          → Entities, enums, value objects (zero framework deps)
├── application/     → Use cases, DTOs, ports (interfaces)
├── infrastructure/  → Repository implementations
└── index.ts         → Public API barrel export
```

The dependency rule is strict: **Domain → nothing, Application → Domain only, Infrastructure → Application + Domain, Presentation → Application + Domain (via DI).**

Frontend features live in `src/features/[feature]/` with components, hooks, actions, and barrel exports.

Shared UI primitives live in `src/components/ui/`.

For full details, see [Architecture Philosophy](./architecture.md) and [Feature Workflow](./feature-workflow.md).

---

## Repository Structure (Key Directories)

```
focus-hub/
├── docs/                          # Project documentation
├── __tests__/                     # Unit + integration tests
├── src/
│   ├── app/                       # Next.js App Router (pages, layouts, API routes)
│   │   ├── (auth)/                # Auth route group (/login, /signup)
│   │   ├── (verify)/              # Verification route group
│   │   └── api/v1/               # Backend API routes
│   ├── components/ui/             # Shared UI primitives (Button, Input, Card)
│   ├── core/                      # Clean Architecture feature modules
│   │   ├── auth/                  # Auth feature (domain, application, infrastructure)
│   │   ├── tasks/                 # Tasks feature (full slice)
│   │   └── shared/                # Cross-cutting concerns + composition root
│   ├── features/                  # Frontend feature slices
│   │   ├── auth/                  # Auth UI components
│   │   └── tasks/                 # Task UI components + actions
│   ├── hooks/                     # Shared custom hooks
│   ├── lib/                       # Utilities, auth client, validations
│   └── types/                     # Shared type definitions
├── .cursor/rules/                 # Cursor IDE rules (coding standards)
└── package.json
```

---

## Key Documentation

| Document | Purpose |
|----------|---------|
| [Project Overview](./project-overview.md) | This file — high-level system description |
| [Architecture](./architecture.md) | Clean Architecture philosophy, layer rules, data flow |
| [Feature Workflow](./feature-workflow.md) | Step-by-step guide for adding new features |
| [Branching Strategy](./branching-strategy.md) | Git branch hierarchy, naming, PR guidelines |
| [Auth Implementation](./auth/auth-implementation.md) | Full auth spec — registration, verification, approval, organizations, task assignments |
| [Roles & Access Control](./roles-and-access-control.md) | Detailed role definitions, permissions, and organization mapping |
| [Authentication Flow](./authentication-flow.md) | User journey from registration to full access |

---

## Environment Setup

### Prerequisites

- Node.js (latest LTS)
- pnpm
- MongoDB (local or Atlas)

### Getting Started

```bash
git clone <repo-url>
cd focus-hub
pnpm install
```

Create a `.env.local` file with:

```
MONGODB_URI=mongodb://localhost:27017/focus-hub
BETTER_AUTH_SECRET=<random-32-char-string>
BETTER_AUTH_URL=http://localhost:3000
```

Run the development server:

```bash
pnpm dev
```

---

## Branching Strategy (Quick Reference)

| Branch | Purpose | Merges Into |
|--------|---------|-------------|
| `main` | Production-ready | — |
| `front-main` | Frontend integration staging | `main` |
| `back-main` | Backend integration staging | `main` |
| `front-main-[feature]` | Frontend feature work | `front-main` |
| `back-main-[feature]` | Backend feature work | `back-main` |

PRs target team integration branches (`front-main` or `back-main`), not `main` directly. See [Branching Strategy](./branching-strategy.md) for full details.

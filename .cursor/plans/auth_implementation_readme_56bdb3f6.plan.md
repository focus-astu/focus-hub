---
name: Auth Implementation README
overview: "Write a single comprehensive documentation file at `docs/auth-implementation.md` covering the full auth implementation guide: task board with IDs and assignees, git branching, backend guide (BetterAuth + MongoDB + clean architecture), frontend guide, organization-based access control, and testing requirements."
todos:
  - id: write-auth-readme
    content: "Write the full docs/auth-implementation.md file (~400-500 lines) with all 7 sections: overview, task board, git branching, backend guide, frontend guide, access control, and testing"
    status: completed
isProject: false
---

# Auth & Onboarding Implementation Guide

## Output

One file: [docs/auth-implementation.md](docs/auth-implementation.md)

This will be a long, well-structured markdown document that the 6 team members use as their single source of truth for implementing Registration, Login, and Organization-based Access Control.

## Sections in the Document

### Section 1 -- Overview and Architecture Decisions

Brief summary of what is being built and the key decisions:

- BetterAuth with plugins: `organization`, `admin`, `nextCookies`
- MongoDB as database (adapter for BetterAuth)
- Organizations-as-roles model (each elevated role = a BetterAuth organization)
- Two-step verification: email link + admin approval
- First registrant becomes admin automatically
- Custom user fields: `fullName`, `email`, `universityId`, `year`, `password`, `department` (optional), `approved` (system-managed)

Includes a mermaid diagram showing the registration-to-active-user flow:

```
Guest --> Register --> Email Verification --> Pending Approval --> Admin Approves --> Active Student
                                                                                 --> Admin may promote to org
```

### Section 2 -- Task Board

Two tables (backend + frontend) with columns: ID, Task, Assignee, Depends On, Branch.

**Backend -- 3 parallel tracks:**

- **Negasa Reta (Infrastructure track):**
  - `BE-AUTH-01`: BetterAuth server setup + MongoDB adapter + custom user fields
  - `BE-AUTH-02`: Email verification config
  - `BE-AUTH-03`: First-user auto-admin promotion via databaseHook
  - All on branch `back-main-auth-setup`
- **Ayana Samuel (Domain/Application track):**
  - `BE-AUTH-04`: Auth domain layer (UserStatus enum, error types, DTOs, AuthRepository port)
  - `BE-AUTH-05`: Approval use cases (`approveUser`, `rejectUser`, `getPendingUsers`) + API routes
  - `BE-AUTH-06`: Login dual-verification guard (email verified + admin approved)
  - Branches: `back-main-auth-domain` then `back-main-auth-approval`
- **Abenezer Terefe (Organizations/Testing track):**
  - `BE-AUTH-07`: Organization permissions (`createAccessControl`, role-to-org mapping, seed script)
  - `BE-AUTH-08`: Organization access control middleware + org management API routes
  - `BE-AUTH-09`: Unit tests for domain/use cases + integration tests for API routes
  - Branches: `back-main-auth-orgs` then `back-main-auth-tests`

**Frontend -- 3 parallel tracks:**

- **Firomsa Hika (Auth client + Registration):**
  - `FE-AUTH-01`: Auth client setup (shared config file)
  - `FE-AUTH-02`: Registration page + form with validation
  - Branches: `front-main-auth-client` then `front-main-auth-register`
- **Gemechu Alemu (Login/Verification flow):**
  - `FE-AUTH-03`: Login page with error handling
  - `FE-AUTH-04`: Email verification callback page
  - `FE-AUTH-05`: Pending approval status page
  - Branches: `front-main-auth-login`, `front-main-auth-verify`, `front-main-auth-pending`
- **Sabona Waktole (Admin dashboard):**
  - `FE-AUTH-06`: User approval panel
  - `FE-AUTH-07`: Organization/role management panel
  - Branches: `front-main-admin-users`, `front-main-admin-orgs`

### Section 3 -- Git Branching and Commit Convention

Concrete branch names for each task (listed above), plus:

- How to create branches from `back-main` / `front-main`
- Commit message examples: `feat(auth): add BetterAuth server config with MongoDB adapter`
- PR targets and merge strategy (following existing [docs/branching-strategy.md](docs/branching-strategy.md))

### Section 4 -- Backend Implementation Guide

For **each backend task**, the doc will specify:

- Exact file paths to create
- What each file must contain (with code snippets showing the expected structure)
- How it fits the existing clean architecture in `src/core/`

Key files to be documented:

```
src/core/auth/
  domain/
    user-status.enum.ts          -- PENDING, EMAIL_VERIFIED, APPROVED, REJECTED
    auth.errors.ts               -- EmailNotVerifiedError, UserNotApprovedError
    index.ts
  application/
    dtos/auth.dto.ts             -- ApproveUserDTO, PendingUserResponseDTO, RegisterDTO
    ports/auth-repository.port.ts -- findPendingUsers, approveUser, rejectUser
    use-cases/
      approve-user.use-case.ts
      reject-user.use-case.ts
      get-pending-users.use-case.ts
    index.ts
  infrastructure/
    config/
      auth.ts                    -- BetterAuth server instance (plugins, additionalFields, hooks)
      auth-client.ts             -- BetterAuth client instance
      permissions.ts             -- createAccessControl + role definitions (shared client/server)
    repositories/
      mongodb-auth.repository.ts -- implements AuthRepository port
  index.ts

src/app/api/auth/[...all]/route.ts          -- BetterAuth catch-all handler
src/app/api/v1/admin/users/route.ts         -- GET pending users
src/app/api/v1/admin/users/[id]/approve/route.ts -- POST approve/reject
src/app/api/v1/admin/organizations/route.ts -- GET/POST organizations
```

The doc will include:

- BetterAuth `auth.ts` config showing `user.additionalFields` for `universityId`, `year`, `department`, `approved`
- `emailVerification` setup with `sendOnSignUp: true`
- `databaseHooks.user.create.after` for first-user admin promotion
- How `approved` field blocks login (checked in a `databaseHooks.session.create.before` or via BetterAuth's `emailAndPassword` hooks)
- The `permissions.ts` file structure showing `createAccessControl` with statements for platform resources
- How to seed default organizations (teachers, counselors, general-leaders, admins)
- Testing expectations: which functions need unit tests, which routes need integration tests

### Section 5 -- Frontend Implementation Guide

For **each frontend task**, the doc will specify:

- Exact file paths
- Component structure (which shared `@/components/ui` to use)
- BetterAuth client method calls
- Expected behavior and error states

Key files:

```
src/lib/auth-client.ts                       -- shared BetterAuth client instance
src/lib/auth-permissions.ts                  -- re-export permissions.ts (client-safe)

src/features/auth/
  components/
    registration-form.tsx       -- "use client", form with all fields
    login-form.tsx              -- "use client", email + password
    pending-approval-card.tsx   -- status display component
    index.ts
  actions/auth.actions.ts       -- server actions wrapping auth calls
  types.ts
  index.ts

src/app/(auth)/layout.tsx                    -- centered auth layout
src/app/(auth)/register/page.tsx
src/app/(auth)/login/page.tsx
src/app/(auth)/verify-email/page.tsx
src/app/(auth)/pending-approval/page.tsx

src/app/(dashboard)/admin/users/page.tsx
src/app/(dashboard)/admin/organizations/page.tsx
```

The doc will describe:

- Registration form fields and validation rules
- How `authClient.signUp.email()` is called with custom fields
- Login error handling (403 for unverified email, custom check for unapproved)
- How the verify-email page reads `?token=` and calls `authClient.verifyEmail()`
- Admin panel: calling `auth.api.listUsers` for pending users, approve/reject buttons
- Admin org panel: listing organizations, adding members to promote users

### Section 6 -- Access Control via Organizations

A dedicated section explaining:

- Organization-to-role mapping table (org slug -> platform role -> what it grants)
- How to check access: `auth.api.hasPermission` on server, `authClient.organization.hasPermission` on client
- Middleware pattern for protecting routes based on org membership
- How admin promotes a user (adds them as member of the relevant organization)
- Permission matrix diagram

### Section 7 -- Testing Requirements

- File paths in `__tests__/` following existing structure
- Which domain entities and use cases need unit tests
- Which API routes need integration tests
- Fixture/factory patterns for auth test data
- Example test structure

## What I Will NOT Include

- Actual implementation code (this is documentation only)
- Changes to any existing source files
- Database migration scripts (those come during implementation)


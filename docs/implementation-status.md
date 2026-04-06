# Implementation Status

This document tracks every feature that has been fully implemented in Focus Hub, organized by backend and frontend. It is the single source of truth for what is done and what remains.

---

## Backend

### Authentication (BetterAuth + MongoDB)

| Feature | Description | Key Files |
|---------|-------------|-----------|
| BetterAuth server setup | Email/password auth with MongoDB adapter, `nextCookies` plugin | `src/core/auth/infrastructure/config/auth.ts` |
| Email verification | `requireEmailVerification: true`, `sendOnSignUp`, custom HTML template via nodemailer | `auth.ts`, `email-verification.template.ts` |
| First-user auto-admin | First registered user is promoted to `role: "admin"` and `approved: true`, with 4 default organizations seeded | `auth.ts` (databaseHooks) |
| Login guard (email + approval) | Middleware blocks sign-in if email not verified (defers to BetterAuth) or not approved (custom FORBIDDEN) | `auth.ts` (hooks.before) |
| Organization plugin | Custom access control with roles: member, teacher, counselor, generalLeader, platformAdmin | `permissions.ts`, `auth.ts` |
| Admin plugin | BetterAuth admin plugin enabled for role management | `auth.ts` |

### Auth Domain Layer

| Feature | Description | Key Files |
|---------|-------------|-----------|
| UserStatus enum | `PENDING`, `EMAIL_VERIFIED`, `APPROVED`, `REJECTED` | `src/core/auth/domain/user-status.enum.ts` |
| Domain errors | `EmailNotVerifiedError`, `UserNotApprovedError`, `UserAlreadyApprovedError` | `src/core/auth/domain/auth.errors.ts` |
| DTOs | `RegisterDTO`, `ApproveUserDTO`, `RejectUserDTO`, `PendingUserResponseDTO` | `src/core/auth/application/dtos/auth.dto.ts` |
| AuthRepository port | Interface: `getPendingUsers`, `approveUser`, `rejectUser`, `isUserApproved`, `getUserById` | `src/core/auth/application/ports/auth-repository.port.ts` |
| MongoDB repository | Concrete implementation of AuthRepository | `src/core/auth/infrastructure/repositories/mongodb-auth.repository.ts` |

### Auth Use Cases

| Use Case | Description | Key Files |
|----------|-------------|-----------|
| Approve user | Checks if already approved, approves, sends approval email via EmailService | `approve-user.use-case.ts` |
| Reject user | Rejects with optional reason | `reject-user.use-case.ts` |
| Get pending users | Returns email-verified but unapproved users | `get-pending-users.use-case.ts` |

### Email Service (Nodemailer)

| Feature | Description | Key Files |
|---------|-------------|-----------|
| EmailService port | `send({ to, subject, html })` interface | `src/core/shared/application/ports/email-service.port.ts` |
| Nodemailer adapter | Gmail SMTP transport, factory pattern, cached transporter | `src/core/shared/infrastructure/email/nodemailer-email.service.ts` |
| Email layout template | Branded Focus ASTU HTML wrapper (header, footer) | `templates/layout.template.ts` |
| Verification template | Props: `userName`, `verificationUrl` — verify CTA + fallback link | `templates/email-verification.template.ts` |
| Account approved template | Props: `userName`, `loginUrl` — approval notification + sign-in CTA | `templates/account-approved.template.ts` |

### Tasks Domain (In-Memory)

| Feature | Description | Key Files |
|---------|-------------|-----------|
| Task entity | Immutable entity with status, priority, dates | `src/core/tasks/domain/task.entity.ts` |
| TaskStatus / Priority enums | Status and priority value objects | `task-status.enum.ts`, `priority.enum.ts` |
| TaskRepository port | Interface for CRUD operations | `src/core/tasks/application/ports/task-repository.port.ts` |
| In-memory repository | Dev/demo implementation (not persisted) | `src/core/tasks/infrastructure/repositories/in-memory-task.repository.ts` |
| Create / Get use cases | Factory functions with dependency injection | `create-task.use-case.ts`, `get-tasks.use-case.ts` |

### API Routes

| Route | Method | Purpose | Auth Required |
|-------|--------|---------|---------------|
| `/api/auth/[...all]` | GET/POST | BetterAuth catch-all handler | Varies |
| `/api/v1/tasks` | GET/POST | List tasks (with filters) / Create task | No |
| `/api/v1/admin/users` | GET | List pending users | Admin |
| `/api/v1/admin/users/[id]/approve` | POST | Approve or reject user | Admin |
| `/api/v1/admin/organizations` | GET/POST | List orgs / Add member | Admin |
| `/api/v1/auth/check-approval` | POST | Check if user is approved (by email, queries DB directly) | No |

### Shared Infrastructure

| Feature | Description | Key Files |
|---------|-------------|-----------|
| IdGenerator port + crypto adapter | UUID generation | `id-generator.port.ts`, `crypto-id-generator.ts` |
| Composition root | Wires all repositories, use cases, email service | `src/core/shared/infrastructure/config/dependencies.ts` |
| Domain errors | `DomainError`, `EntityNotFoundError`, `ValidationError` | `src/core/shared/domain/` |

### Testing

| Feature | Description | Key Files |
|---------|-------------|-----------|
| Jest + ts-jest setup | Node test environment, path aliases | `jest.config.ts` |
| Auth fixtures + factories | Static mock data and dynamic builders | `__tests__/fixtures/` |
| Domain error tests | Verifies error classes and codes | `__tests__/unit/core/domain/auth.errors.test.ts` |
| Use case tests | Approve user, get pending users | `__tests__/unit/core/use-cases/` |
| Task tests | Task entity, create task use case | `__tests__/unit/core/` |

---

## Frontend

### Pages

| Page | Route | Description | Key Files |
|------|-------|-------------|-----------|
| Landing page | `/` | Marketing hero, teams, donate, updates, footer with smooth scrolling | `src/app/page.tsx` |
| Login | `/login` | Email/password form, error handling, redirect to dashboard or pending-approval | `src/app/(auth)/login/page.tsx`, `login-form.tsx` |
| Signup | `/signup` | Registration form with universityId, year, department, signs out stale sessions | `src/app/(auth)/signup/page.tsx`, `signup-form.tsx` |
| Verify email | `/verify-email` | Token verification, resend with cooldown, masked email display | `src/app/(verify)/verify-email/page.tsx` |
| Verification success | `/verification-success` | Post-verify confirmation with "pending review" messaging | `src/app/(verify)/verification-success/page.tsx` |
| Pending approval | `/pending-approval` | Polls `/api/v1/auth/check-approval` directly from DB, 15s cooldown | `src/app/(auth)/pending-approval/page.tsx` |
| Dashboard | `/dashboard` | Coming Soon placeholder with session check, logout | `src/app/(dashboard)/dashboard/page.tsx` |
| Admin users | `/admin/users` | Pending user table with approve/reject actions | `src/app/(dashboard)/admin/users/page.tsx` |
| Admin organizations | `/admin/organizations` | Organization cards with member table, add member form | `src/app/(dashboard)/admin/organizations/page.tsx` |
| 404 Not Found | Any invalid route | Custom 404 with home/login navigation | `src/app/not-found.tsx` |

### Feature Components

| Component | Feature | Description |
|-----------|---------|-------------|
| `LoginForm` | auth | Email/password with validation, error states, route to pending-approval with email param |
| `SignupForm` | auth | Full registration with custom year dropdown, validation, signs out before redirect |
| `AuthHeroBg` | auth | Shared auth page hero background |
| `UserApprovalPanel` | admin | Table of pending users, approve/reject buttons, reject reason modal |
| `RejectReasonModal` | admin | Modal for admin rejection reason input |
| `OrgManagementPanel` | admin | Expandable org cards, member list, add member form |
| `TaskCard` / `TaskList` | tasks | Task display components (built but not mounted on any route) |

### UI Primitives (`src/components/ui/`)

| Component | Description |
|-----------|-------------|
| `Button` | Styled button with variants |
| `Input` | Styled input component |
| `Card` (Header/Title/Content) | Card layout primitives |
| `Logo` | SVG Focus ASTU wordmark with variant/size/inverted props |

### Libraries (`src/lib/`)

| File | Purpose |
|------|---------|
| `auth-client.ts` | BetterAuth React client with org + admin plugins |
| `auth-permission.ts` | Re-exports access control roles from core |
| `utils.ts` | `cn` (classnames), `formatDate`, `slugify` |
| `validations/auth.validation.ts` | `validateLoginForm`, `validateRegistration` |
| `constants.ts` | App name, API base URL, pagination defaults |

### Hooks

| Hook | Description |
|------|-------------|
| `use-async.ts` | Generic async state management (loading/error/data) |

---

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `BETTER_AUTH_SECRET` | Yes | BetterAuth session signing secret |
| `BETTER_AUTH_URL` | Yes | Base URL for auth callbacks |
| `SMTP_HOST` | Yes | SMTP server host (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | Yes | SMTP port (e.g. `465`) |
| `SMTP_USER` | Yes | SMTP username/email |
| `SMTP_PASS` | Yes | SMTP password (Gmail App Password) |
| `SMTP_FROM` | No | Sender display name and email |

---

## Not Yet Implemented

| Item | Notes |
|------|-------|
| Task management UI | Components exist (`TaskCard`, `TaskList`) but no page mounts them |
| Task API authentication | `/api/v1/tasks` has no auth guard |
| MongoDB task repository | Currently in-memory only |
| Route middleware | No `middleware.ts` — protected routes rely on client-side redirects |
| Password reset flow | No forgot-password implementation |
| Google OAuth | Button present but disabled |
| Footer links | `/privacy`, `/terms`, `/support`, `/about` will 404 |

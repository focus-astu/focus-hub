# Roles & Access Control

This document defines every role on the Focus Hub platform, what each role can do, how roles are assigned, and how the access control system is implemented technically.

---

## Table of Contents

- [1. Role Hierarchy](#1-role-hierarchy)
- [2. Role Definitions](#2-role-definitions)
- [3. Permission Matrix](#3-permission-matrix)
- [4. How Roles Are Assigned](#4-how-roles-are-assigned)
- [5. Multi-Role Users & Role Switching](#5-multi-role-users--role-switching)
- [6. Organization-Based Access Control](#6-organization-based-access-control)
- [7. Route Protection Patterns](#7-route-protection-patterns)

---

## 1. Role Hierarchy

```
Admin (global system control)
  │
  ├── Teacher (academic management)
  ├── Counselor (student support)
  └── General Leader (logistical communication)
        │
        └── Student (base role — everyone starts here)
              │
              └── Tech Student (Student subset with Tech Community Hub access)
```

**Key rule:** All elevated roles originate from Student via Admin promotion. There is no way to register directly as a Teacher, Counselor, or Admin. The only exception is the **very first user** who registers on the platform — they are automatically promoted to Admin.

---

## 2. Role Definitions

### Student (Base Role)

**Access level:** Standard internal access

Every approved user is a Student. This is the foundation role that all other roles build upon.

**Capabilities:**
- View blog posts
- View platform announcements
- Access learning resources assigned to them
- Complete tasks (if assigned)
- Track their own learning progress

**Cannot:**
- Create tasks, blog posts, or announcements
- Access counseling tools (as a provider)
- Approve users or assign roles
- Access admin dashboards

---

### Tech Student (Specialized Student)

**Access level:** Student + Tech Community Hub

Tech Students are a subset of Students with additional access to technology-focused spaces.

**Additional capabilities (beyond Student):**
- Access the dedicated Tech Community Hub
- Peer interaction space
- Community involvement management
- Learning performance tracking tools

**Functional flow:**
1. Teacher assigns tasks or a learning roadmap
2. Tech Student accesses the roadmap
3. Student completes milestones
4. Progress is tracked within the hub
5. Teacher monitors performance metrics

---

### Teacher

**Access level:** Academic management

Teachers are responsible for creating the learning structure that students follow.

**Capabilities (in addition to everything a Student can do):**
- Create tasks
- Publish assignments
- Design structured learning roadmaps
- Monitor student progress
- Review performance metrics

**Cannot:**
- Manage system roles or approve users
- Post platform-wide announcements or blog posts (that is the General Leader role)
- Provide counseling services (that is the Counselor role)

**Workflow:**
1. Create a learning roadmap
2. Break the roadmap into tasks
3. Assign tasks to students
4. Monitor submissions
5. Track performance indicators

---

### Counselor

**Access level:** Student support

Counselors focus exclusively on student well-being, not academic task management.

**Capabilities (in addition to everything a Student can do):**
- Provide emotional support
- Offer academic life guidance
- Give financial advice
- University life mentorship
- Extracurricular guidance

**Cannot:**
- Create academic tasks or assignments
- Post announcements or blog posts
- Approve users or assign roles

**Interaction flow:**
1. Student initiates a support request or engages in counseling
2. Counselor provides structured guidance
3. Follow-up interactions may occur
4. Private counseling interactions are never displayed publicly

---

### General Leader (Platform Arranger)

**Access level:** Logistical communication

General Leaders are the communication coordinators of the platform.

**Capabilities (in addition to everything a Student can do):**
- Post logistical announcements
- Broadcast event schedules
- Share meeting locations
- Publish program updates
- Manage official platform blog posts

**Cannot:**
- Create academic tasks or track student performance
- Provide counseling
- Approve accounts or promote roles

---

### Admin

**Access level:** Global system control

Admins have full platform authority. They are the governance backbone of Focus Hub.

**User management:**
- View all registered users (pending, approved, rejected)
- Approve or reject pending accounts (with optional rejection reason)
- Suspend accounts (temporary restriction)
- Ban accounts (permanent block)
- Delete accounts

**Role management:**
- Assign roles by adding users to organizations
- Promote Students to Teacher, Counselor, General Leader, or Admin
- Remove users from organizations (demote)

**System oversight:**
- Monitor platform activity
- Moderate content
- Enforce fellowship rules and policies
- View platform analytics and metrics (total users, resources, blog views, activity trends)
- Generate reports (engagement, resource usage, participation, system growth)

**Security requirements for Admin actions:**
- All actions must be logged (Admin ID, User ID, action type, timestamp, reason)
- Sensitive actions (role change, deletion, ban) require confirmation
- Admin role assignment requires additional confirmation due to high privilege level

---

## 3. Permission Matrix

| Feature | Guest | Student | Tech Student | Teacher | Counselor | General Leader | Admin |
|---------|-------|---------|-------------|---------|-----------|----------------|-------|
| View public blog | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| View announcements | No | Yes | Yes | Yes | Yes | Yes | Yes |
| Access dashboards | No | Yes | Yes | Yes | Yes | Yes | Yes |
| Create tasks | No | No | No | Yes | No | No | Yes |
| Create blog posts | No | No | No | No | No | Yes | Yes |
| Create announcements | No | No | No | No | No | Yes | Yes |
| Track learning progress | No | Yes | Yes | Yes | No | No | Yes |
| Tech Community Hub | No | No | Yes | No | No | No | Yes |
| Provide counseling | No | No | No | No | Yes | No | Yes |
| Approve users | No | No | No | No | No | No | Yes |
| Assign roles | No | No | No | No | No | No | Yes |
| Suspend/ban users | No | No | No | No | No | No | Yes |
| View platform metrics | No | No | No | No | No | No | Yes |
| Generate reports | No | No | No | No | No | No | Yes |

---

## 4. How Roles Are Assigned

### First User — Automatic Admin

The very first person to register on the platform is automatically:
1. Given the `admin` role
2. Auto-approved (skips the approval step)
3. Added to the `admins` organization as owner
4. Responsible for creating the default organizations (`teachers`, `counselors`, `general-leaders`)

This is handled by a `databaseHooks.user.create.after` hook that checks if the user count is 1.

### All Subsequent Users — Student by Default

Every user after the first:
1. Registers and verifies their email
2. Waits for admin approval
3. Upon approval, becomes a **Student** with base permissions
4. Has no elevated roles unless explicitly promoted by an Admin

### Promotion to Elevated Roles

Admins promote users by adding them to BetterAuth **Organizations**:

| Action | Result |
|--------|--------|
| Add user to `teachers` organization | User gains Teacher permissions |
| Add user to `counselors` organization | User gains Counselor permissions |
| Add user to `general-leaders` organization | User gains General Leader permissions |
| Add user to `admins` organization | User gains full Admin permissions |

Removing a user from an organization revokes that role's permissions.

---

## 5. Multi-Role Users & Role Switching

A single user can belong to **multiple organizations simultaneously**. For example:
- A user in both `teachers` and `general-leaders` can create tasks (Teacher) and post announcements (General Leader)
- A user in `admins` has all permissions regardless of other org memberships

**Role switching is implicit.** Users do not manually toggle between roles. Instead, the platform checks the user's combined permissions across all their organizations. When a user performs an action, the system checks if any of their roles grants the required permission.

From the user's perspective:
- They always have Student access (base)
- If they are in the `teachers` org, they see Teacher-specific features in their UI
- If they are in the `counselors` org, counseling features appear
- The UI adapts based on the union of all their roles

---

## 6. Organization-Based Access Control

### How It Works

BetterAuth's **Organization** plugin is used to model roles. Each "role" on the platform corresponds to a BetterAuth organization:

| Org Slug | Org Name | Platform Role | Description |
|----------|----------|---------------|-------------|
| `teachers` | Teachers | Teacher | Can create tasks, assignments, roadmaps |
| `counselors` | Counselors | Counselor | Can provide counseling support |
| `general-leaders` | General Leaders | General Leader | Can post announcements, blog posts |
| `admins` | Admins | Admin | Full platform control |

### Permission Statements

The access control system defines permission statements for platform resources:

| Resource | Available Actions |
|----------|------------------|
| `announcement` | create, read, update, delete |
| `blogPost` | create, read, update, delete |
| `task` | create, read, update, delete, assign |
| `learningResource` | create, read, update, delete |
| `counseling` | create, read |
| `userManagement` | approve, reject, ban, promote |

### Role-to-Permission Mapping

| Role | announcement | blogPost | task | learningResource | counseling | userManagement |
|------|-------------|----------|------|-----------------|------------|----------------|
| member (Student) | read | read | read | read | — | — |
| teacher | read | read | create, read, update, delete, assign | create, read, update, delete | — | — |
| counselor | read | read | — | — | create, read | — |
| generalLeader | create, read, update, delete | create, read, update, delete | — | — | — | — |
| platformAdmin | all | all | all | all | all | all |

### Server-Side Permission Check

```typescript
import { auth } from "@/core/auth/infrastructure/config/auth"
import { headers } from "next/headers"

const canCreateTask = await auth.api.hasPermission({
  headers: await headers(),
  body: {
    permission: {
      task: ["create"],
    },
  },
})
```

### Client-Side Permission Check

```typescript
import { authClient } from "@/lib/auth-client"

const { data: orgs } = authClient.useListOrganizations()
const isAdmin = orgs?.some((org) => org.slug === "admins")

const { data } = await authClient.organization.hasPermission({
  permission: {
    task: ["create"],
  },
})
```

---

## 7. Route Protection Patterns

### Server Component Protection

```typescript
import { auth } from "@/core/auth/infrastructure/config/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/login")
  }

  if (!session.user.approved) {
    redirect("/pending-approval")
  }

  return <div>Protected content</div>
}
```

### Admin-Only Page Protection

```typescript
export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) redirect("/login")
  if (!session.user.approved) redirect("/pending-approval")

  const orgs = await auth.api.listOrganizations({ headers: await headers() })
  const isAdmin = orgs.some((org) => org.slug === "admins")

  if (!isAdmin) redirect("/dashboard")

  return <div>Admin-only content</div>
}
```

### API Route Protection

```typescript
export const GET = async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const orgs = await auth.api.listOrganizations({ headers: await headers() })
  const isAdmin = orgs.some((org) => org.slug === "admins")
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Proceed with admin-only logic
}
```

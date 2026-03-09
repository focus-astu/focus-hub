# Focus Hub

A productivity and focus management platform built with Next.js 16 (App Router), following Clean Architecture principles for scalable team development.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Folder Structure](#folder-structure)
- [Branching & PR Standard Operating Procedure](#branching--pr-standard-operating-procedure)
- [Feature Development Guide](#feature-development-guide)
- [Testing Standards](#testing-standards)
- [Component System](#component-system)
- [Tech Stack](#tech-stack)
- [Further Reading](#further-reading)

---

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Git

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd focus-hub

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Create production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint across the project |
| `pnpm test` | Run test suite |
| `pnpm test:watch` | Run tests in watch mode |

---

## Architecture Overview

This project implements **Clean Architecture** within the Next.js App Router. The core principle is the **Dependency Rule**: source code dependencies always point inward, from frameworks toward business logic.

```
┌─────────────────────────────────────────────────────────┐
│  PRESENTATION    (Next.js Pages, Components, API Routes)│
│  ┌───────────────────────────────────────────────────┐  │
│  │  APPLICATION  (Use Cases, DTOs, Ports)            │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  DOMAIN    (Entities, Value Objects, Enums)  │  │  │
│  │  │            Zero framework dependencies       │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  INFRASTRUCTURE  (Repositories, External APIs)    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Why Clean Architecture?

- **Testability**: Domain and use cases test without frameworks or databases
- **Swappable Infrastructure**: Change from Supabase to Prisma by implementing a new repository — zero changes to business logic
- **Small, Reviewable PRs**: Each architectural layer is independently changeable
- **Parallel Development**: Frontend and backend teams work on different layers simultaneously
- **Onboarding**: Consistent patterns mean developers know where everything lives

> For a deep dive, see [docs/architecture.md](docs/architecture.md)

---

## Folder Structure

```
focus-hub/
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── api/v1/                       # REST API routes
│   │   │   └── tasks/route.ts            # Thin controllers → use cases
│   │   ├── layout.tsx                    # Root layout
│   │   ├── page.tsx                      # Home page
│   │   └── globals.css                   # Global styles
│   │
│   ├── core/                             # Clean Architecture Core (feature-based)
│   │   ├── tasks/                        # ── Task Feature Module ──
│   │   │   ├── domain/                   # Entity, enums (zero deps)
│   │   │   │   ├── task.entity.ts
│   │   │   │   ├── priority.enum.ts
│   │   │   │   └── task-status.enum.ts
│   │   │   ├── application/              # Use cases, DTOs, ports
│   │   │   │   ├── dtos/task.dto.ts
│   │   │   │   ├── ports/task-repository.port.ts
│   │   │   │   └── use-cases/
│   │   │   ├── infrastructure/           # Repository implementations
│   │   │   │   └── repositories/
│   │   │   └── index.ts                  # Public API barrel
│   │   │
│   │   ├── shared/                       # ── Cross-Cutting Concerns ──
│   │   │   ├── domain/                   # Shared errors, value objects
│   │   │   │   ├── errors/
│   │   │   │   └── value-objects/
│   │   │   ├── application/              # Shared ports (IdGenerator, etc.)
│   │   │   │   └── ports/
│   │   │   └── infrastructure/           # Shared adapters + composition root
│   │   │       ├── adapters/
│   │   │       └── config/dependencies.ts
│   │   │
│   │   └── [next-feature]/               # Same pattern for every new feature
│   │
│   ├── components/                       # Shared UI (Component-Driven Dev)
│   │   ├── ui/                           # Atomic/primitive components
│   │   │   ├── button/                   # Each has: component, types, index
│   │   │   ├── input/
│   │   │   └── card/
│   │   ├── composed/                     # Molecule components (reusable combos)
│   │   ├── layouts/                      # Structural layout components
│   │   └── providers/                    # React context providers
│   │
│   ├── features/                         # Feature Modules (vertical slices)
│   │   └── tasks/
│   │       ├── components/               # Feature-specific UI
│   │       ├── hooks/                    # Feature-specific hooks
│   │       ├── actions/                  # Server actions
│   │       ├── types.ts                  # Type aliases
│   │       └── index.ts                  # Public barrel export
│   │
│   ├── hooks/                            # Shared custom React hooks
│   ├── lib/                              # Utilities & helpers
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── validations/                  # Input validation schemas
│   ├── types/                            # Shared TypeScript types
│   └── config/                           # App-level configuration
│
├── __tests__/                            # All tests (isolated from source)
│   ├── fixtures/                         # Test data & mock factories
│   │   ├── tasks.fixture.ts              # Static test literals
│   │   ├── factories/                    # Dynamic test data builders
│   │   └── index.ts                      # Barrel export
│   ├── unit/
│   │   ├── core/domain/                  # Entity tests
│   │   ├── core/use-cases/               # Use case tests
│   │   └── components/                   # Component unit tests
│   ├── integration/
│   │   ├── api/                          # API route integration tests
│   │   └── features/                     # Feature integration tests
│   └── e2e/                              # End-to-end tests
│
├── docs/                                 # Architecture & workflow docs
│   ├── architecture.md                   # Clean Architecture deep dive
│   ├── branching-strategy.md             # Git workflow & PR SOP
│   └── feature-workflow.md               # Step-by-step feature guide
│
├── public/                               # Static assets
├── tsconfig.json                         # TypeScript config with path aliases
├── next.config.ts                        # Next.js configuration
├── eslint.config.mjs                     # ESLint configuration
├── postcss.config.mjs                    # PostCSS + Tailwind
└── package.json
```

### Import Path Aliases

```typescript
import { Task, Priority } from "@/core/tasks"             // feature module barrel
import type { CreateTaskDTO } from "@/core/tasks"          // types from feature module
import { DomainError } from "@/core/shared"                // shared cross-cutting
import { Button } from "@/components/ui"                   // UI primitives
import { TaskList } from "@/features/tasks"                // frontend feature
import { cn } from "@/lib/utils"                           // shared utilities
import type { ApiResponse } from "@/types"                 // shared types
```

---

## Branching & PR Standard Operating Procedure

### Branch Structure

| Branch | Purpose | Merges Into |
|--------|---------|-------------|
| `main` | Production-ready code | — |
| `front-main` | Frontend integration staging | `main` |
| `back-main` | Backend integration staging | `main` |
| `front-main-[feature]` | Frontend feature work | `front-main` |
| `back-main-[feature]` | Backend feature work | `back-main` |
| `integration-[feature]` | Cross-team features | `main` |
| `hotfix-[issue]` | Critical production fixes | `main` |

### Creating a Feature Branch

```bash
# Frontend developer
git checkout front-main && git pull origin front-main
git checkout -b front-main-task-board

# Backend developer
git checkout back-main && git pull origin back-main
git checkout -b back-main-task-crud
```

### Commit Convention

```
<type>(<scope>): <description>

# Types: feat, fix, chore, docs, style, refactor, perf, test
# Examples:
feat(tasks): add task creation form with validation
fix(auth): resolve token refresh race condition
refactor(core): extract shared validation logic
```

### PR Process

1. **Create PR** to your team's integration branch (`front-main` or `back-main`)
2. **Keep PRs small**: aim for <500 lines changed
3. **Require 1 approval** from a team member
4. **All CI checks** must pass before merge
5. **Squash merge** into team branch for clean history
6. **Release to main**: team branches merge into `main` when a batch is ready (requires 2 approvals)

### Cross-Team Features (Full-Stack)

When a feature needs both frontend and backend:

1. **Agree on the contract first** — shared DTOs and ports in the feature's `src/core/[feature]/application/`
2. Backend builds against the contract, frontend builds with mock data
3. Both merge independently into their team branches
4. Integration tests verify compatibility before merging to `main`

> For the complete strategy with diagrams, see [docs/branching-strategy.md](docs/branching-strategy.md)

---

## Feature Development Guide

### Backend: Route → Use Case → Data Access

```
1. src/core/[feature]/domain/                     → Define entity + enums
2. src/core/[feature]/application/dtos/            → Define input/output shapes
3. src/core/[feature]/application/ports/           → Define the repository interface
4. src/core/[feature]/application/use-cases/       → Implement business logic
5. src/core/[feature]/infrastructure/repositories/ → Implement the repository
6. src/core/[feature]/index.ts                     → Barrel-export the public API
7. src/core/shared/infrastructure/config/          → Wire dependencies
8. src/app/api/v1/                                 → Create thin API route
9. __tests__/                                      → Write fixtures + tests
```

### Frontend: Component → Page → Data Integration

```
1. src/components/ui/               → Build/reuse atomic UI
2. src/features/[name]/components/  → Build feature components
3. src/features/[name]/actions/     → Create server actions
4. src/features/[name]/types.ts     → Define type aliases
5. src/app/                         → Create the page
6. __tests__/                       → Write component tests
```

> For a complete walkthrough with code examples, see [docs/feature-workflow.md](docs/feature-workflow.md)

---

## Testing Standards

### Directory Structure

All tests live in `__tests__/` at the project root, mirroring the source structure:

```
__tests__/
├── fixtures/           # ALL test data lives here
│   ├── tasks.fixture.ts
│   ├── users.fixture.ts
│   └── factories/
│       └── task.factory.ts
├── unit/
│   ├── core/domain/
│   └── core/use-cases/
├── integration/
│   ├── api/
│   └── features/
└── e2e/
```

### Rule: Isolated Test Literals

**All mock data, test literals, and fixtures MUST be defined in `__tests__/fixtures/` and imported into test files.** Never hardcode test data inline.

```typescript
// CORRECT — import from fixtures
import { MOCK_CREATE_TASK_DTO, MOCK_TASK_RESPONSE } from "@/__tests__/fixtures"

it("should create a task", async () => {
  const result = await createTask(MOCK_CREATE_TASK_DTO)
  expect(result.title).toBe(MOCK_CREATE_TASK_DTO.title)
})
```

```typescript
// WRONG — hardcoded test data
it("should create a task", async () => {
  const result = await createTask({
    title: "Some task",          // Don't do this
    description: "Some desc",    // Don't do this
    priority: "high",            // Don't do this
  })
})
```

### Fixture Conventions

- **Static fixtures** (`*.fixture.ts`): Named `MOCK_` prefix, represent known stable data
- **Factory functions** (`factories/*.factory.ts`): Named `build` prefix, generate variations with overrides
- **Barrel export**: All fixtures export from `__tests__/fixtures/index.ts`

```typescript
// Static fixture
export const MOCK_TASK_PROPS: TaskProps = { /* ... */ }

// Factory function
export const buildTaskProps = (overrides?: Partial<TaskProps>): TaskProps => ({
  ...MOCK_TASK_PROPS,
  id: `task-factory-${++counter}`,
  ...overrides,
})
```

### What to Test

| Layer | What to Test | Tool |
|-------|-------------|------|
| Domain Entities | Business rules, state transitions | Jest |
| Use Cases | Orchestration logic with mocked ports | Jest |
| API Routes | Request/response, status codes, validation | Jest + Supertest |
| Components | Rendering, user interactions | React Testing Library |
| E2E | Critical user journeys | Playwright/Cypress |

### Test Naming Convention

```
[entity].[layer].test.ts

Examples:
  task.entity.test.ts
  create-task.use-case.test.ts
  tasks-api.integration.test.ts
  button.component.test.ts
```

---

## Component System

### Component-Driven Development Tiers

| Tier | Location | Purpose | Example |
|------|----------|---------|---------|
| **UI Primitives** | `src/components/ui/` | Atomic, generic, highly reusable | Button, Input, Card |
| **Composed** | `src/components/composed/` | Combinations of primitives | SearchBar, NavItem |
| **Layouts** | `src/components/layouts/` | Structural shells | Sidebar, Header |
| **Feature** | `src/features/*/components/` | Domain-specific UI | TaskCard, ProjectForm |

### Component Directory Convention

Each UI component gets its own directory:

```
src/components/ui/button/
├── button.tsx           # Component implementation
├── button.types.ts      # TypeScript types/props
└── index.ts             # Barrel export
```

### Promotion Rule

When a feature component is used by **2 or more features**, promote it to `src/components/composed/`.

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | Full-stack React framework (App Router) |
| **React 19** | UI library |
| **TypeScript 5** | Type safety |
| **Tailwind CSS 4** | Utility-first styling |
| **pnpm** | Package manager |
| **ESLint** | Code quality |
| **Jest** | Unit & integration testing |

---

## Further Reading

- [Architecture Deep Dive](docs/architecture.md) — Why Clean Architecture and how each layer works
- [Branching Strategy](docs/branching-strategy.md) — Complete git workflow with cross-team patterns
- [Feature Workflow](docs/feature-workflow.md) — Step-by-step guide with code examples

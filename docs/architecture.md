# Architecture Philosophy

## Why Clean Architecture in Next.js?

Next.js is a powerful full-stack framework, but without guardrails it's easy for business logic to leak into API routes, server components to become tightly coupled to data sources, and pages to grow into unmaintainable monoliths. Clean Architecture solves this by enforcing a **dependency rule**: inner layers know nothing about outer layers.

```
┌──────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│            (Next.js App Router, Pages, Components)           │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                  APPLICATION LAYER                     │  │
│  │              (Use Cases, DTOs, Ports)                   │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │                DOMAIN LAYER                      │  │  │
│  │  │        (Entities, Value Objects, Enums)           │  │  │
│  │  │                                                  │  │  │
│  │  │   Zero dependencies on frameworks or libraries   │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │               INFRASTRUCTURE LAYER                     │  │
│  │        (Repositories, External Services, Adapters)     │  │
│  │                                                        │  │
│  │   Implements outbound ports defined in Application     │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## The Dependency Rule

Dependencies always point **inward**:

- **Domain** depends on → nothing
- **Application** depends on → Domain only
- **Infrastructure** depends on → Application + Domain
- **Presentation** depends on → Application + Domain (via dependency injection)

The Presentation and Infrastructure layers **never import each other directly**. They communicate through the Application layer's ports (interfaces).

## Feature-Based Module Organization

Instead of grouping all entities together, all use cases together, etc. (layer-first), we organize by **feature module**. Each feature owns its entire Clean Architecture stack:

```
src/core/
├── tasks/                           # Task feature module
│   ├── domain/                      # Entity, enums
│   ├── application/                 # Use cases, DTOs, ports
│   ├── infrastructure/              # Repository implementations
│   └── index.ts                     # Public API barrel
│
├── projects/                        # Project feature module (same pattern)
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── index.ts
│
└── shared/                          # Cross-cutting concerns
    ├── domain/errors/               # Shared error types
    ├── application/ports/           # Shared ports (IdGenerator, Logger, etc.)
    └── infrastructure/
        ├── adapters/                # Shared adapters
        └── config/dependencies.ts   # Composition root — wires all features
```

### Why Feature-Based?

| Layer-First (avoid) | Feature-Based (our approach) |
|---------------------|------------------------------|
| `entities/task.ts`, `entities/project.ts`, `entities/user.ts` — everything dumped together | `tasks/domain/task.entity.ts` — co-located with its use cases and ports |
| Finding related files means jumping across 5+ directories | Everything for a feature is one `Cmd+P` away |
| PRs touch many top-level directories | PRs are scoped to `src/core/[feature]/` |

## Layer Responsibilities (Within Each Feature Module)

### Domain Layer (`src/core/[feature]/domain/`)

The heart of the feature. Contains:

- **Entities**: Rich objects with identity and behavior (e.g., `Task`)
- **Enums**: Feature-specific constants (e.g., `Priority`, `TaskStatus`)
- **Value Objects**: Immutable objects defined by their attributes

Rules:
- Zero imports from any framework (no Next.js, no database clients)
- Entities are immutable — methods return new instances
- Business rules live here, not in controllers
- Can import from `@/core/shared/domain` only

### Application Layer (`src/core/[feature]/application/`)

Orchestrates the domain to fulfill use cases. Contains:

- **Use Cases**: Single-purpose functions (e.g., `createCreateTaskUseCase`)
- **Ports**: Interfaces that define repository contracts
- **DTOs**: Data shapes for crossing boundaries

Rules:
- Depends only on its own Domain layer and `@/core/shared`
- Defines ports (interfaces), never implements them
- Use cases are factory functions that accept dependencies

### Infrastructure Layer (`src/core/[feature]/infrastructure/`)

Implements the contracts defined by the Application layer. Contains:

- **Repositories**: Database access implementations (Supabase, Prisma, In-Memory, etc.)

Rules:
- Implements outbound ports from the feature's Application layer
- Can import from its own Application and Domain layers

### Shared Module (`src/core/shared/`)

Cross-cutting concerns that span multiple features:

- **Domain**: Shared error types, base value objects
- **Application**: Shared ports (e.g., `IdGenerator`, `Logger`)
- **Infrastructure**: Shared adapters + the **composition root** (`dependencies.ts`) which wires all features together

Rules:
- The composition root is the only place where infrastructure meets application
- Feature modules never import each other's infrastructure — they only share via `shared/`

### Presentation Layer (`src/app/`, `src/features/`, `src/components/`)

The Next.js framework layer. Contains:

- **App Router**: Pages, layouts, API routes
- **Features**: Vertical slices with feature-specific components, hooks, actions
- **Components**: Shared UI building blocks

Rules:
- API routes are thin controllers — they validate input, call use cases, format output
- Server Actions delegate to use cases
- Components are purely presentational when possible
- Frontend features import from the `@/core/[feature]` barrel export, never from internal paths

## Why This Matters for Teams

| Benefit | How It Helps |
|---------|-------------|
| **Small PRs** | Each feature module is independently changeable |
| **Easy Testing** | Domain and Use Cases test without databases or frameworks |
| **Onboarding** | New developers follow a consistent pattern |
| **Swappable Infrastructure** | Change from Supabase to Prisma by implementing a new repository |
| **Parallel Development** | Frontend and backend teams work on different layers simultaneously |

## The Data Flow

```
User Action
    ↓
Page / Server Component
    ↓
Server Action or API Route (thin controller)
    ↓
Use Case (application logic)
    ↓
Port Interface ← → Repository Implementation (infrastructure)
    ↓
Domain Entity (business rules)
    ↓
DTO Response
    ↓
UI Component renders the result
```

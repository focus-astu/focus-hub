# Feature Workflow Guide

This guide walks through how to add a new feature end-to-end, following the feature-based Clean Architecture pattern. We'll use a concrete example: **adding a "Project" resource**.

The key idea: each feature in `src/core/` owns its **entire backend stack** (domain, application, infrastructure), just like each feature in `src/features/` owns its **entire frontend stack** (components, hooks, actions).

---

## Backend Workflow: Route → Use Case → Data Access

### Step 1: Create the Feature Module Directory

```bash
mkdir -p src/core/projects/{domain,application/{dtos,ports,use-cases},infrastructure/repositories}
```

This gives you:

```
src/core/projects/
├── domain/
├── application/
│   ├── dtos/
│   ├── ports/
│   └── use-cases/
├── infrastructure/
│   └── repositories/
└── index.ts              # Create this — the public API barrel
```

### Step 2: Define the Domain Entity

Create `src/core/projects/domain/project.entity.ts`:

```typescript
export type ProjectProps = {
  id: string
  name: string
  description: string
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

export class Project {
  private constructor(private readonly props: ProjectProps) {}

  static create(
    props: Omit<ProjectProps, "id" | "createdAt" | "updatedAt">,
    id: string,
  ): Project {
    return new Project({
      ...props,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  static reconstitute(props: ProjectProps): Project {
    return new Project(props)
  }

  get id() { return this.props.id }
  get name() { return this.props.name }
  // ... other getters

  toJSON(): ProjectProps {
    return { ...this.props }
  }
}
```

Barrel-export from `src/core/projects/domain/index.ts`:

```typescript
export { Project } from "./project.entity"
export type { ProjectProps } from "./project.entity"
```

### Step 3: Define the DTOs

Create `src/core/projects/application/dtos/project.dto.ts`:

```typescript
export type CreateProjectDTO = {
  name: string
  description: string
  ownerId: string
}

export type ProjectResponseDTO = {
  id: string
  name: string
  description: string
  ownerId: string
  createdAt: string
  updatedAt: string
}
```

### Step 4: Define the Outbound Port

Create `src/core/projects/application/ports/project-repository.port.ts`:

```typescript
import type { Project } from "@/core/projects/domain"

export type ProjectRepository = {
  findById: (id: string) => Promise<Project | null>
  findAll: () => Promise<Project[]>
  create: (project: Project) => Promise<Project>
  delete: (id: string) => Promise<void>
}
```

### Step 5: Implement the Use Case

Create `src/core/projects/application/use-cases/create-project.use-case.ts`:

```typescript
import { Project } from "@/core/projects/domain"
import type { CreateProjectDTO, ProjectResponseDTO } from "@/core/projects/application/dtos/project.dto"
import type { ProjectRepository } from "@/core/projects/application/ports/project-repository.port"
import type { IdGenerator } from "@/core/shared/application/ports/id-generator.port"

export type CreateProjectDependencies = {
  projectRepository: ProjectRepository
  idGenerator: IdGenerator
}

export const createCreateProjectUseCase = (deps: CreateProjectDependencies) => {
  return async (dto: CreateProjectDTO): Promise<ProjectResponseDTO> => {
    const project = Project.create(
      {
        name: dto.name,
        description: dto.description,
        ownerId: dto.ownerId,
      },
      deps.idGenerator.generate(),
    )

    const saved = await deps.projectRepository.create(project)
    const json = saved.toJSON()

    return {
      ...json,
      createdAt: json.createdAt.toISOString(),
      updatedAt: json.updatedAt.toISOString(),
    }
  }
}
```

Notice: the only cross-feature import is `IdGenerator` from `@/core/shared`. Everything else comes from within `@/core/projects/`.

### Step 6: Implement the Repository

Create `src/core/projects/infrastructure/repositories/in-memory-project.repository.ts`:

```typescript
import { Project } from "@/core/projects/domain"
import type { ProjectRepository } from "@/core/projects/application/ports/project-repository.port"

export const createInMemoryProjectRepository = (): ProjectRepository => {
  const store = new Map()
  return {
    findById: async (id) => { /* ... */ },
    findAll: async () => { /* ... */ },
    create: async (project) => { /* ... */ },
    delete: async (id) => { /* ... */ },
  }
}
```

### Step 7: Create the Barrel Export

Create `src/core/projects/index.ts` — this is the **public API** of the feature module:

```typescript
export { Project } from "./domain"
export type { ProjectProps } from "./domain"

export type { CreateProjectDTO, ProjectResponseDTO } from "./application/dtos/project.dto"
export type { ProjectRepository } from "./application/ports/project-repository.port"
export { createCreateProjectUseCase } from "./application/use-cases/create-project.use-case"

export { createInMemoryProjectRepository } from "./infrastructure/repositories/in-memory-project.repository"
```

External consumers (API routes, frontend features) import from `@/core/projects` — never from internal paths.

### Step 8: Wire Dependencies

Update `src/core/shared/infrastructure/config/dependencies.ts`:

```typescript
import { cryptoIdGenerator } from "@/core/shared/infrastructure/adapters/crypto-id-generator"
import {
  createCreateProjectUseCase,
  createInMemoryProjectRepository,
} from "@/core/projects"

// ─── Projects Feature ────────────────────────────────────────
const projectRepository = createInMemoryProjectRepository()
export const createProject = createCreateProjectUseCase({ projectRepository, idGenerator: cryptoIdGenerator })
```

### Step 9: Create the API Route

Create `src/app/api/v1/projects/route.ts`:

```typescript
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createProject } from "@/core/shared/infrastructure/config/dependencies"

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json()
    const project = await createProject(body)
    return NextResponse.json({ data: project }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
```

### Step 10: Write Tests

Create test fixtures in `__tests__/fixtures/projects.fixture.ts`, then write:
- Unit test for the entity in `__tests__/unit/core/domain/`
- Unit test for the use case in `__tests__/unit/core/use-cases/`
- Integration test for the API route in `__tests__/integration/api/`

---

## Frontend Workflow: UI Component → Page → Data Integration

### Step 1: Create Feature-Specific Components

Create the feature directory: `src/features/projects/`

```
src/features/projects/
├── components/
│   ├── project-card.tsx
│   ├── project-list.tsx
│   ├── create-project-form.tsx
│   └── index.ts
├── hooks/
│   └── use-projects.ts
├── actions/
│   └── project.actions.ts
├── types.ts
└── index.ts
```

### Step 2: Build Presentational Components

Start with the smallest component. Use shared UI primitives:

```typescript
// src/features/projects/components/project-card.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui"
import type { ProjectResponseDTO } from "@/core/projects"

type ProjectCardProps = {
  project: ProjectResponseDTO
}

export const ProjectCard = ({ project }: ProjectCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{project.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-zinc-600">{project.description}</p>
    </CardContent>
  </Card>
)
```

### Step 3: Create Server Actions

```typescript
// src/features/projects/actions/project.actions.ts
"use server"

import { createProject } from "@/core/shared/infrastructure/config/dependencies"
import type { CreateProjectDTO } from "@/core/projects"

export const addProject = async (dto: CreateProjectDTO) => {
  return createProject(dto)
}
```

### Step 4: Build the Page

```typescript
// src/app/(dashboard)/projects/page.tsx
import { ProjectList } from "@/features/projects"

const ProjectsPage = async () => {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-8 text-2xl font-bold">Projects</h1>
      <ProjectList />
    </main>
  )
}

export default ProjectsPage
```

### Step 5: Add Interactivity (Client Components)

```typescript
// src/features/projects/components/create-project-form.tsx
"use client"

import { useState } from "react"
import { Button, Input } from "@/components/ui"
import { addProject } from "../actions/project.actions"

export const CreateProjectForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    await addProject({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      ownerId: "current-user-id",
    })
    setIsSubmitting(false)
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <Input name="name" label="Project name" required />
      <Input name="description" label="Description" required />
      <Button type="submit" isLoading={isSubmitting}>
        Create Project
      </Button>
    </form>
  )
}
```

---

## PR Checklist for New Features

### Backend PR should include:
- [ ] Feature module directory at `src/core/[feature]/`
- [ ] Domain entity + enums in `src/core/[feature]/domain/`
- [ ] DTOs in `src/core/[feature]/application/dtos/`
- [ ] Outbound port in `src/core/[feature]/application/ports/`
- [ ] Use case in `src/core/[feature]/application/use-cases/`
- [ ] Repository implementation in `src/core/[feature]/infrastructure/repositories/`
- [ ] Barrel export at `src/core/[feature]/index.ts`
- [ ] Dependency wiring in `src/core/shared/infrastructure/config/dependencies.ts`
- [ ] API route in `src/app/api/v1/[resource]/route.ts`
- [ ] Test fixtures in `__tests__/fixtures/`
- [ ] Unit tests for entity and use case

### Frontend PR should include:
- [ ] Feature directory in `src/features/[feature]/`
- [ ] Presentational components using shared UI primitives
- [ ] Server actions or hooks for data fetching
- [ ] Page in `src/app/`
- [ ] Barrel exports (`index.ts`) for clean imports
- [ ] Component tests if interactive

---

## Import Rules Quick Reference

| From | Can Import | Example |
|------|-----------|---------|
| API Route | `@/core/shared/infrastructure/config/dependencies` + `@/core/[feature]` (types only) | `import { createTask } from "...dependencies"` |
| Frontend Feature | `@/core/[feature]` (types) + `@/core/shared/infrastructure/config/dependencies` (actions) | `import type { TaskResponseDTO } from "@/core/tasks"` |
| Use Case | Own feature's domain + `@/core/shared` | `import { Task } from "@/core/tasks/domain"` |
| Repository | Own feature's domain + application | `import type { TaskRepository } from "@/core/tasks/application"` |
| Feature A | **Never** imports Feature B's infrastructure | Use `@/core/shared` for cross-feature communication |

---

## Shared UI Components: When to Create New vs. Reuse

| Scenario | Action |
|----------|--------|
| Need a basic button, input, card | Use `@/components/ui` |
| Need a search bar (input + button) | Create in `@/components/composed` |
| Need a feature-specific data display | Create in `@/features/[feature]/components` |
| A feature component is reused by 2+ features | Promote to `@/components/composed` |

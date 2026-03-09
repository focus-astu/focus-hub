# Branching & PR Strategy

## Branch Hierarchy

```
main (production-ready)
├── front-main (frontend integration)
│   ├── front-main-auth-login
│   ├── front-main-dashboard-cards
│   └── front-main-task-form
├── back-main (backend integration)
│   ├── back-main-auth-api
│   ├── back-main-task-crud
│   └── back-main-user-profile
└── integration/* (cross-team integration testing)
    └── integration-auth-flow
```

## Branch Types

| Branch | Purpose | Merges Into |
|--------|---------|-------------|
| `main` | Production-ready code | — |
| `front-main` | Frontend staging/integration | `main` |
| `back-main` | Backend staging/integration | `main` |
| `front-main-[feature]` | Frontend feature work | `front-main` |
| `back-main-[feature]` | Backend feature work | `back-main` |
| `integration-[feature]` | Cross-team features | `main` (after both sides merge) |
| `hotfix-[issue]` | Production hotfixes | `main` directly |

## Feature Branch Naming Convention

```
<team>-main-<feature-name>

Examples:
  front-main-task-board
  front-main-auth-ui
  back-main-task-crud-api
  back-main-user-permissions
```

Rules:
- Use lowercase kebab-case
- Be descriptive but concise
- Include the domain area (auth, task, user, etc.)

## PR Workflow

### Step 1: Create Feature Branch

```bash
# Frontend developer
git checkout front-main
git pull origin front-main
git checkout -b front-main-task-form

# Backend developer
git checkout back-main
git pull origin back-main
git checkout -b back-main-task-api
```

### Step 2: Develop & Commit

Follow conventional commits:
```bash
git commit -m "feat(tasks): add task creation form with validation"
git commit -m "fix(tasks): resolve priority dropdown default value"
```

### Step 3: Open PR to Team Branch

```bash
# Frontend PR → front-main
gh pr create --base front-main --title "feat(tasks): add task creation form"

# Backend PR → back-main
gh pr create --base back-main --title "feat(tasks): add task CRUD endpoints"
```

### Step 4: Review & Merge to Team Branch

- Minimum 1 approval required
- All CI checks must pass
- Squash merge preferred for clean history

### Step 5: Integration into Main

When a release batch is ready:
```bash
# Merge front-main into main
gh pr create --base main --head front-main --title "release(frontend): task management UI"

# Merge back-main into main
gh pr create --base main --head back-main --title "release(backend): task management API"
```

## Handling Cross-Team Features

When a feature requires both frontend and backend changes that depend on each other:

### Option A: Contract-First Development (Recommended)

1. Both teams agree on the API contract (DTOs, endpoints) via a shared PR to `main`
2. Backend implements the contract on `back-main-[feature]`
3. Frontend builds against the contract with mocked data on `front-main-[feature]`
4. Both merge independently — integration tests verify compatibility

### Option B: Integration Branch

1. Create `integration-[feature]` from `main`
2. Both teams branch from and PR into the integration branch
3. Once complete, create a single PR from `integration-[feature]` → `main`

```bash
git checkout main
git checkout -b integration-auth-flow

# Frontend work
git checkout -b front-main-auth-ui  # branched from integration-auth-flow
# ... work, PR into integration-auth-flow

# Backend work
git checkout integration-auth-flow
git checkout -b back-main-auth-api
# ... work, PR into integration-auth-flow

# Final integration PR
gh pr create --base main --head integration-auth-flow
```

### Option C: Shared Contracts in Core

Since the `src/core/` layer contains shared DTOs and ports:

1. A shared PR updates `src/core/application/dtos/` and `src/core/application/ports/`
2. This PR merges directly to `main`
3. Both `front-main` and `back-main` rebase on `main` to pick up the contracts
4. Teams implement independently

This is the **strongest approach** because the Clean Architecture already decouples the layers.

## PR Size Guidelines

| PR Type | Max Files Changed | Max Lines Changed |
|---------|-------------------|-------------------|
| Feature (small) | 5-10 | ~200 |
| Feature (medium) | 10-20 | ~500 |
| Refactor | 15-25 | ~400 |
| Bug fix | 1-5 | ~100 |
| Documentation | Any | Any |

If a PR exceeds these limits, break it into stacked PRs:
```
back-main-task-crud-1-entity      → back-main (domain + ports)
back-main-task-crud-2-use-cases   → back-main (use cases + DTOs)
back-main-task-crud-3-api         → back-main (API routes + infra)
```

## Keeping Branches in Sync

```bash
# Regularly sync team branches with main
git checkout front-main
git pull origin main
git push origin front-main

# Rebase feature branches on team branch
git checkout front-main-task-form
git rebase front-main
```

## Protection Rules

| Branch | Rules |
|--------|-------|
| `main` | Require 2 approvals, require CI pass, no force push |
| `front-main` | Require 1 approval, require CI pass |
| `back-main` | Require 1 approval, require CI pass |
| Feature branches | No restrictions (developer autonomy) |

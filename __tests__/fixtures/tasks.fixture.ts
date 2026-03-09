import type { TaskProps } from "@/core/tasks"
import type { CreateTaskDTO, TaskResponseDTO } from "@/core/tasks"

export const MOCK_TASK_PROPS: TaskProps = {
  id: "task-001",
  title: "Implement user authentication",
  description: "Set up JWT-based auth flow with refresh tokens",
  status: "todo",
  priority: "high",
  assigneeId: "user-001",
  createdAt: new Date("2026-01-15T10:00:00Z"),
  updatedAt: new Date("2026-01-15T10:00:00Z"),
}

export const MOCK_TASK_RESPONSE: TaskResponseDTO = {
  id: "task-001",
  title: "Implement user authentication",
  description: "Set up JWT-based auth flow with refresh tokens",
  status: "todo",
  priority: "high",
  assigneeId: "user-001",
  createdAt: "2026-01-15T10:00:00.000Z",
  updatedAt: "2026-01-15T10:00:00.000Z",
}

export const MOCK_CREATE_TASK_DTO: CreateTaskDTO = {
  title: "Build dashboard UI",
  description: "Create the main dashboard with task overview cards",
  priority: "medium",
  assigneeId: "user-002",
}

export const MOCK_TASKS_LIST: TaskResponseDTO[] = [
  MOCK_TASK_RESPONSE,
  {
    id: "task-002",
    title: "Design database schema",
    description: "Define tables for users, tasks, and projects",
    status: "completed",
    priority: "urgent",
    assigneeId: "user-001",
    createdAt: "2026-01-10T08:00:00.000Z",
    updatedAt: "2026-01-12T16:30:00.000Z",
  },
  {
    id: "task-003",
    title: "Write API documentation",
    description: "Document all REST endpoints with request/response schemas",
    status: "in_progress",
    priority: "low",
    assigneeId: null,
    createdAt: "2026-01-14T14:00:00.000Z",
    updatedAt: "2026-01-14T14:00:00.000Z",
  },
]

import type { Priority, TaskStatus } from "@/core/tasks/domain"

export type CreateTaskDTO = {
  title: string
  description: string
  priority: Priority
  assigneeId?: string
}

export type UpdateTaskDTO = {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: Priority
  assigneeId?: string | null
}

export type TaskResponseDTO = {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  assigneeId: string | null
  createdAt: string
  updatedAt: string
}

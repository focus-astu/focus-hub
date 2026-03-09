import type { Task } from "@/core/tasks/domain"

export type TaskRepository = {
  findById: (id: string) => Promise<Task | null>
  findAll: (filters?: TaskFilters) => Promise<Task[]>
  create: (task: Task) => Promise<Task>
  update: (task: Task) => Promise<Task>
  delete: (id: string) => Promise<void>
}

export type TaskFilters = {
  status?: string
  priority?: string
  assigneeId?: string
}

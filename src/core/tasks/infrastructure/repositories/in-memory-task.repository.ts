import { Task } from "@/core/tasks/domain"
import type { TaskProps } from "@/core/tasks/domain"
import type { TaskRepository, TaskFilters } from "@/core/tasks/application"

/**
 * In-memory implementation for development and testing.
 * Replace with a real database repository (e.g., SupabaseTaskRepository)
 * in production via dependency injection.
 */
export const createInMemoryTaskRepository = (): TaskRepository => {
  const store = new Map<string, TaskProps>()

  return {
    findById: async (id) => {
      const data = store.get(id)
      return data ? Task.reconstitute(data) : null
    },

    findAll: async (filters?: TaskFilters) => {
      let tasks = Array.from(store.values())

      if (filters?.status) {
        tasks = tasks.filter((t) => t.status === filters.status)
      }
      if (filters?.priority) {
        tasks = tasks.filter((t) => t.priority === filters.priority)
      }
      if (filters?.assigneeId) {
        tasks = tasks.filter((t) => t.assigneeId === filters.assigneeId)
      }

      return tasks.map(Task.reconstitute)
    },

    create: async (task) => {
      const data = task.toJSON()
      store.set(data.id, data)
      return task
    },

    update: async (task) => {
      const data = task.toJSON()
      store.set(data.id, data)
      return task
    },

    delete: async (id) => {
      store.delete(id)
    },
  }
}

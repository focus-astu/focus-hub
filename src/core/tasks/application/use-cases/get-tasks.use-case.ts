import type { TaskResponseDTO } from "@/core/tasks/application/dtos/task.dto"
import type { TaskRepository, TaskFilters } from "@/core/tasks/application/ports/task-repository.port"

export type GetTasksDependencies = {
  taskRepository: TaskRepository
}

export const createGetTasksUseCase = (deps: GetTasksDependencies) => {
  return async (filters?: TaskFilters): Promise<TaskResponseDTO[]> => {
    const tasks = await deps.taskRepository.findAll(filters)

    return tasks.map((task) => {
      const json = task.toJSON()
      return {
        ...json,
        createdAt: json.createdAt.toISOString(),
        updatedAt: json.updatedAt.toISOString(),
      }
    })
  }
}

import { Task, TaskStatus } from "@/core/tasks/domain"
import type { CreateTaskDTO, TaskResponseDTO } from "@/core/tasks/application/dtos/task.dto"
import type { TaskRepository } from "@/core/tasks/application/ports/task-repository.port"
import { IdGenerator } from "@/core/shared"


export type CreateTaskDependencies = {
  taskRepository: TaskRepository
  idGenerator: IdGenerator
}

export const createCreateTaskUseCase = (deps: CreateTaskDependencies) => {
  return async (dto: CreateTaskDTO): Promise<TaskResponseDTO> => {
    const task = Task.create(
      {
        title: dto.title,
        description: dto.description,
        status: TaskStatus.TODO,
        priority: dto.priority,
        assigneeId: dto.assigneeId ?? null,
      },
      deps.idGenerator.generate(),
    )

    const savedTask = await deps.taskRepository.create(task)
    const json = savedTask.toJSON()

    return {
      ...json,
      createdAt: json.createdAt.toISOString(),
      updatedAt: json.updatedAt.toISOString(),
    }
  }
}

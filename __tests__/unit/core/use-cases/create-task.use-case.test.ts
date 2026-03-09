import { describe, it, expect, beforeEach } from "@jest/globals"
import { Task, createCreateTaskUseCase } from "@/core/tasks"
import type { TaskRepository } from "@/core/tasks"
import type { IdGenerator } from "@/core/shared"
import { MOCK_CREATE_TASK_DTO } from "@/__tests__/fixtures"

describe("CreateTask Use Case", () => {
  let mockTaskRepository: TaskRepository
  let mockIdGenerator: IdGenerator
  let createTask: ReturnType<typeof createCreateTaskUseCase>

  beforeEach(() => {
    mockTaskRepository = {
      findById: async () => null,
      findAll: async () => [],
      create: async (task: Task) => task,
      update: async (task: Task) => task,
      delete: async () => {},
    }

    mockIdGenerator = {
      generate: () => "generated-id-001",
    }

    createTask = createCreateTaskUseCase({
      taskRepository: mockTaskRepository,
      idGenerator: mockIdGenerator,
    })
  })

  it("should create a task and return a response DTO", async () => {
    const result = await createTask(MOCK_CREATE_TASK_DTO)

    expect(result.id).toBe("generated-id-001")
    expect(result.title).toBe(MOCK_CREATE_TASK_DTO.title)
    expect(result.description).toBe(MOCK_CREATE_TASK_DTO.description)
    expect(result.priority).toBe(MOCK_CREATE_TASK_DTO.priority)
    expect(result.status).toBe("todo")
    expect(result.createdAt).toBeDefined()
  })

  it("should call the repository with a Task entity", async () => {
    let capturedTask: Task | null = null
    mockTaskRepository.create = async (task: Task) => {
      capturedTask = task
      return task
    }

    await createTask(MOCK_CREATE_TASK_DTO)

    expect(capturedTask).not.toBeNull()
    expect(capturedTask!.title).toBe(MOCK_CREATE_TASK_DTO.title)
  })
})

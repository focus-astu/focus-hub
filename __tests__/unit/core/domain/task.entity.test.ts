import { describe, it, expect } from "@jest/globals"
import { Task } from "@/core/tasks"
import { MOCK_TASK_PROPS } from "@/__tests__/fixtures"

describe("Task Entity", () => {
  it("should create a new task with correct defaults", () => {
    const task = Task.create(
      {
        title: MOCK_TASK_PROPS.title,
        description: MOCK_TASK_PROPS.description,
        status: MOCK_TASK_PROPS.status,
        priority: MOCK_TASK_PROPS.priority,
        assigneeId: MOCK_TASK_PROPS.assigneeId,
      },
      "test-id-001",
    )

    expect(task.id).toBe("test-id-001")
    expect(task.title).toBe(MOCK_TASK_PROPS.title)
    expect(task.status).toBe(MOCK_TASK_PROPS.status)
    expect(task.createdAt).toBeInstanceOf(Date)
  })

  it("should reconstitute a task from raw props", () => {
    const task = Task.reconstitute(MOCK_TASK_PROPS)

    expect(task.id).toBe(MOCK_TASK_PROPS.id)
    expect(task.title).toBe(MOCK_TASK_PROPS.title)
    expect(task.createdAt).toEqual(MOCK_TASK_PROPS.createdAt)
  })

  it("should mark a task as completed immutably", () => {
    const task = Task.reconstitute(MOCK_TASK_PROPS)
    const completedTask = task.markAsCompleted()

    expect(completedTask.status).toBe("completed")
    expect(task.status).toBe(MOCK_TASK_PROPS.status)
  })

  it("should assign a task to a user immutably", () => {
    const task = Task.reconstitute(MOCK_TASK_PROPS)
    const reassigned = task.assignTo("user-new")

    expect(reassigned.assigneeId).toBe("user-new")
    expect(task.assigneeId).toBe(MOCK_TASK_PROPS.assigneeId)
  })

  it("should serialize to JSON correctly", () => {
    const task = Task.reconstitute(MOCK_TASK_PROPS)
    const json = task.toJSON()

    expect(json).toEqual(MOCK_TASK_PROPS)
  })
})

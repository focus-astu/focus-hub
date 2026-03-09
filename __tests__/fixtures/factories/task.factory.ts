import type { TaskProps, CreateTaskDTO, TaskResponseDTO } from "@/core/tasks"
import { MOCK_TASK_PROPS, MOCK_CREATE_TASK_DTO, MOCK_TASK_RESPONSE } from "../tasks.fixture"

/**
 * Factory functions for generating test data with overrides.
 * Use these when tests need slight variations of the base fixtures.
 */

let counter = 0

export const buildTaskProps = (overrides?: Partial<TaskProps>): TaskProps => ({
  ...MOCK_TASK_PROPS,
  id: `task-factory-${++counter}`,
  ...overrides,
})

export const buildCreateTaskDTO = (overrides?: Partial<CreateTaskDTO>): CreateTaskDTO => ({
  ...MOCK_CREATE_TASK_DTO,
  ...overrides,
})

export const buildTaskResponseDTO = (overrides?: Partial<TaskResponseDTO>): TaskResponseDTO => ({
  ...MOCK_TASK_RESPONSE,
  id: `task-factory-${++counter}`,
  ...overrides,
})

export const resetFactoryCounter = () => {
  counter = 0
}

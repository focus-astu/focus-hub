import type { CreateTaskDTO } from "@/core/tasks"
import { Priority } from "@/core/tasks"

export type ValidationResult = {
  valid: boolean
  errors: string[]
}

const validPriorities = Object.values(Priority)

export const validateCreateTask = (data: Partial<CreateTaskDTO>): ValidationResult => {
  const errors: string[] = []

  if (!data.title?.trim()) {
    errors.push("Title is required")
  }
  if (data.title && data.title.length > 200) {
    errors.push("Title must be 200 characters or fewer")
  }
  if (!data.description?.trim()) {
    errors.push("Description is required")
  }
  if (!data.priority || !validPriorities.includes(data.priority)) {
    errors.push(`Priority must be one of: ${validPriorities.join(", ")}`)
  }

  return { valid: errors.length === 0, errors }
}

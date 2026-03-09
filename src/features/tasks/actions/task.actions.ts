"use server"

import { createTask, getTasks } from "@/core/shared/infrastructure/config/dependencies"
import type { CreateTaskDTO, TaskFilters } from "@/core/tasks"

export const fetchTasks = async (filters?: TaskFilters) => {
  return getTasks(filters)
}

export const addTask = async (dto: CreateTaskDTO) => {
  return createTask(dto)
}

import { cryptoIdGenerator } from "@/core/shared/infrastructure/adapters/crypto-id-generator"
import {
  createCreateTaskUseCase,
  createGetTasksUseCase,
  createInMemoryTaskRepository,
} from "@/core/tasks"

/**
 * Composition root: wire all feature dependencies here.
 * Swap implementations (e.g., InMemory -> Supabase) without touching use cases.
 *
 * Each feature module provides its own repository factory and use case factories.
 * This file is the only place where infrastructure meets application.
 */

// ─── Shared Infrastructure ───────────────────────────────────
const idGenerator = cryptoIdGenerator

// ─── Tasks Feature ───────────────────────────────────────────
const taskRepository = createInMemoryTaskRepository()

export const createTask = createCreateTaskUseCase({ taskRepository, idGenerator })
export const getTasks = createGetTasksUseCase({ taskRepository })

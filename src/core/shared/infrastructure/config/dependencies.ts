import { cryptoIdGenerator } from "@/core/shared/infrastructure/adapters/crypto-id-generator"
import {
  createCreateTaskUseCase,
  createGetTasksUseCase,
  createInMemoryTaskRepository,
} from "@/core/tasks"
import {
  createApproveUserUseCase,
  createRejectUserUseCase,
  createGetPendingUsersUseCase,
  createMongodbAuthRepository,
} from "@/core/auth"
import { MongoClient } from "mongodb"

// ─── Shared Infrastructure ───────────────────────────────────
const idGenerator = cryptoIdGenerator

// ─── Tasks Feature ───────────────────────────────────────────
const taskRepository = createInMemoryTaskRepository()

export const createTask = createCreateTaskUseCase({ taskRepository, idGenerator })
export const getTasks = createGetTasksUseCase({ taskRepository })

// ─── Auth Feature ────────────────────────────────────────────
const mongoClient = process.env.MONGODB_URI
  ? new MongoClient(process.env.MONGODB_URI)
  : null!
const authRepository = createMongodbAuthRepository(mongoClient)

export const approveUser = createApproveUserUseCase({ authRepository })
export const rejectUser = createRejectUserUseCase({ authRepository })
export const getPendingUsers = createGetPendingUsersUseCase({ authRepository })

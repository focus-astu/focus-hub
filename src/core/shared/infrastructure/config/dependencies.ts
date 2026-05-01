import { cryptoIdGenerator } from "@/core/shared/infrastructure/adapters/crypto-id-generator"
import { createNodemailerEmailService } from "@/core/shared/infrastructure/email/nodemailer-email.service"
import {
  createCreateTaskUseCase,
  createGetTasksUseCase,
  createInMemoryTaskRepository,
} from "@/core/tasks"
import {
  createApproveUserUseCase,
  createRejectUserUseCase,
  createGetPendingUsersUseCase,
  createGetAllUsersUseCase,
  createChangeRoleUseCase,
  createMongodbAuthRepository,
} from "@/core/auth"
import {
  createCreateNotificationUseCase,
  createGetUserNotificationsUseCase,
  createMarkNotificationReadUseCase,
  createMarkAllNotificationsReadUseCase,
  createMongodbNotificationRepository,
} from "@/core/notifications"
import {
  createCreatePostUseCase,
  createGetPostsUseCase,
  createToggleLikeUseCase,
  createDeletePostUseCase,
  createMongodbPostRepository,
  createImageUploadService,
} from "@/core/posts"
import { getSupabaseClient } from "@/core/shared/infrastructure/supabase/supabase-client"
import { MongoClient } from "mongodb"

// ─── Shared Infrastructure ───────────────────────────────────
const idGenerator = cryptoIdGenerator
export const emailService = createNodemailerEmailService()

// ─── Tasks Feature ───────────────────────────────────────────
const taskRepository = createInMemoryTaskRepository()

export const createTask = createCreateTaskUseCase({ taskRepository, idGenerator })
export const getTasks = createGetTasksUseCase({ taskRepository })

// ─── MongoDB Client ──────────────────────────────────────────
const mongoClient = process.env.MONGODB_URI
  ? new MongoClient(process.env.MONGODB_URI)
  : null!

// ─── Notifications Feature ───────────────────────────────────
const notificationRepository = createMongodbNotificationRepository(mongoClient)

export const createNotification = createCreateNotificationUseCase({ notificationRepository })
export const getUserNotifications = createGetUserNotificationsUseCase({ notificationRepository })
export const markNotificationRead = createMarkNotificationReadUseCase({ notificationRepository })
export const markAllNotificationsRead = createMarkAllNotificationsReadUseCase({ notificationRepository })

export const getUnreadNotificationCount = async (userId: string) => {
  return notificationRepository.getUnreadCount(userId)
}

// ─── Auth Feature ────────────────────────────────────────────
const authRepository = createMongodbAuthRepository(mongoClient)

export const approveUser = createApproveUserUseCase({ authRepository, emailService })
export const rejectUser = createRejectUserUseCase({ authRepository })
export const getPendingUsers = createGetPendingUsersUseCase({ authRepository })
export const getAllUsers = createGetAllUsersUseCase({ authRepository })
export const changeRole = createChangeRoleUseCase({
  authRepository,
  notificationRepository,
  mongoClient,
})

// ─── Posts Feature ────────────────────────────────────────────
const postRepository = createMongodbPostRepository(mongoClient)
const supabaseClient = getSupabaseClient()
const imageUploadService = createImageUploadService(supabaseClient)

export const createPost = createCreatePostUseCase({ postRepository, imageUploadService })
export const getPosts = createGetPostsUseCase({ postRepository })
export const toggleLike = createToggleLikeUseCase({ postRepository })
export const deletePost = createDeletePostUseCase({ postRepository, imageUploadService })

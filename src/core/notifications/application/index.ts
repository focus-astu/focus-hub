export type {
  CreateNotificationDTO,
  NotificationResponseDTO,
} from "./dtos/notification.dto"

export type { NotificationRepository } from "./ports/notification-repository.port"

export { createCreateNotificationUseCase } from "./use-cases/create-notification.use-case"
export type { CreateNotificationDependencies } from "./use-cases/create-notification.use-case"

export { createGetUserNotificationsUseCase } from "./use-cases/get-user-notifications.use-case"
export type { GetUserNotificationsDependencies, GetUserNotificationsOptions } from "./use-cases/get-user-notifications.use-case"

export { createMarkNotificationReadUseCase, createMarkAllNotificationsReadUseCase } from "./use-cases/mark-notification-read.use-case"
export type { MarkNotificationReadDependencies } from "./use-cases/mark-notification-read.use-case"

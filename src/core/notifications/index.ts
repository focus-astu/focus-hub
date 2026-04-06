export { NotificationType } from "./domain"
export type { Notification } from "./domain"

export type {
  CreateNotificationDTO,
  NotificationResponseDTO,
  NotificationRepository,
  CreateNotificationDependencies,
  GetUserNotificationsDependencies,
  GetUserNotificationsOptions,
  MarkNotificationReadDependencies,
} from "./application"

export {
  createCreateNotificationUseCase,
  createGetUserNotificationsUseCase,
  createMarkNotificationReadUseCase,
  createMarkAllNotificationsReadUseCase,
} from "./application"

export { createMongodbNotificationRepository } from "./infrastructure/repositories/mongodb-notification.repository"

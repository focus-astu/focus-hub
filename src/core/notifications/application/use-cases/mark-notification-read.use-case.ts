import type { NotificationRepository } from "@/core/notifications/application/ports/notification-repository.port"

export type MarkNotificationReadDependencies = {
  notificationRepository: NotificationRepository
}

export const createMarkNotificationReadUseCase = (deps: MarkNotificationReadDependencies) => {
  return async (notificationId: string): Promise<void> => {
    return deps.notificationRepository.markAsRead(notificationId)
  }
}

export const createMarkAllNotificationsReadUseCase = (deps: MarkNotificationReadDependencies) => {
  return async (userId: string): Promise<void> => {
    return deps.notificationRepository.markAllAsRead(userId)
  }
}

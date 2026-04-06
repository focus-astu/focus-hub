import type { NotificationRepository } from "@/core/notifications/application/ports/notification-repository.port"
import type { NotificationResponseDTO } from "@/core/notifications/application/dtos/notification.dto"

export type GetUserNotificationsDependencies = {
  notificationRepository: NotificationRepository
}

export type GetUserNotificationsOptions = {
  userId: string
  unreadOnly?: boolean
  limit?: number
}

export const createGetUserNotificationsUseCase = (deps: GetUserNotificationsDependencies) => {
  return async (options: GetUserNotificationsOptions): Promise<NotificationResponseDTO[]> => {
    return deps.notificationRepository.getByUserId(options.userId, {
      unreadOnly: options.unreadOnly,
      limit: options.limit ?? 20,
    })
  }
}

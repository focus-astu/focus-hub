import type { CreateNotificationDTO, NotificationResponseDTO } from "@/core/notifications/application/dtos/notification.dto"

export type NotificationRepository = {
  create: (dto: CreateNotificationDTO) => Promise<NotificationResponseDTO>
  getByUserId: (userId: string, options?: { unreadOnly?: boolean, limit?: number }) => Promise<NotificationResponseDTO[]>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: (userId: string) => Promise<void>
  getUnreadCount: (userId: string) => Promise<number>
}

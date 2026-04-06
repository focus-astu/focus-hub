import type { NotificationType } from "@/core/notifications/domain"

export type CreateNotificationDTO = {
  userId: string
  type: NotificationType
  title: string
  message: string
  metadata?: Record<string, unknown>
}

export type NotificationResponseDTO = {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  metadata: Record<string, unknown>
  read: boolean
  createdAt: string
}

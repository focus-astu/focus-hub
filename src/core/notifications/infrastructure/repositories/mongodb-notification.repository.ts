import type { NotificationRepository } from "@/core/notifications/application/ports/notification-repository.port"
import type { CreateNotificationDTO, NotificationResponseDTO } from "@/core/notifications/application/dtos/notification.dto"
import type { NotificationType } from "@/core/notifications/domain"
import { MongoClient, ObjectId } from "mongodb"

export const createMongodbNotificationRepository = (client: MongoClient): NotificationRepository => {
  const db = client.db()
  const notifications = db.collection("notification")

  notifications.createIndex({ userId: 1, createdAt: -1 }).catch(() => {})
  notifications.createIndex({ userId: 1, read: 1 }).catch(() => {})

  const toDTO = (doc: Record<string, unknown>): NotificationResponseDTO => ({
    id: (doc._id as ObjectId).toString(),
    userId: doc.userId as string,
    type: doc.type as NotificationType,
    title: doc.title as string,
    message: doc.message as string,
    metadata: (doc.metadata as Record<string, unknown>) ?? {},
    read: doc.read as boolean,
    createdAt: (doc.createdAt as Date)?.toISOString() ?? new Date().toISOString(),
  })

  return {
    create: async (dto: CreateNotificationDTO): Promise<NotificationResponseDTO> => {
      const now = new Date()
      const doc = {
        userId: dto.userId,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        metadata: dto.metadata ?? {},
        read: false,
        createdAt: now,
      }

      const result = await notifications.insertOne(doc)
      return toDTO({ ...doc, _id: result.insertedId })
    },

    getByUserId: async (userId, options) => {
      const filter: Record<string, unknown> = { userId }
      if (options?.unreadOnly) {
        filter.read = false
      }

      const docs = await notifications
        .find(filter)
        .sort({ createdAt: -1 })
        .limit(options?.limit ?? 20)
        .toArray()

      return docs.map(toDTO)
    },

    markAsRead: async (notificationId) => {
      await notifications.updateOne(
        { _id: new ObjectId(notificationId) },
        { $set: { read: true } },
      )
    },

    markAllAsRead: async (userId) => {
      await notifications.updateMany(
        { userId, read: false },
        { $set: { read: true } },
      )
    },

    getUnreadCount: async (userId) => {
      return notifications.countDocuments({ userId, read: false })
    },
  }
}

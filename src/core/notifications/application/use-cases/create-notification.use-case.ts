import type { NotificationRepository } from "@/core/notifications/application/ports/notification-repository.port"
import type { CreateNotificationDTO, NotificationResponseDTO } from "@/core/notifications/application/dtos/notification.dto"

export type CreateNotificationDependencies = {
  notificationRepository: NotificationRepository
}

export const createCreateNotificationUseCase = (deps: CreateNotificationDependencies) => {
  return async (dto: CreateNotificationDTO): Promise<NotificationResponseDTO> => {
    return deps.notificationRepository.create(dto)
  }
}

import type { UpdateRepository } from "@/core/updates/application/ports/update-repository.port"
import type { CreateUpdateDTO, UpdateResponseDTO } from "@/core/updates/application/dtos/update.dto"
import type { ImageUploadService } from "@/core/posts/infrastructure/services/image-upload.service"
import { UpdateStatus } from "@/core/updates/domain"
import { ValidationError } from "@/core/shared"

export type CreateUpdateDependencies = {
  updateRepository: UpdateRepository
  imageUploadService: ImageUploadService
}

export const createCreateUpdateUseCase = (deps: CreateUpdateDependencies) => {
  return async (dto: CreateUpdateDTO): Promise<UpdateResponseDTO> => {
    if (!dto.title.trim()) {
      throw new ValidationError("Update title cannot be empty")
    }
    if (!dto.description.trim()) {
      throw new ValidationError("Update description cannot be empty")
    }

    let imageUrl: string | null = null
    if (dto.imageBase64) {
      imageUrl = await deps.imageUploadService.upload(dto.imageBase64)
    }

    const now = new Date().toISOString()
    const update = await deps.updateRepository.create({
      id: crypto.randomUUID(),
      authorId: dto.authorId,
      authorName: dto.authorName,
      title: dto.title.trim(),
      description: dto.description.trim(),
      category: dto.category,
      imageUrl,
      status: UpdateStatus.PUBLISHED,
      createdAt: now,
      updatedAt: now,
    })

    return {
      id: update.id,
      authorId: update.authorId,
      authorName: update.authorName,
      title: update.title,
      description: update.description,
      category: update.category,
      imageUrl: update.imageUrl,
      status: update.status,
      createdAt: update.createdAt,
      updatedAt: update.updatedAt,
    }
  }
}

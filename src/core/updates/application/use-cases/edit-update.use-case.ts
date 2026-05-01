import type { UpdateRepository } from "@/core/updates/application/ports/update-repository.port"
import type { EditUpdateDTO, UpdateResponseDTO } from "@/core/updates/application/dtos/update.dto"
import type { ImageUploadService } from "@/core/posts/infrastructure/services/image-upload.service"
import { EntityNotFoundError } from "@/core/shared"

export type EditUpdateDependencies = {
  updateRepository: UpdateRepository
  imageUploadService: ImageUploadService
}

export const createEditUpdateUseCase = (deps: EditUpdateDependencies) => {
  return async (dto: EditUpdateDTO): Promise<UpdateResponseDTO> => {
    const existing = await deps.updateRepository.getById(dto.id)
    if (!existing) throw new EntityNotFoundError("Update", dto.id)

    let imageUrl = existing.imageUrl

    if (dto.removeImage && existing.imageUrl) {
      await deps.imageUploadService.delete(existing.imageUrl)
      imageUrl = null
    } else if (dto.imageBase64) {
      if (existing.imageUrl) {
        await deps.imageUploadService.delete(existing.imageUrl)
      }
      imageUrl = await deps.imageUploadService.upload(dto.imageBase64)
    }

    const fields = {
      ...(dto.title !== undefined && { title: dto.title.trim() }),
      ...(dto.description !== undefined && { description: dto.description.trim() }),
      ...(dto.category !== undefined && { category: dto.category }),
      imageUrl,
      updatedAt: new Date().toISOString(),
    }

    const updated = await deps.updateRepository.update(dto.id, fields)
    if (!updated) throw new EntityNotFoundError("Update", dto.id)

    return {
      id: updated.id,
      authorId: updated.authorId,
      authorName: updated.authorName,
      title: updated.title,
      description: updated.description,
      category: updated.category,
      imageUrl: updated.imageUrl,
      status: updated.status,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    }
  }
}

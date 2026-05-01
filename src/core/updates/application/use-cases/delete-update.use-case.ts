import type { UpdateRepository } from "@/core/updates/application/ports/update-repository.port"
import type { DeleteUpdateDTO } from "@/core/updates/application/dtos/update.dto"
import type { ImageUploadService } from "@/core/posts/infrastructure/services/image-upload.service"
import { EntityNotFoundError } from "@/core/shared"

export type DeleteUpdateDependencies = {
  updateRepository: UpdateRepository
  imageUploadService: ImageUploadService
}

export const createDeleteUpdateUseCase = (deps: DeleteUpdateDependencies) => {
  return async (dto: DeleteUpdateDTO): Promise<void> => {
    const update = await deps.updateRepository.getById(dto.updateId)
    if (!update) throw new EntityNotFoundError("Update", dto.updateId)

    if (update.imageUrl) {
      await deps.imageUploadService.delete(update.imageUrl)
    }

    await deps.updateRepository.delete(dto.updateId)
  }
}

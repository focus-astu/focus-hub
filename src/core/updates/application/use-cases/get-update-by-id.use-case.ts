import type { UpdateRepository } from "@/core/updates/application/ports/update-repository.port"
import type { UpdateResponseDTO } from "@/core/updates/application/dtos/update.dto"
import { EntityNotFoundError } from "@/core/shared"

export type GetUpdateByIdDependencies = {
  updateRepository: UpdateRepository
}

export const createGetUpdateByIdUseCase = (deps: GetUpdateByIdDependencies) => {
  return async (id: string): Promise<UpdateResponseDTO> => {
    const update = await deps.updateRepository.getById(id)
    if (!update) throw new EntityNotFoundError("Update", id)

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

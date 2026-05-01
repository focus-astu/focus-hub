import type { UpdateRepository } from "@/core/updates/application/ports/update-repository.port"
import type { UpdateResponseDTO } from "@/core/updates/application/dtos/update.dto"

export type GetUpdatesDependencies = {
  updateRepository: UpdateRepository
}

export const createGetUpdatesUseCase = (deps: GetUpdatesDependencies) => {
  return async (options?: { page?: number, limit?: number }): Promise<{ updates: UpdateResponseDTO[], total: number }> => {
    const page = options?.page ?? 1
    const limit = options?.limit ?? 20

    const { updates, total } = await deps.updateRepository.getAll({ page, limit })

    return {
      updates: updates.map((u) => ({
        id: u.id,
        authorId: u.authorId,
        authorName: u.authorName,
        title: u.title,
        description: u.description,
        category: u.category,
        imageUrl: u.imageUrl,
        status: u.status,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
      total,
    }
  }
}

import type { PostRepository } from "@/core/posts/application/ports/post-repository.port"
import type { DeletePostDTO } from "@/core/posts/application/dtos/post.dto"
import type { ImageUploadService } from "@/core/posts/infrastructure/services/image-upload.service"
import { EntityNotFoundError, DomainError } from "@/core/shared"

export type DeletePostDependencies = {
  postRepository: PostRepository
  imageUploadService: ImageUploadService
}

export const createDeletePostUseCase = (deps: DeletePostDependencies) => {
  return async (dto: DeletePostDTO): Promise<void> => {
    const post = await deps.postRepository.getById(dto.postId)
    if (!post) throw new EntityNotFoundError("Post", dto.postId)

    if (post.authorId !== dto.requesterId && !dto.isAdmin) {
      throw new DomainError("Only the author or an admin can delete this post", "FORBIDDEN")
    }

    if (post.imageUrl) {
      await deps.imageUploadService.delete(post.imageUrl)
    }

    await deps.postRepository.delete(dto.postId)
  }
}

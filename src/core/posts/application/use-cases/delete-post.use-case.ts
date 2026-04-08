import type { PostRepository } from "@/core/posts/application/ports/post-repository.port"
import type { DeletePostDTO } from "@/core/posts/application/dtos/post.dto"
import { EntityNotFoundError, DomainError } from "@/core/shared"

export type DeletePostDependencies = {
  postRepository: PostRepository
}

export const createDeletePostUseCase = (deps: DeletePostDependencies) => {
  return async (dto: DeletePostDTO): Promise<void> => {
    const post = await deps.postRepository.getById(dto.postId)
    if (!post) throw new EntityNotFoundError("Post", dto.postId)

    if (post.authorId !== dto.requesterId && !dto.isAdmin) {
      throw new DomainError("Only the author or an admin can delete this post", "FORBIDDEN")
    }

    await deps.postRepository.delete(dto.postId)
  }
}

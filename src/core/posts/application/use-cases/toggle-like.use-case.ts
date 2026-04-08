import type { PostRepository } from "@/core/posts/application/ports/post-repository.port"
import type { ToggleLikeDTO } from "@/core/posts/application/dtos/post.dto"
import { EntityNotFoundError } from "@/core/shared"

export type ToggleLikeDependencies = {
  postRepository: PostRepository
}

export const createToggleLikeUseCase = (deps: ToggleLikeDependencies) => {
  return async (dto: ToggleLikeDTO): Promise<{ liked: boolean }> => {
    const post = await deps.postRepository.getById(dto.postId)
    if (!post) throw new EntityNotFoundError("Post", dto.postId)

    const alreadyLiked = post.likedBy.includes(dto.userId)

    if (alreadyLiked) {
      await deps.postRepository.removeLike(dto.postId, dto.userId)
      return { liked: false }
    }

    await deps.postRepository.addLike(dto.postId, dto.userId)
    return { liked: true }
  }
}

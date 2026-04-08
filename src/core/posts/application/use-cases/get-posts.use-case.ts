import type { PostRepository } from "@/core/posts/application/ports/post-repository.port"
import type { GetPostsDTO, PostResponseDTO } from "@/core/posts/application/dtos/post.dto"

export type GetPostsDependencies = {
  postRepository: PostRepository
}

export const createGetPostsUseCase = (deps: GetPostsDependencies) => {
  return async (dto: GetPostsDTO): Promise<{ posts: PostResponseDTO[], total: number }> => {
    const page = dto.page ?? 1
    const limit = dto.limit ?? 20

    const { posts, total } = await deps.postRepository.getAll({ page, limit })

    return {
      posts: posts.map((post) => ({
        id: post.id,
        authorId: post.authorId,
        authorName: post.authorName,
        title: post.title,
        content: post.content,
        contentType: post.contentType,
        imageUrl: post.imageUrl,
        status: post.status,
        likeCount: post.likeCount,
        likedByCurrentUser: post.likedBy.includes(dto.currentUserId),
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })),
      total,
    }
  }
}

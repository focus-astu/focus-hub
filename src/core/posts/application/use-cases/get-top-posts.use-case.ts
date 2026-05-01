import type { PostRepository } from "@/core/posts/application/ports/post-repository.port"
import type { PostResponseDTO } from "@/core/posts/application/dtos/post.dto"

export type GetTopPostsDependencies = {
  postRepository: PostRepository
}

export const createGetTopPostsUseCase = (deps: GetTopPostsDependencies) => {
  return async (limit = 3): Promise<PostResponseDTO[]> => {
    const { posts } = await deps.postRepository.getAll({ page: 1, limit })

    return posts.map((post) => ({
      id: post.id,
      authorId: post.authorId,
      authorName: post.authorName,
      title: post.title,
      content: post.content,
      contentType: post.contentType,
      imageUrl: post.imageUrl,
      status: post.status,
      likeCount: post.likeCount,
      likedByCurrentUser: false,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }))
  }
}

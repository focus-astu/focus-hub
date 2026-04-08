import type { PostRepository } from "@/core/posts/application/ports/post-repository.port"
import type { CreatePostDTO, PostResponseDTO } from "@/core/posts/application/dtos/post.dto"
import type { ImageUploadService } from "@/core/posts/infrastructure/services/image-upload.service"
import { ContentType, PostStatus } from "@/core/posts/domain"
import { ValidationError } from "@/core/shared"

export type CreatePostDependencies = {
  postRepository: PostRepository
  imageUploadService: ImageUploadService
}

export const createCreatePostUseCase = (deps: CreatePostDependencies) => {
  return async (dto: CreatePostDTO): Promise<PostResponseDTO> => {
    if (!dto.content.trim()) {
      throw new ValidationError("Post content cannot be empty")
    }

    let imageUrl: string | null = null
    let contentType: ContentType = ContentType.TEXT

    if (dto.imageBase64) {
      imageUrl = await deps.imageUploadService.upload(dto.imageBase64)
      contentType = ContentType.IMAGE
    }

    const now = new Date().toISOString()
    const post = await deps.postRepository.create({
      id: crypto.randomUUID(),
      authorId: dto.authorId,
      authorName: dto.authorName,
      title: dto.title ?? null,
      content: dto.content,
      contentType,
      imageUrl,
      status: PostStatus.PUBLISHED,
      likeCount: 0,
      likedBy: [],
      createdAt: now,
      updatedAt: now,
    })

    return {
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
    }
  }
}

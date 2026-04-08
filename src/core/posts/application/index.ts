export type {
  CreatePostDTO,
  PostResponseDTO,
  ToggleLikeDTO,
  GetPostsDTO,
  DeletePostDTO,
} from "./dtos/post.dto"

export type { PostRepository } from "./ports/post-repository.port"

export { createCreatePostUseCase } from "./use-cases/create-post.use-case"
export type { CreatePostDependencies } from "./use-cases/create-post.use-case"

export { createGetPostsUseCase } from "./use-cases/get-posts.use-case"
export type { GetPostsDependencies } from "./use-cases/get-posts.use-case"

export { createToggleLikeUseCase } from "./use-cases/toggle-like.use-case"
export type { ToggleLikeDependencies } from "./use-cases/toggle-like.use-case"

export { createDeletePostUseCase } from "./use-cases/delete-post.use-case"
export type { DeletePostDependencies } from "./use-cases/delete-post.use-case"

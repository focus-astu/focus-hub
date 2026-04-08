import type { PostRepository } from "@/core/posts/application/ports/post-repository.port"
import type { Post } from "@/core/posts/domain"
import { PostStatus } from "@/core/posts/domain"
import { MongoClient } from "mongodb"

export const createMongodbPostRepository = (client: MongoClient): PostRepository => {
  const db = client.db()
  const posts = db.collection("posts")

  const toPost = (doc: Record<string, unknown>): Post => ({
    id: doc.id as string,
    authorId: doc.authorId as string,
    authorName: doc.authorName as string,
    title: (doc.title as string) ?? null,
    content: doc.content as string,
    contentType: doc.contentType as Post["contentType"],
    imageUrl: (doc.imageUrl as string) ?? null,
    status: (doc.status as Post["status"]) ?? PostStatus.PUBLISHED,
    likeCount: (doc.likeCount as number) ?? 0,
    likedBy: (doc.likedBy as string[]) ?? [],
    createdAt: doc.createdAt as string,
    updatedAt: doc.updatedAt as string,
  })

  return {
    create: async (post: Post): Promise<Post> => {
      await posts.insertOne({ ...post })
      return post
    },

    getById: async (id: string): Promise<Post | null> => {
      const doc = await posts.findOne({ id })
      return doc ? toPost(doc as unknown as Record<string, unknown>) : null
    },

    getAll: async ({ page, limit }: { page: number, limit: number }) => {
      const skip = (page - 1) * limit
      const [docs, total] = await Promise.all([
        posts
          .find({ status: PostStatus.PUBLISHED })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .toArray(),
        posts.countDocuments({ status: PostStatus.PUBLISHED }),
      ])
      return {
        posts: docs.map((d) => toPost(d as unknown as Record<string, unknown>)),
        total,
      }
    },

    delete: async (id: string): Promise<void> => {
      await posts.deleteOne({ id })
    },

    addLike: async (postId: string, userId: string): Promise<void> => {
      await posts.updateOne(
        { id: postId },
        { $addToSet: { likedBy: userId }, $inc: { likeCount: 1 } },
      )
    },

    removeLike: async (postId: string, userId: string): Promise<void> => {
      await posts.updateOne(
        { id: postId },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { $pull: { likedBy: userId } as any, $inc: { likeCount: -1 } },
      )
    },
  }
}

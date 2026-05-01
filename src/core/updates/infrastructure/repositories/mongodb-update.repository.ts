import type { UpdateRepository } from "@/core/updates/application/ports/update-repository.port"
import type { Update } from "@/core/updates/domain"
import { UpdateStatus } from "@/core/updates/domain"
import { MongoClient } from "mongodb"

export const createMongodbUpdateRepository = (client: MongoClient): UpdateRepository => {
  const db = client.db()
  const updates = db.collection("updates")

  const toUpdate = (doc: Record<string, unknown>): Update => ({
    id: doc.id as string,
    authorId: doc.authorId as string,
    authorName: doc.authorName as string,
    title: doc.title as string,
    description: doc.description as string,
    category: doc.category as Update["category"],
    imageUrl: (doc.imageUrl as string) ?? null,
    status: (doc.status as Update["status"]) ?? UpdateStatus.PUBLISHED,
    createdAt: doc.createdAt as string,
    updatedAt: doc.updatedAt as string,
  })

  return {
    create: async (update: Update): Promise<Update> => {
      await updates.insertOne({ ...update })
      return update
    },

    getById: async (id: string): Promise<Update | null> => {
      const doc = await updates.findOne({ id })
      return doc ? toUpdate(doc as unknown as Record<string, unknown>) : null
    },

    getAll: async ({ page, limit }: { page: number, limit: number }) => {
      const skip = (page - 1) * limit
      const [docs, total] = await Promise.all([
        updates
          .find({ status: UpdateStatus.PUBLISHED })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .toArray(),
        updates.countDocuments({ status: UpdateStatus.PUBLISHED }),
      ])
      return {
        updates: docs.map((d) => toUpdate(d as unknown as Record<string, unknown>)),
        total,
      }
    },

    update: async (id: string, fields: Partial<Update>): Promise<Update | null> => {
      const result = await updates.findOneAndUpdate(
        { id },
        { $set: fields },
        { returnDocument: "after" },
      )
      return result ? toUpdate(result as unknown as Record<string, unknown>) : null
    },

    delete: async (id: string): Promise<void> => {
      await updates.deleteOne({ id })
    },
  }
}

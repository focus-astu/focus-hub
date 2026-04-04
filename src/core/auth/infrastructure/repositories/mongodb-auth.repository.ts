import type { AuthRepository } from "@/core/auth/application/ports/auth-repository.port"
import type { PendingUserResponseDTO } from "@/core/auth/application/dtos/auth.dto"
import { UserStatus } from "@/core/auth/domain"
import { MongoClient } from "mongodb"

export const createMongodbAuthRepository = (client: MongoClient): AuthRepository => {
  const db = client.db()
  const users = db.collection("user")

  return {
    getPendingUsers: async (): Promise<PendingUserResponseDTO[]> => {
      const pending = await users
        .find({ approved: { $ne: true }, emailVerified: true })
        .sort({ createdAt: -1 })
        .toArray()

      return pending.map((user) => ({
        id: user._id as unknown as string,
        name: user.name as string,
        email: user.email as string,
        universityId: user.universityId as string,
        year: user.year as number,
        department: (user.department as string) ?? null,
        emailVerified: true,
        status: UserStatus.EMAIL_VERIFIED,
        createdAt: (user.createdAt as Date)?.toISOString() ?? new Date().toISOString(),
      }))
    },

    approveUser: async (userId: string): Promise<void> => {
      await users.updateOne(
        { _id: userId as unknown as import("mongodb").ObjectId },
        { $set: { approved: true } },
      )
    },

    rejectUser: async (userId: string, reason?: string): Promise<void> => {
      await users.updateOne(
        { _id: userId as unknown as import("mongodb").ObjectId },
        { $set: { approved: false, rejectionReason: reason ?? null } },
      )
    },

    isUserApproved: async (userId: string): Promise<boolean> => {
      const user = await users.findOne({
        _id: userId as unknown as import("mongodb").ObjectId,
      })
      return user?.approved === true
    },

    getUserById: async (userId: string): Promise<PendingUserResponseDTO | null> => {
      const user = await users.findOne({
        _id: userId as unknown as import("mongodb").ObjectId,
      })
      if (!user) return null

      return {
        id: user._id as unknown as string,
        name: user.name as string,
        email: user.email as string,
        universityId: user.universityId as string,
        year: user.year as number,
        department: (user.department as string) ?? null,
        emailVerified: user.emailVerified as boolean,
        status: user.approved
          ? UserStatus.APPROVED
          : user.emailVerified
            ? UserStatus.EMAIL_VERIFIED
            : UserStatus.PENDING,
        createdAt: (user.createdAt as Date)?.toISOString() ?? new Date().toISOString(),
      }
    },
  }
}

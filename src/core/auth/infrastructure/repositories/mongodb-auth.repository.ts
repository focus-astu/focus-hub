import type { AuthRepository } from "@/core/auth/application/ports/auth-repository.port"
import type { PendingUserResponseDTO, AllUsersResponseDTO, UserRoleInfo } from "@/core/auth/application/dtos/auth.dto"
import { UserStatus } from "@/core/auth/domain"
import { MongoClient, ObjectId } from "mongodb"

export const createMongodbAuthRepository = (client: MongoClient): AuthRepository => {
  const db = client.db()
  const users = db.collection("user")
  const members = db.collection("member")
  const organizations = db.collection("organization")

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

    getAllApprovedUsers: async (): Promise<AllUsersResponseDTO[]> => {
      const approvedUsers = await users
        .find({ approved: true })
        .sort({ createdAt: -1 })
        .toArray()

      const allOrgs = await organizations.find().toArray()
      const orgMap = new Map(allOrgs.map((o) => [o.id as string, o.name as string]))

      const allMembers = await members.find().toArray()
      const membersByUser = new Map<string, Array<{ role: string, organizationId: string, organizationName: string, memberRole: string }>>()

      for (const m of allMembers) {
        const userId = m.userId as string
        if (!membersByUser.has(userId)) membersByUser.set(userId, [])
        membersByUser.get(userId)!.push({
          role: m.role as string,
          organizationId: m.organizationId as string,
          organizationName: orgMap.get(m.organizationId as string) ?? "Unknown",
          memberRole: m.role as string,
        })
      }

      return approvedUsers.map((user) => {
        const userId = (user._id as unknown as { toString: () => string }).toString()
        const userMembers = membersByUser.get(userId) ?? []

        const orgRoles: UserRoleInfo[] = userMembers.map((m) => ({
          role: m.role,
          organizationId: m.organizationId,
          organizationName: m.organizationName,
        }))

        const isSuper = userMembers.some((m) => m.memberRole === "owner")

        return {
          id: userId,
          name: user.name as string,
          email: user.email as string,
          universityId: user.universityId as string,
          year: user.year as number,
          department: (user.department as string) ?? null,
          role: (user.role as string) ?? "user",
          organizationRoles: orgRoles,
          isSuper,
          createdAt: (user.createdAt as Date)?.toISOString() ?? new Date().toISOString(),
        }
      })
    },

    approveUser: async (userId: string): Promise<void> => {
      await users.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { approved: true } },
      )
    },

    rejectUser: async (userId: string, reason?: string): Promise<void> => {
      await users.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { approved: false, rejectionReason: reason ?? null } },
      )
    },

    isUserApproved: async (userId: string): Promise<boolean> => {
      const user = await users.findOne({
        _id: new ObjectId(userId),
      })
      return user?.approved === true
    },

    getUserById: async (userId: string): Promise<PendingUserResponseDTO | null> => {
      const user = await users.findOne({
        _id: new ObjectId(userId),
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

    isOwnerOfOrg: async (userId: string, orgSlug: string): Promise<boolean> => {
      const org = await organizations.findOne({ slug: orgSlug })
      if (!org) return false
      const membership = await members.findOne({
        organizationId: org.id as string,
        userId,
        role: "owner",
      })
      return !!membership
    },
  }
}

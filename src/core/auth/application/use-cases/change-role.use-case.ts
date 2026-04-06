import type { AuthRepository } from "@/core/auth/application/ports/auth-repository.port"
import type { ChangeRoleDTO } from "@/core/auth/application/dtos/auth.dto"
import type { NotificationRepository } from "@/core/notifications/application/ports/notification-repository.port"
import { ROLE_TO_ORG_SLUG, ROLE_DISPLAY_NAMES } from "@/core/auth/domain/role-mapping"
import { NotificationType } from "@/core/notifications/domain"
import { DomainError } from "@/core/shared"
import { MongoClient } from "mongodb"

export class SuperAdminDemotionError extends DomainError {
  constructor() {
    super("Cannot demote the super admin", "SUPER_ADMIN_DEMOTION")
    this.name = "SuperAdminDemotionError"
  }
}

export class OrgNotFoundError extends DomainError {
  constructor(slug: string) {
    super(`Organization with slug "${slug}" not found`, "ORG_NOT_FOUND")
    this.name = "OrgNotFoundError"
  }
}

export type ChangeRoleDependencies = {
  authRepository: AuthRepository
  notificationRepository: NotificationRepository
  mongoClient: MongoClient
}

export const createChangeRoleUseCase = (deps: ChangeRoleDependencies) => {
  return async (dto: ChangeRoleDTO): Promise<void> => {
    const { userId, role, action, adminId } = dto
    const orgSlug = ROLE_TO_ORG_SLUG[role]
    if (!orgSlug) throw new DomainError(`Invalid role: ${role}`, "INVALID_ROLE")

    const db = deps.mongoClient.db()
    const orgDoc = await db.collection("organization").findOne({ slug: orgSlug })
    if (!orgDoc) throw new OrgNotFoundError(orgSlug)

    const orgId = orgDoc.id as string
    const displayRole = ROLE_DISPLAY_NAMES[role] ?? role

    if (action === "remove") {
      const isOwner = await deps.authRepository.isOwnerOfOrg(userId, orgSlug)
      if (isOwner) throw new SuperAdminDemotionError()

      await db.collection("member").deleteOne({ organizationId: orgId, userId })

      if (role === "admin") {
        await db.collection("user").updateOne(
          { _id: userId as unknown as import("mongodb").ObjectId },
          { $set: { role: "user" } },
        )
      }

      await deps.notificationRepository.create({
        userId,
        type: NotificationType.ROLE_REMOVED,
        title: "Role Removed",
        message: `Your ${displayRole} role has been removed by an administrator.`,
        metadata: { role, orgSlug, adminId },
      })
      return
    }

    const existingMember = await db.collection("member").findOne({ organizationId: orgId, userId })
    if (existingMember) return

    const memberId = crypto.randomUUID()
    await db.collection("member").insertOne({
      id: memberId,
      organizationId: orgId,
      userId,
      role,
      createdAt: new Date(),
    })

    if (role === "admin") {
      await db.collection("user").updateOne(
        { _id: userId as unknown as import("mongodb").ObjectId },
        { $set: { role: "admin" } },
      )
    }

    await deps.notificationRepository.create({
      userId,
      type: NotificationType.ROLE_ASSIGNED,
      title: "New Role Assigned",
      message: `You have been assigned the ${displayRole} role.`,
      metadata: { role, orgSlug, adminId },
    })
  }
}

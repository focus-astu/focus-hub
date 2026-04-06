export const NotificationType = {
  ROLE_ASSIGNED: "role_assigned",
  ROLE_REMOVED: "role_removed",
  ACCOUNT_APPROVED: "account_approved",
  GENERAL: "general",
} as const

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]

export type Notification = {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  metadata: Record<string, unknown>
  read: boolean
  createdAt: string
}

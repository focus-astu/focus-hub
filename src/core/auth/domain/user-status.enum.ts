export const UserStatus = {
  PENDING: "pending",
  EMAIL_VERIFIED: "email_verified",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]

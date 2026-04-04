import { DomainError } from "@/core/shared"

export class EmailNotVerifiedError extends DomainError {
  constructor(userId: string) {
    super(
      `User "${userId}" has not verified their email address`,
      "EMAIL_NOT_VERIFIED",
    )
    this.name = "EmailNotVerifiedError"
  }
}

export class UserNotApprovedError extends DomainError {
  constructor(userId: string) {
    super(
      `User "${userId}" has not been approved by an administrator`,
      "USER_NOT_APPROVED",
    )
    this.name = "UserNotApprovedError"
  }
}

export class UserAlreadyApprovedError extends DomainError {
  constructor(userId: string) {
    super(
      `User "${userId}" is already approved`,
      "USER_ALREADY_APPROVED",
    )
    this.name = "UserAlreadyApprovedError"
  }
}

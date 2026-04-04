import { describe, it, expect } from "@jest/globals"
import {
  EmailNotVerifiedError,
  UserNotApprovedError,
  UserAlreadyApprovedError,
} from "@/core/auth"
import { DomainError } from "@/core/shared"

describe("Auth Domain Errors", () => {
  describe("EmailNotVerifiedError", () => {
    it("should extend DomainError", () => {
      const error = new EmailNotVerifiedError("user-001")
      expect(error).toBeInstanceOf(DomainError)
      expect(error).toBeInstanceOf(Error)
    })

    it("should have correct code and message", () => {
      const error = new EmailNotVerifiedError("user-001")
      expect(error.code).toBe("EMAIL_NOT_VERIFIED")
      expect(error.message).toContain("user-001")
      expect(error.name).toBe("EmailNotVerifiedError")
    })
  })

  describe("UserNotApprovedError", () => {
    it("should extend DomainError", () => {
      const error = new UserNotApprovedError("user-001")
      expect(error).toBeInstanceOf(DomainError)
    })

    it("should have correct code and message", () => {
      const error = new UserNotApprovedError("user-001")
      expect(error.code).toBe("USER_NOT_APPROVED")
      expect(error.message).toContain("user-001")
      expect(error.name).toBe("UserNotApprovedError")
    })
  })

  describe("UserAlreadyApprovedError", () => {
    it("should extend DomainError", () => {
      const error = new UserAlreadyApprovedError("user-001")
      expect(error).toBeInstanceOf(DomainError)
    })

    it("should have correct code and message", () => {
      const error = new UserAlreadyApprovedError("user-001")
      expect(error.code).toBe("USER_ALREADY_APPROVED")
      expect(error.message).toContain("user-001")
      expect(error.name).toBe("UserAlreadyApprovedError")
    })
  })
})

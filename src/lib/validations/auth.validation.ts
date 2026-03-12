import { RegisterUserDTO } from "../../core/auth/application/dtos/user.dto"

export type ValidationResult = {
  valid: boolean
  errors: Record<string, string>
}

export type RegistrationValidationResult = {
  valid: boolean
  errors: Record<string, string>
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const validateLoginForm = (data: {
  email: string
  password: string
}): ValidationResult => {
  const errors: Record<string, string> = {}

  if (!data.email.trim()) {
    errors.email = "Email is required"
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = "Please enter a valid email address"
  }

  if (!data.password) {
    errors.password = "Password is required"
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters"
  }

  return { valid: Object.keys(errors).length === 0, errors }
}

export const validateRegistration = (data: Partial<RegisterUserDTO>): RegistrationValidationResult => {
  const errors: Record<string, string> = {}

  const fullName = data.fullName?.trim() || ""
  if (!fullName) {
    errors.fullName = "Full name is required"
  } else if (fullName.length < 3) {
    errors.fullName = "Full name must be at least 3 characters"
  }

  const email = data.email?.trim() || ""
  if (!email) {
    errors.email = "Email is required"
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Please enter a valid email address"
  }

  const universityId = data.universityId?.trim() || ""
  if (!universityId) {
    errors.universityId = "University ID is required"
  }

  let yearValue: number | undefined
  if (data.year !== undefined && data.year !== null && data.year !== "") {
    yearValue = Number(data.year)
    if (Number.isNaN(yearValue)) {
      errors.year = "Year must be a number"
    } else if (yearValue < 1 || yearValue > 7) {
      errors.year = "Year must be between 1 and 7"
    }
  } else {
    errors.year = "Year is required"
  }

  const password = data.password || ""
  if (!password) {
    errors.password = "Password is required"
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters"
  }

  const confirm = data.confirmPassword || ""
  if (confirm !== password) {
    errors.confirmPassword = "Passwords do not match"
  }

  return { valid: Object.keys(errors).length === 0, errors }
}

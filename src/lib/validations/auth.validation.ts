export type ValidationResult = {
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

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

type SignupErrors = Partial<Record<string, string>>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateSignupForm = (data: {
    fullName: string
    email: string
    password: string
    year: string
    phoneNumber: string
    department: string
}): { valid: boolean; errors: SignupErrors } => {
    const errors: SignupErrors = {}

    if (!data.fullName.trim()) {
        errors.fullName = "Full name is required"
    } else if (data.fullName.trim().length < 3) {
        errors.fullName = "Full name must be at least 3 characters"
    }

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

    if (!data.year) {
        errors.year = "Year is required"
    }

    if (!data.phoneNumber.trim()) {
        errors.phoneNumber = "Phone number is required"
    }

    return { valid: Object.keys(errors).length === 0, errors }
}

const yearOptions = [
    { value: "", label: "Select year" },
    { value: "1", label: "1st Year" },
    { value: "2", label: "2nd Year" },
    { value: "3", label: "3rd Year" },
    { value: "4", label: "4th Year" },
    { value: "5", label: "5th Year" },
    { value: "6", label: "6th Year" },
    { value: "7", label: "7th Year" },
]

export const SignupForm = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<SignupErrors>({})
    const [serverError, setServerError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setServerError(null)
        setFieldErrors({})

        const form = new FormData(e.currentTarget)
        const fullName = (form.get("fullName") as string) ?? ""
        const email = (form.get("email") as string) ?? ""
        const password = (form.get("password") as string) ?? ""
        const year = (form.get("year") as string) ?? ""
        const phoneNumber = (form.get("phoneNumber") as string) ?? ""
        const department = (form.get("department") as string) ?? ""

        const validation = validateSignupForm({
            fullName,
            email,
            password,
            year,
            phoneNumber,
            department,
        })

        if (!validation.valid) {
            setFieldErrors(validation.errors)
            return
        }

        setIsLoading(true)

        try {
            const { data, error } = await authClient.signUp.email({
                name: fullName,
                email,
                password,
            }, {
                onError: (ctx) => {
                    setServerError(ctx.error.message || "Something went wrong")
                },
            })

            if (data) {
                router.push("/verify-email?sent=true")
            }

            if (error) {
                setServerError(error.message || "Something went wrong")
            }
        } catch {
            setServerError("Connection error, please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const inputBaseClass = "w-full rounded-2xl border bg-[#F8FAFC] px-4 py-3 text-base text-slate-900 transition-all placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
    const inputErrorClass = "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/10"
    const inputDefaultClass = "border-slate-200"

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {serverError ? (
                <div
                    role="alert"
                    className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    <svg
                        className="h-4 w-4 shrink-0 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                        />
                    </svg>
                    <span className="font-medium">{serverError}</span>
                </div>
            ) : null}

            {/* Full Name */}
            <div className="flex flex-col gap-2">
                <label
                    htmlFor="signup-fullName"
                    className="pl-1 text-sm font-semibold text-slate-700"
                >
                    Full Name
                </label>
                <input
                    id="signup-fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    aria-label="Full name"
                    aria-invalid={!!fieldErrors.fullName}
                    aria-describedby={fieldErrors.fullName ? "fullName-error" : undefined}
                    autoComplete="name"
                    required
                    className={`${inputBaseClass} ${fieldErrors.fullName ? inputErrorClass : inputDefaultClass}`}
                />
                {fieldErrors.fullName ? (
                    <p id="fullName-error" className="text-sm text-red-600" role="alert">
                        {fieldErrors.fullName}
                    </p>
                ) : null}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
                <label
                    htmlFor="signup-email"
                    className="pl-1 text-sm font-semibold text-slate-700"
                >
                    Email (required)
                </label>
                <input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="example@astu.edu.et"
                    aria-label="Email address"
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "email-error" : undefined}
                    autoComplete="email"
                    required
                    className={`${inputBaseClass} ${fieldErrors.email ? inputErrorClass : inputDefaultClass}`}
                />
                {fieldErrors.email ? (
                    <p id="email-error" className="text-sm text-red-600" role="alert">
                        {fieldErrors.email}
                    </p>
                ) : null}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
                <label
                    htmlFor="signup-password"
                    className="pl-1 text-sm font-semibold text-slate-700"
                >
                    Password (required)
                </label>
                <input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    aria-label="Password"
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "password-error" : undefined}
                    autoComplete="new-password"
                    required
                    className={`${inputBaseClass} ${fieldErrors.password ? inputErrorClass : inputDefaultClass}`}
                />
                {fieldErrors.password ? (
                    <p id="password-error" className="text-sm text-red-600" role="alert">
                        {fieldErrors.password}
                    </p>
                ) : null}
            </div>

            {/* Year + Phone Number (side by side) */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="signup-year"
                        className="pl-1 text-sm font-semibold text-slate-700"
                    >
                        Year
                    </label>
                    <select
                        id="signup-year"
                        name="year"
                        aria-label="Year"
                        aria-invalid={!!fieldErrors.year}
                        aria-describedby={fieldErrors.year ? "year-error" : undefined}
                        required
                        className={`${inputBaseClass} appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10 ${fieldErrors.year ? inputErrorClass : inputDefaultClass}`}
                    >
                        {yearOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    {fieldErrors.year ? (
                        <p id="year-error" className="text-sm text-red-600" role="alert">
                            {fieldErrors.year}
                        </p>
                    ) : null}
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="signup-phone"
                        className="pl-1 text-sm font-semibold text-slate-700"
                    >
                        Phone Number (required)
                    </label>
                    <input
                        id="signup-phone"
                        name="phoneNumber"
                        type="tel"
                        placeholder="+251 ..."
                        aria-label="Phone number"
                        aria-invalid={!!fieldErrors.phoneNumber}
                        aria-describedby={fieldErrors.phoneNumber ? "phone-error" : undefined}
                        autoComplete="tel"
                        required
                        className={`${inputBaseClass} ${fieldErrors.phoneNumber ? inputErrorClass : inputDefaultClass}`}
                    />
                    {fieldErrors.phoneNumber ? (
                        <p id="phone-error" className="text-sm text-red-600" role="alert">
                            {fieldErrors.phoneNumber}
                        </p>
                    ) : null}
                </div>
            </div>

            {/* Department */}
            <div className="flex flex-col gap-2">
                <label
                    htmlFor="signup-department"
                    className="pl-1 text-sm font-semibold text-slate-700"
                >
                    Department (optional)
                </label>
                <input
                    id="signup-department"
                    name="department"
                    type="text"
                    placeholder="Software Engineering"
                    aria-label="Department"
                    className={`${inputBaseClass} ${inputDefaultClass}`}
                />
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full rounded-3xl bg-gradient-to-r from-[#135BEC] to-[#2563EB] px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Creating Account…
                    </span>
                ) : "Create Account"}
            </button>
        </form>
    )
}

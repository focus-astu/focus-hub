"use client"

import { authClient } from "@/lib/auth-client"
import { validateLoginForm } from "@/lib/validations/auth.validation"
import { useRouter } from "next/navigation"
import { useState } from "react"

export const LoginForm = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [formError, setFormError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormError(null)
        setFieldErrors({})

        const formData = new FormData(e.currentTarget)
        const email = (formData.get("email") as string) ?? ""
        const password = (formData.get("password") as string) ?? ""

        const validation = validateLoginForm({ email, password })
        if (!validation.valid) {
            setFieldErrors(validation.errors)
            return
        }

        setIsLoading(true)

        try {
            const { data, error } = await authClient.signIn.email(
                { email, password },
                {
                        onError: (ctx) => {
                        if (ctx.error.status === 403) {
                            if (ctx.error.message.includes("verify")) {
                                setFormError(
                                    "Please verify your email first. Check your inbox.",
                                )
                            } else if (ctx.error.message.includes("approval")) {
                                router.push(`/pending-approval?email=${encodeURIComponent(email)}`)
                            } else if (
                                ctx.error.message.includes("banned") ||
                                ctx.error.message.includes("suspended")
                            ) {
                                setFormError("Your account has been suspended.")
                            } else {
                                setFormError(ctx.error.message)
                            }
                        } else if (ctx.error.status === 401) {
                            setFormError("Invalid email or password.")
                        } else {
                            setFormError(ctx.error.message || "An unexpected error occurred.")
                        }
                    },
                },
            )

            if (data) {
                router.push("/dashboard")
            }
        } catch {
            setFormError("Connection error, please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {formError ? (
                <div
                    role="alert"
                    className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                        <svg
                            className="h-4 w-4 text-red-600"
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
                    </div>
                    <span className="font-medium">{formError}</span>
                </div>
            ) : null}

            {/* Email field with icon */}
            <div className="flex flex-col gap-2">
                <label
                    htmlFor="login-email"
                    className="text-sm font-semibold text-slate-700"
                >
                    Email
                </label>
                <div className="group relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500">
                        <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                    </span>
                    <input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="student@astu.edu.et"
                        aria-label="Email address"
                        aria-invalid={!!fieldErrors.email}
                        aria-describedby={fieldErrors.email ? "email-error" : undefined}
                        autoComplete="email"
                        required
                        className={`w-full rounded-3xl border bg-[#F8FAFC] py-4 pl-12 pr-4 text-base text-slate-900 transition-all placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${fieldErrors.email
                            ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/10"
                            : "border-slate-200"
                            }`}
                    />
                </div>
                {fieldErrors.email ? (
                    <p id="email-error" className="flex items-center gap-1 text-sm text-red-600" role="alert">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
                        {fieldErrors.email}
                    </p>
                ) : null}
            </div>

            {/* Password field with icon and toggle */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <label
                        htmlFor="login-password"
                        className="text-sm font-semibold text-slate-700"
                    >
                        Password
                    </label>
                    <a
                        href="/forgot-password"
                        className="text-xs font-bold text-[#135BEC] transition-colors hover:text-blue-700"
                    >
                        Forgot Password?
                    </a>
                </div>
                <div className="group relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500">
                        <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                    </span>
                    <input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        aria-label="Password"
                        aria-invalid={!!fieldErrors.password}
                        aria-describedby={fieldErrors.password ? "password-error" : undefined}
                        autoComplete="current-password"
                        required
                        className={`w-full rounded-3xl border bg-[#F8FAFC] py-4 pl-12 pr-12 text-base text-slate-900 transition-all placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${fieldErrors.password
                            ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/10"
                            : "border-slate-200"
                            }`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 transition-colors hover:text-slate-600"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        ) : (
                            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        )}
                    </button>
                </div>
                {fieldErrors.password ? (
                    <p id="password-error" className="flex items-center gap-1 text-sm text-red-600" role="alert">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
                        {fieldErrors.password}
                    </p>
                ) : null}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
                <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                />
                <label htmlFor="remember" className="text-sm text-slate-600">
                    Remember me
                </label>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isLoading}
                className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-[#135BEC] to-[#3B82F6] px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Signing in…
                    </span>
                ) : "Login to Portal"}
            </button>

            {/* Divider */}
            <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-4 font-bold uppercase tracking-widest text-slate-400">
                        or continue with
                    </span>
                </div>
            </div>

            {/* Google sign in */}
            <button
                type="button"
                disabled
                className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Sign in with Google"
            >
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign in with Google
            </button>

            {/* Sign up link */}
            <p className="text-center text-base text-slate-600">
                Don&apos;t have an account?{" "}
                <a
                    href="/signup"
                    className="font-bold text-[#135BEC] transition-colors hover:text-blue-700"
                >
                    Sign Up
                </a>
            </p>
        </form>
    )
}

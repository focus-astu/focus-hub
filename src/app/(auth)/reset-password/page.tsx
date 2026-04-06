"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import {
  Lock,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import { Logo } from "@/components/ui"

type PageState = "idle" | "submitting" | "success" | "error" | "invalid-token"

const REDIRECT_DELAY = 3

const ResetPasswordContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const token = searchParams.get("token")
  const urlError = searchParams.get("error")

  const [state, setState] = useState<PageState>(
    urlError === "INVALID_TOKEN" ? "invalid-token" : "idle",
  )
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState("")
  const [countdown, setCountdown] = useState(REDIRECT_DELAY)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (state !== "success") return
    if (countdown <= 0) {
      router.push("/login")
      return
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [state, countdown, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFieldErrors({})
    setServerError("")

    const errors: Record<string, string> = {}

    if (!newPassword) {
      errors.newPassword = "Password is required"
    } else if (newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters"
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password"
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    if (!token) {
      setState("invalid-token")
      return
    }

    setState("submitting")

    try {
      const { error } = await authClient.resetPassword({
        newPassword,
        token,
      })

      if (error) {
        if (error.message?.toLowerCase().includes("invalid") || error.message?.toLowerCase().includes("expired")) {
          setState("invalid-token")
        } else {
          setServerError(error.message ?? "Something went wrong. Please try again.")
          setState("error")
        }
      } else {
        setState("success")
      }
    } catch {
      setServerError("Connection error. Please try again.")
      setState("error")
    }
  }

  const inputBaseClass = "w-full rounded-2xl border bg-[#F8FAFC] px-4 py-3 text-base text-slate-900 transition-all placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
  const inputErrorClass = "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/10"
  const inputDefaultClass = "border-slate-200"

  if (state === "invalid-token") {
    return (
      <div className="flex flex-col items-center px-6 py-10 text-center sm:px-12 sm:py-12">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/50">
          <XCircle className="h-10 w-10 text-red-500" />
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Invalid or Expired Link
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500 sm:text-base">
          This password reset link is no longer valid. It may have expired or already been used.
        </p>

        <Link
          href="/forgot-password"
          className="mt-8 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-700 hover:to-blue-600 hover:shadow-xl hover:shadow-blue-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98] sm:text-base"
          tabIndex={0}
          aria-label="Request new reset link"
        >
          Request a New Link
        </Link>

        <Link
          href="/login"
          className="mt-4 flex items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          tabIndex={0}
          aria-label="Back to Login"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>
    )
  }

  if (state === "success") {
    return (
      <div className="flex flex-col items-center px-6 py-10 sm:px-12 sm:py-12">
        <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-emerald-50 sm:h-32 sm:w-32">
          <CheckCircle className="h-12 w-12 text-emerald-600 sm:h-14 sm:w-14" />
        </div>

        <h1 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Password Reset!
        </h1>
        <p className="mt-4 max-w-sm text-center text-sm leading-relaxed text-slate-500 sm:text-base">
          Your password has been successfully updated. You can now sign in with your new password.
        </p>

        <p className="mt-4 text-sm font-medium text-slate-400">
          Redirecting to login in {countdown}s…
        </p>

        <Link
          href="/login"
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-700 hover:to-blue-600 hover:shadow-xl hover:shadow-blue-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98] sm:text-base"
          tabIndex={0}
          aria-label="Sign in now"
        >
          Sign In Now
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center px-6 py-10 sm:px-12 sm:py-12">
      <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-blue-50 sm:h-32 sm:w-32">
        <Lock className="h-12 w-12 text-blue-600 sm:h-14 sm:w-14" />
      </div>

      <h1 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        Set New Password
      </h1>
      <p className="mt-4 max-w-sm text-center text-sm leading-relaxed text-slate-500 sm:text-base">
        Enter your new password below. Make sure it&apos;s at least 8 characters long.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 w-full" noValidate>
        {serverError ? (
          <div
            role="alert"
            className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
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

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="reset-password"
              className="pl-1 text-sm font-semibold text-slate-700"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="reset-password"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                aria-label="New password"
                aria-invalid={!!fieldErrors.newPassword}
                aria-describedby={fieldErrors.newPassword ? "newPassword-error" : undefined}
                autoComplete="new-password"
                required
                className={`${inputBaseClass} pr-12 ${fieldErrors.newPassword ? inputErrorClass : inputDefaultClass}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                tabIndex={0}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                )}
              </button>
            </div>
            {fieldErrors.newPassword ? (
              <p id="newPassword-error" className="text-sm text-red-600" role="alert">
                {fieldErrors.newPassword}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="reset-confirm-password"
              className="pl-1 text-sm font-semibold text-slate-700"
            >
              Confirm Password
            </label>
            <input
              id="reset-confirm-password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              aria-label="Confirm new password"
              aria-invalid={!!fieldErrors.confirmPassword}
              aria-describedby={fieldErrors.confirmPassword ? "confirmPassword-error" : undefined}
              autoComplete="new-password"
              required
              className={`${inputBaseClass} ${fieldErrors.confirmPassword ? inputErrorClass : inputDefaultClass}`}
            />
            {fieldErrors.confirmPassword ? (
              <p id="confirmPassword-error" className="text-sm text-red-600" role="alert">
                {fieldErrors.confirmPassword}
              </p>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          disabled={state === "submitting"}
          className="mt-6 w-full rounded-3xl bg-gradient-to-r from-[#135BEC] to-[#2563EB] px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          tabIndex={0}
          aria-label="Reset password"
        >
          {state === "submitting" ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Resetting…
            </span>
          ) : "Reset Password"}
        </button>
      </form>

      <Link
        href="/login"
        className="mt-6 flex items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
        tabIndex={0}
        aria-label="Back to Login"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </Link>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 px-4 py-8 sm:px-6">
      <div className="relative w-full max-w-lg">
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-blue-200/20 blur-[64px]" />
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-200/20 blur-[64px]" />

        <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm">
          <Suspense fallback={
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          }>
            <ResetPasswordContent />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400 sm:text-sm">
          Need help? Contact our support team
        </p>
      </div>

      <footer className="mt-12 flex w-full max-w-5xl flex-col items-center gap-4 border-t border-slate-100 bg-slate-50 px-4 pt-8 sm:flex-row sm:justify-between sm:px-8">
        <Logo variant="full" size="sm" />
        <p className="text-xs text-slate-500">
          &copy; {new Date().getFullYear()} FOCUS Fellowship. All Rights Reserved.
        </p>
      </footer>
    </main>
  )
}

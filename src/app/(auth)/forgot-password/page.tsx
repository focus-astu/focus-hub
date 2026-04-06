"use client"

import { useState } from "react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Mail, CheckCircle, ArrowLeft, Loader2 } from "lucide-react"
import { Logo } from "@/components/ui"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const maskEmail = (email: string) => {
  const [local, domain] = email.split("@")
  if (!domain) return email
  const visible = local.slice(0, 2)
  return `${visible}${"•".repeat(Math.max(local.length - 2, 2))}@${domain}`
}

type PageState = "idle" | "sending" | "sent" | "error"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<PageState>("idle")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Email is required")
      return
    }
    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setState("sending")

    try {
      const { error: resetError } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      })

      if (resetError) {
        setError(resetError.message ?? "Something went wrong. Please try again.")
        setState("error")
      } else {
        setState("sent")
      }
    } catch {
      setError("Connection error. Please try again.")
      setState("error")
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 px-4 py-8 sm:px-6">
      <div className="relative w-full max-w-lg">
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-blue-200/20 blur-[64px]" />
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-200/20 blur-[64px]" />

        <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm">
          {state === "sent" ? (
            <div className="flex flex-col items-center px-6 py-10 sm:px-12 sm:py-12">
              <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-emerald-50 sm:h-32 sm:w-32">
                <CheckCircle className="h-12 w-12 text-emerald-600 sm:h-14 sm:w-14" />
              </div>

              <h1 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Check Your Email
              </h1>
              <p className="mt-4 max-w-sm text-center text-sm leading-relaxed text-slate-500 sm:text-base">
                We&apos;ve sent a password reset link to your email address. Click the link to set a new password.
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2">
                <Mail className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">{maskEmail(email)}</span>
              </div>

              <Link
                href="/login"
                className="mt-8 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-700 hover:to-blue-600 hover:shadow-xl hover:shadow-blue-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98] sm:text-base"
                tabIndex={0}
                aria-label="Back to Login"
              >
                Back to Login
              </Link>

              <div className="mt-6 w-full border-t border-slate-200 pt-4">
                <p className="text-center text-sm text-slate-500">
                  Didn&apos;t receive the email? Check your spam folder or{" "}
                  <button
                    type="button"
                    onClick={() => { setState("idle"); setError("") }}
                    className="font-bold text-blue-600 transition-colors hover:text-blue-700"
                    tabIndex={0}
                    aria-label="Try again"
                  >
                    try again
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center px-6 py-10 sm:px-12 sm:py-12">
              <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-blue-50 sm:h-32 sm:w-32">
                <Mail className="h-12 w-12 text-blue-600 sm:h-14 sm:w-14" />
              </div>

              <h1 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Forgot Password?
              </h1>
              <p className="mt-4 max-w-sm text-center text-sm leading-relaxed text-slate-500 sm:text-base">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 w-full" noValidate>
                {error ? (
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
                    <span className="font-medium">{error}</span>
                  </div>
                ) : null}

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="forgot-email"
                    className="pl-1 text-sm font-semibold text-slate-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="forgot-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@astu.edu.et"
                    aria-label="Email address"
                    aria-invalid={!!error}
                    autoComplete="email"
                    required
                    className={`w-full rounded-2xl border bg-[#F8FAFC] px-4 py-3 text-base text-slate-900 transition-all placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${
                      error ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/10" : "border-slate-200"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="mt-6 w-full rounded-3xl bg-gradient-to-r from-[#135BEC] to-[#2563EB] px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
                  tabIndex={0}
                  aria-label="Send reset link"
                >
                  {state === "sending" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending…
                    </span>
                  ) : "Send Reset Link"}
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
          )}
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

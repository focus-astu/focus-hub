"use client"

import { Suspense } from "react"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import {
  Mail,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import { Logo } from "@/components/ui"

type VerifyState =
  | { status: "sent" }
  | { status: "verifying" }
  | { status: "success" }
  | { status: "error"; message: string }

const maskEmail = (email: string) => {
  const [local, domain] = email.split("@")
  if (!domain) return email
  const visible = local.slice(0, 2)
  return `${visible}${"•".repeat(Math.max(local.length - 2, 2))}@${domain}`
}

const VerifyEmailContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [state, setState] = useState<VerifyState>({ status: "sent" })
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [resendError, setResendError] = useState("")
  const [cooldown, setCooldown] = useState(0)

  const token = searchParams.get("token")
  const emailFromUrl = searchParams.get("email")
  const displayEmail = emailFromUrl ? maskEmail(emailFromUrl) : null

  const verifyToken = useCallback(async (t: string) => {
    setState({ status: "verifying" })

    const { error } = await authClient.verifyEmail({
      query: { token: t },
    })

    if (error) {
      setState({
        status: "error",
        message:
          error.message ??
          "Invalid or expired verification link. Please request a new one.",
      })
    } else {
      setState({ status: "success" })
    }
  }, [])

  useEffect(() => {
    if (token) {
      verifyToken(token)
    } else {
      setState({ status: "sent" })
    }
  }, [token, verifyToken])

  useEffect(() => {
    if (state.status === "success") {
      router.push(`/verification-success${emailFromUrl ? `?email=${encodeURIComponent(emailFromUrl)}` : ""}`)
    }
  }, [state.status, router, emailFromUrl])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleResend = async () => {
    if (!emailFromUrl || cooldown > 0) return
    setResendState("sending")
    setResendError("")

    const { error } = await authClient.sendVerificationEmail({
      email: emailFromUrl,
      callbackURL: "/verify-email",
    })

    if (error) {
      setResendState("error")
      setResendError(error.message ?? "Failed to resend. Please try again.")
    } else {
      setResendState("sent")
      setCooldown(60)
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 px-4 py-8 sm:px-6">
      <div className="relative w-full max-w-lg">
        {/* Decorative blurs */}
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-blue-200/20 blur-[64px]" />
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-200/20 blur-[64px]" />

        {/* Central Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm">
          {/* ── Sent state ── */}
          {state.status === "sent" && (
            <div className="flex flex-col items-center px-6 py-10 sm:px-12 sm:py-12">
              {/* Illustration */}
              <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-blue-50 sm:h-32 sm:w-32">
                <Mail className="h-12 w-12 text-blue-600 sm:h-14 sm:w-14" />
              </div>

              {/* Text content */}
              <h1 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Check Your Inbox
              </h1>
              <p className="mt-4 max-w-sm text-center text-sm leading-relaxed text-slate-500 sm:text-base">
                We&apos;ve sent a verification link to your email address. Please click the link to activate your account.
              </p>

              {displayEmail ? (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">{displayEmail}</span>
                </div>
              ) : null}

              {/* Back to Login button */}
              <Link
                href="/login"
                className="mt-8 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-700 hover:to-blue-600 hover:shadow-xl hover:shadow-blue-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98] sm:text-base"
                tabIndex={0}
                aria-label="Back to Login"
              >
                Back to Login
              </Link>

              {/* Divider + Resend */}
              <div className="mt-6 w-full border-t border-slate-200 pt-4">
                <div className="flex flex-wrap items-center justify-center gap-1 text-sm text-slate-500 sm:text-base">
                  <span>Didn&apos;t receive the email?</span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendState === "sending" || cooldown > 0 || !emailFromUrl}
                    className="font-bold text-blue-600 transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50"
                    tabIndex={0}
                    aria-label="Resend verification link"
                  >
                    {resendState === "sending" ? (
                      <span className="inline-flex items-center gap-1">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Sending…
                      </span>
                    ) : cooldown > 0 ? (
                      `Resend in ${cooldown}s`
                    ) : (
                      "Resend link"
                    )}
                  </button>
                </div>

                {resendState === "sent" && (
                  <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-emerald-600">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                    Verification email sent! Check your inbox.
                  </p>
                )}
                {resendState === "error" && (
                  <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-red-600" role="alert">
                    <XCircle className="h-3.5 w-3.5 shrink-0" />
                    {resendError}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── Verifying state ── */}
          {state.status === "verifying" && (
            <div className="flex flex-col items-center px-6 py-16 text-center sm:px-12">
              <Loader2 className="mb-6 h-12 w-12 animate-spin text-blue-600" />
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Verifying Your Email
              </h1>
              <p className="mt-3 text-sm text-slate-500 sm:text-base">
                Please wait while we verify your email address…
              </p>
            </div>
          )}

          {/* ── Error state ── */}
          {state.status === "error" && (
            <div className="flex flex-col items-center px-6 py-10 text-center sm:px-12 sm:py-12">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/50">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Verification Failed
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-red-500 sm:text-base">
                {state.message}
              </p>

              <div className="mt-6 w-full border-t border-slate-200 pt-4">
                <p className="mb-3 text-sm text-slate-400">
                  Request a new verification link:
                </p>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendState === "sending" || cooldown > 0 || !emailFromUrl}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-700 hover:to-blue-600 hover:shadow-xl hover:shadow-blue-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 sm:text-base"
                  tabIndex={0}
                  aria-label="Resend verification email"
                >
                  {resendState === "sending" ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending…
                    </span>
                  ) : cooldown > 0 ? (
                    `Resend in ${cooldown}s`
                  ) : (
                    "Resend Verification Email"
                  )}
                </button>

                {resendState === "sent" && (
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-emerald-600">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                    Verification email sent!
                  </p>
                )}
                {resendState === "error" && (
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-red-600" role="alert">
                    <XCircle className="h-3.5 w-3.5 shrink-0" />
                    {resendError}
                  </p>
                )}
              </div>

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

        {/* Supporting footer */}
        <p className="mt-6 text-center text-xs text-slate-400 sm:text-sm">
          Need help? Contact our support team
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-12 flex w-full max-w-5xl flex-col items-center gap-4 border-t border-slate-100 bg-slate-50 px-4 pt-8 sm:flex-row sm:justify-between sm:px-8">
        <Logo variant="full" size="sm" />
        <nav className="flex gap-6" aria-label="Footer navigation">
          {["Privacy", "Terms", "Support", "About"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-700"
              tabIndex={0}
              aria-label={item}
            >
              {item}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-slate-500">
          &copy; {new Date().getFullYear()} FOCUS Fellowship. All Rights Reserved.
        </p>
      </footer>
    </main>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}

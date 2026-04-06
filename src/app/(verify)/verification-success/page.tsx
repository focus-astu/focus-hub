"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  CheckCircle,
  Shield,
} from "lucide-react"
import { Logo } from "@/components/ui"
import { authClient } from "@/lib/auth-client"

const REDIRECT_DELAY = 5

const VerificationSuccessContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const emailFromUrl = searchParams.get("email")
  const [countdown, setCountdown] = useState(REDIRECT_DELAY)
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(emailFromUrl)

  useEffect(() => {
    const checkStatus = async () => {
      const { data: session } = await authClient.getSession()
      const email = session?.user?.email ?? emailFromUrl

      if (email) setUserEmail(email)

      if (!email) {
        setRedirectTarget("/pending-approval")
        return
      }

      try {
        const res = await fetch("/api/v1/auth/check-approval", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })
        const data = await res.json()
        setRedirectTarget(data.approved ? "/dashboard" : "/pending-approval")
      } catch {
        setRedirectTarget("/pending-approval")
      }
    }

    checkStatus()
  }, [emailFromUrl])

  useEffect(() => {
    if (countdown <= 0 && redirectTarget) {
      const target = redirectTarget === "/pending-approval" && userEmail
        ? `${redirectTarget}?email=${encodeURIComponent(userEmail)}`
        : redirectTarget
      router.push(target)
      return
    }

    const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown, redirectTarget, router, userEmail])

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-slate-50 px-4 py-12 sm:justify-center sm:px-6 sm:py-8 overflow-y-auto">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-blue-600/10 blur-[64px]" />
        <div className="absolute -bottom-16 -right-16 h-[512px] w-[512px] rounded-full bg-violet-200/20 blur-[64px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="overflow-hidden rounded-xl bg-white shadow-lg shadow-blue-500/30">
          <div className="relative flex h-48 items-center justify-center overflow-hidden bg-blue-600 sm:h-64">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15)_0%,transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
            </div>

            <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 backdrop-blur-sm sm:left-8 sm:top-8 sm:px-4 sm:py-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 sm:text-xs">
                Verified
              </span>
            </div>

            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 backdrop-blur-sm sm:bottom-8 sm:right-8 sm:px-4 sm:py-2">
              <CheckCircle className="h-3 w-3 text-blue-600 sm:h-3.5 sm:w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 sm:text-xs">
                Success
              </span>
            </div>

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg sm:h-24 sm:w-24">
              <Shield className="h-10 w-10 text-blue-600 sm:h-12 sm:w-12" />
            </div>
          </div>

          <div className="flex flex-col items-center px-6 py-10 sm:px-12 sm:py-12">
            <h1 className="text-center text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
              Email Verified!
            </h1>

            {userEmail ? (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">{userEmail}</span>
              </div>
            ) : null}

            <p className="mt-5 max-w-sm text-center text-sm leading-relaxed text-slate-500 sm:text-base sm:leading-relaxed">
              {redirectTarget === "/dashboard"
                ? "Your account is approved. Redirecting you to the dashboard…"
                : "Your email is verified. Redirecting you to check your approval status…"
              }
            </p>

            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="relative h-12 w-12">
                <svg className="h-12 w-12 -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
                  <circle
                    cx="24" cy="24" r="20"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="4"
                  />
                  <circle
                    cx="24" cy="24" r="20"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 20}
                    strokeDashoffset={2 * Math.PI * 20 * (countdown / REDIRECT_DELAY)}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-700">
                  {countdown}s
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <Logo variant="full" size="sm" />
        </div>
      </div>
    </main>
  )
}

export default function VerificationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    }>
      <VerificationSuccessContent />
    </Suspense>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Clock, LogOut, RefreshCw, CheckCircle } from "lucide-react"
import { Logo } from "@/components/ui"
import Link from "next/link"

type CheckState = "idle" | "checking" | "still-pending" | "approved"

export default function PendingApprovalPage() {
  const router = useRouter()
  const [checkState, setCheckState] = useState<CheckState>("idle")
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleCheckStatus = async () => {
    setCheckState("checking")

    try {
      const { data: session } = await authClient.getSession()
      if (session?.user) {
        setCheckState("approved")
        setTimeout(() => router.push("/"), 1500)
      } else {
        setCheckState("still-pending")
      }
    } catch {
      setCheckState("still-pending")
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await authClient.signOut()
    router.push("/login")
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 px-4 py-8 sm:px-6">
      <div className="relative w-full max-w-lg">
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-amber-200/20 blur-[64px]" />
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-200/20 blur-[64px]" />

        <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="flex flex-col items-center px-6 py-10 sm:px-12 sm:py-12">
            <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-amber-50 sm:h-32 sm:w-32">
              {checkState === "approved" ? (
                <CheckCircle className="h-12 w-12 text-emerald-500 sm:h-14 sm:w-14" />
              ) : (
                <Clock className="h-12 w-12 text-amber-500 sm:h-14 sm:w-14" />
              )}
            </div>

            {checkState === "approved" ? (
              <>
                <h1 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  Account Approved!
                </h1>
                <p className="mt-4 max-w-sm text-center text-sm leading-relaxed text-emerald-600 sm:text-base">
                  Your account has been approved. Redirecting you now…
                </p>
              </>
            ) : (
              <>
                <h1 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  Account Pending Approval
                </h1>
                <p className="mt-4 max-w-sm text-center text-sm leading-relaxed text-slate-500 sm:text-base">
                  Your email has been verified successfully. An administrator will review and
                  approve your account shortly. You&apos;ll be able to sign in once approved.
                </p>

                {checkState === "still-pending" && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-700">
                      Still pending — check back later
                    </span>
                  </div>
                )}
              </>
            )}

            {checkState !== "approved" && (
              <div className="mt-8 flex w-full flex-col gap-3">
                <button
                  type="button"
                  onClick={handleCheckStatus}
                  disabled={checkState === "checking"}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-700 hover:to-blue-600 hover:shadow-xl hover:shadow-blue-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 sm:text-base"
                  tabIndex={0}
                  aria-label="Check approval status"
                >
                  {checkState === "checking" ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Checking…
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Check Status
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 sm:text-base"
                  tabIndex={0}
                  aria-label="Log out"
                >
                  {isLoggingOut ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Logging out…
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400 sm:text-sm">
          Need help? Contact our support team
        </p>
      </div>

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

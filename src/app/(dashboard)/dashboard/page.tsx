"use client"

import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Rocket, LogOut, RefreshCw } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState<string | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await authClient.getSession()
      if (!data?.user) {
        router.push("/login")
        return
      }
      setUserName(data.user.name)
    }
    fetchSession()
  }, [router])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await authClient.signOut()
    router.push("/login")
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-blue-600/5 blur-[80px]" />
        <div className="absolute -bottom-16 -right-16 h-[400px] w-[400px] rounded-full bg-violet-300/10 blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-violet-500">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15)_0%,transparent_60%)]" />
            </div>

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Rocket className="h-10 w-10 text-white" />
            </div>
          </div>

          <div className="flex flex-col items-center px-6 py-10 sm:px-12">
            {userName ? (
              <p className="mb-2 text-sm font-semibold text-blue-600">
                Welcome back, {userName}
              </p>
            ) : null}

            <h1 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Coming Soon
            </h1>

            <p className="mt-4 max-w-sm text-center text-sm leading-relaxed text-slate-500 sm:text-base">
              We&apos;re building something amazing for you. The dashboard with tasks,
              announcements, and fellowship features is on its way.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {["Tasks", "Announcements", "Mentorship", "Events"].map((feature) => (
                <span
                  key={feature}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600"
                >
                  {feature}
                </span>
              ))}
            </div>

            <div className="mt-8 w-full border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50"
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
          </div>
        </div>
      </div>
    </div>
  )
}

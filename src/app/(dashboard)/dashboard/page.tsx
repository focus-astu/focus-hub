"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Rocket, LogOut, RefreshCw } from "lucide-react"
import { PostFeed } from "@/features/general-leader"

const { useSession } = authClient

export default function DashboardPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const userName = session?.user?.name ?? null

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await authClient.signOut()
    router.push("/login")
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 px-4 py-8">
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-violet-500 sm:h-40">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15)_0%,transparent_60%)]" />
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm sm:h-20 sm:w-20">
            <Rocket className="h-8 w-8 text-white sm:h-10 sm:w-10" />
          </div>
        </div>

        <div className="flex flex-col items-center px-6 py-6 sm:px-12 sm:py-8">
          {userName ? (
            <p className="mb-2 text-sm font-semibold text-blue-600">
              Welcome back, {userName}
            </p>
          ) : null}

          <h1 className="text-center text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Fellowship Dashboard
          </h1>

          <p className="mt-3 max-w-sm text-center text-sm leading-relaxed text-slate-500">
            Stay connected. More features like tasks, mentorship, and events are coming soon.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {["Tasks", "Announcements", "Mentorship", "Events"].map((feature) => (
              <span
                key={feature}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600"
              >
                {feature}
              </span>
            ))}
          </div>

          <div className="mt-6 w-full border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50"
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

      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900">Fellowship Posts</h2>
        <PostFeed />
      </div>
    </div>
  )
}

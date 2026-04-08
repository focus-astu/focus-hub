import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/core/auth/infrastructure/config/auth"
import { Logo } from "@/components/ui"
import { NotificationBell } from "@/features/notifications"
import { AdminSidebar, DashboardHeaderMobileMenu } from "@/features/admin"
import { GLSidebar, GLMobileMenu } from "@/features/general-leader"
import { MongoClient } from "mongodb"

const checkGLMembership = async (userId: string): Promise<boolean> => {
  const uri = process.env.MONGODB_URI
  if (!uri) return false
  const client = new MongoClient(uri)
  try {
    const db = client.db()
    const glOrg = await db.collection("organization").findOne({ slug: "general-leaders" })
    if (!glOrg) return false
    const membership = await db.collection("member").findOne({ organizationId: glOrg.id, userId })
    return !!membership
  } finally {
    await client.close()
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const user = session.user as typeof session.user & { approved?: boolean }

  if (!user.approved) {
    redirect(`/pending-approval?email=${encodeURIComponent(user.email)}`)
  }

  const isAdmin = session.user.role === "admin"
  const isGL = !isAdmin && await checkGLMembership(session.user.id)
  const hasSidebar = isAdmin || isGL

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            {isAdmin && <DashboardHeaderMobileMenu />}
            {isGL && <GLMobileMenu />}
            <Link href="/dashboard" aria-label="Dashboard" tabIndex={0}>
              <Logo variant="full" size="sm" />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        {isAdmin && <AdminSidebar />}
        {isGL && <GLSidebar />}
        <main className={`w-full min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 ${hasSidebar ? "" : "mx-auto max-w-7xl"}`}>
          {children}
        </main>
      </div>
    </div>
  )
}

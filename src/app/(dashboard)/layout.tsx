import Link from "next/link"
import { Logo } from "@/components/ui"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Home" tabIndex={0}>
            <Logo variant="full" size="sm" />
          </Link>
          <nav className="flex items-center gap-6" aria-label="Dashboard navigation">
            <Link
              href="/admin/users"
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600"
              tabIndex={0}
              aria-label="User Management"
            >
              Users
            </Link>
            <Link
              href="/admin/organizations"
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600"
              tabIndex={0}
              aria-label="Organization Management"
            >
              Organizations
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

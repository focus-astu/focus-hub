"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Users,
  FileText,
  LayoutDashboard,
  ChevronLeft,
  X,
  Newspaper,
  UsersRound,
} from "lucide-react"
import { useState, useEffect } from "react"

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/general-leader/users",
    icon: Users,
  },
  {
    label: "Posts",
    href: "/general-leader/posts",
    icon: FileText,
  },
  {
    label: "Updates",
    href: "/general-leader/updates",
    icon: Newspaper,
  },
  {
    label: "Teams",
    href: "/general-leader/teams",
    icon: UsersRound,
  },
]

export const GLSidebar = () => {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      setMobileOpen(false)
    })
  }, [pathname])

  useEffect(() => {
    const handler = () => setMobileOpen(true)
    window.addEventListener("open-gl-sidebar", handler)
    return () => window.removeEventListener("open-gl-sidebar", handler)
  }, [])

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:sticky lg:z-0 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "w-[68px]" : "w-60"}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-3 lg:hidden">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Menu</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close menu"
              tabIndex={0}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4" aria-label="General Leader navigation">
            <p className={`mb-2 hidden px-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 lg:block ${collapsed ? "lg:sr-only" : ""}`}>
              General Leader
            </p>
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-purple-50 text-purple-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  } ${collapsed ? "lg:justify-center" : ""}`}
                  tabIndex={0}
                  aria-label={item.label}
                  aria-current={active ? "page" : undefined}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-purple-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                  <span className={collapsed ? "lg:hidden" : ""}>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="hidden border-t border-slate-100 p-3 lg:block">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              tabIndex={0}
            >
              <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
              {!collapsed && <span>Collapse</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

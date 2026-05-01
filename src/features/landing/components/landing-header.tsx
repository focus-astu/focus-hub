"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/ui"

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Teams", href: "#teams" },
  { label: "Updates", href: "#updates" },
  { label: "Donate", href: "#donate" },
]

const HEADER_HEIGHT = 64

const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  if (!href.startsWith("#")) return
  e.preventDefault()
  const target = document.querySelector(href)
  if (!target) return
  const top = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT
  window.scrollTo({ top, behavior: "smooth" })
}

export const LandingHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" aria-label="Focus ASTU Home">
          <Logo variant="full" size="sm" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-sm font-semibold text-slate-900 transition-colors hover:text-blue-600"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/signup"
            className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-2 text-sm font-bold text-white shadow-md shadow-black/10 transition-shadow hover:shadow-lg"
          >
            Join
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-slate-700 lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-100 bg-white px-6 pb-6 pt-4 lg:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  handleScrollTo(e, link.href)
                  setMobileOpen(false)
                }}
                className="text-base font-semibold text-slate-900"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/signup"
              className="mt-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3 text-center text-sm font-bold text-white"
            >
              Join
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  )
}

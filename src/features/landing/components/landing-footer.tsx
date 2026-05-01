"use client"

import { MapPin, Mail } from "lucide-react"
import { Logo } from "@/components/ui"

const FOOTER_NAV = [
  { label: "About Us", href: "#about" },
  { label: "Our Teams", href: "#teams" },
  { label: "Latest News", href: "#updates" },
  { label: "Event Calendar", href: "#updates" },
]
const FOOTER_COMMUNITY = [
  { label: "Join Fellowship", href: "/signup" },
  { label: "Prayer Requests", href: "#donate" },
  { label: "Donation Portal", href: "#donate" },
  { label: "Alumni Network", href: "#about" },
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

export const LandingFooter = () => (
  <footer className="bg-[#020617] px-6 py-16 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-12 border-b border-slate-800 pb-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-5">
          <Logo variant="full" size="sm" inverted />
          <p className="text-sm leading-relaxed text-slate-400">
            A vibrant community of believers at Adama Science and Technology University.
          </p>
          <div className="flex gap-4 pt-1">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 text-slate-400 transition-colors hover:border-slate-600 hover:text-white"
                aria-hidden="true"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  {i === 0 ? (
                    <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.38 4.482A13.944 13.944 0 011.671 3.149a4.916 4.916 0 001.523 6.574 4.897 4.897 0 01-2.229-.616v.061a4.919 4.919 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 14.002-7.496 14.002-13.986 0-.21 0-.423-.015-.634A9.935 9.935 0 0024 4.557z" />
                  ) : i === 1 ? (
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  ) : (
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  )}
                </svg>
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-base font-bold text-white">Navigation</h4>
          <ul className="mt-6 flex flex-col gap-4">
            {FOOTER_NAV.map(item => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={(e) => handleScrollTo(e, item.href)}
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-base font-bold text-white">Community</h4>
          <ul className="mt-6 flex flex-col gap-4">
            {FOOTER_COMMUNITY.map(item => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={(e) => handleScrollTo(e, item.href)}
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-base font-bold text-white">Location</h4>
          <div className="mt-6 flex flex-col gap-5">
            <div className="flex gap-3">
              <MapPin size={16} className="mt-1 shrink-0 text-blue-500" />
              <p className="text-sm leading-relaxed text-slate-400">
                Adama Science and Technology University,
                <br />
                Adama, Ethiopia
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="shrink-0 text-purple-500" />
              <a href="mailto:contact@focusastu.org" className="text-sm text-slate-400 transition-colors hover:text-white">
                contact@focusastu.org
              </a>
            </div>
          </div>
        </div>
      </div>

      <p className="pt-10 text-center text-xs font-normal uppercase tracking-[0.1em] text-slate-500">
        &copy; {new Date().getFullYear()} Focus ASTU Fellowship. All rights reserved.
      </p>
    </div>
  </footer>
)

"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  CheckCircle,
  Shield,
  ArrowRight,
} from "lucide-react"
import { Logo } from "@/components/ui"

const DEFAULT_EMAIL = "email@astu.edu.et"

export default function VerificationSuccessPage() {
  const searchParams = useSearchParams()
  const emailFromUrl = searchParams.get("email")
  const displayEmail = emailFromUrl || DEFAULT_EMAIL

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-slate-50 px-4 py-12 sm:justify-center sm:px-6 sm:py-8 overflow-y-auto">
      {/* Abstract background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-blue-600/10 blur-[64px]" />
        <div className="absolute -bottom-16 -right-16 h-[512px] w-[512px] rounded-full bg-violet-200/20 blur-[64px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Card */}
        <div className="overflow-hidden rounded-xl bg-white shadow-lg shadow-blue-500/30">
          {/* Hero visual section */}
          <div className="relative flex h-48 items-center justify-center overflow-hidden bg-blue-600 sm:h-64">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15)_0%,transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
            </div>

            {/* Floating badges */}
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

            {/* Celebratory icon */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg sm:h-24 sm:w-24">
              <Shield className="h-10 w-10 text-blue-600 sm:h-12 sm:w-12" />
            </div>
          </div>

          {/* Content section */}
          <div className="flex flex-col items-center px-6 py-10 sm:px-12 sm:py-12">
            <h1 className="text-center text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
              Email Verified &amp;<br />Pending Review
            </h1>

            {emailFromUrl && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">{displayEmail}</span>
              </div>
            )}

            <p className="mt-5 max-w-sm text-center text-sm leading-relaxed text-slate-500 sm:text-base sm:leading-relaxed">
              Your account will now be reviewed by our admin. You will receive a final confirmation email once your account has been fully approved.
            </p>

            {/* Primary action */}
            <Link
              href="/"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-700 hover:to-blue-600 hover:shadow-xl hover:shadow-blue-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98] sm:text-base"
              tabIndex={0}
              aria-label="Return to Home"
            >
              Return to Home
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>

            {/* Support link */}
            <p className="mt-10 text-center text-xs text-slate-400 sm:text-sm">
              Having trouble?{" "}
              <Link
                href="/support"
                className="font-medium text-slate-500 underline transition-colors hover:text-slate-700"
                tabIndex={0}
                aria-label="Contact Support"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>

        {/* Branding anchor */}
        <div className="mt-6 flex items-center justify-center">
          <Logo variant="full" size="sm" />
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-12 flex w-full max-w-5xl flex-col items-center gap-4 border-t border-slate-100 bg-slate-50 px-4 pt-8 sm:flex-row sm:justify-between sm:px-8">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <Logo variant="full" size="sm" />
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Focus ASTU Fellowship. All Rights Reserved.
          </p>
        </div>
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
      </footer>
    </main>
  )
}

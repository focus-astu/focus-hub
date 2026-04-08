"use client"

import { useState } from "react"
import Image from "next/image"
import { Menu, X, ChevronRight, MapPin, Mail, Users, BookOpen, Mic2, Shield, Heart, Loader2 } from "lucide-react"
import { Logo } from "@/components/ui"

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Teams", href: "#teams" },
  { label: "Updates", href: "#updates" },
  { label: "Donate", href: "#donate" },
]

const TEAMS = [
  {
    name: "Action Team",
    description: "Serving behind the scenes to coordinate events and maintain the fellowship's logistical excellence.",
    color: "#2563EB",
    bgColor: "bg-blue-600",
    icon: Users,
  },
  {
    name: "Choir",
    description: "Leading the congregation into the presence of God through passionate worship and vocal excellence.",
    color: "#7C3AED",
    bgColor: "bg-purple-600",
    icon: Mic2,
  },
  {
    name: "Prayer Team",
    description: "The spiritual backbone of our fellowship, dedicated to intercession and spiritual warfare for the campus.",
    color: "#14B8A6",
    bgColor: "bg-teal-500",
    icon: BookOpen,
  },
  {
    name: "Digital Strategy",
    description: "Utilizing modern technology and media to spread the gospel and keep our community connected.",
    color: "#F59E0B",
    bgColor: "bg-amber-500",
    icon: Shield,
  },
]

const TAGS = ["Nathaniem", "Bible Study", "Counselor", "Literature", "Drama & Arts"]

const UPDATES = [
  {
    category: "Prayer",
    categoryColor: "text-blue-600",
    bgTint: "bg-blue-50",
    title: "Monday Morning Prayer",
    description: "Start your week in the presence of God. Join us every Monday from 12 AM - 2 AM for an intense…",
  },
  {
    category: "Fellowship",
    categoryColor: "text-purple-600",
    bgTint: "bg-purple-50",
    title: "Regular Focus Program",
    description: "Our main weekly gathering! Join us every Friday Night for worship, teaching, and powerful…",
  },
  {
    category: "Worship",
    categoryColor: "text-amber-600",
    bgTint: "bg-amber-50",
    title: "Choir Fellowship",
    description: "Deepening our craft for His glory. A special session dedicated to Songwriting & Worship…",
  },
]

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

/* ───────────────────────── Header ───────────────────────── */

const HEADER_HEIGHT = 64

const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  if (!href.startsWith("#")) return
  e.preventDefault()
  const target = document.querySelector(href)
  if (!target) return
  const top = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT
  window.scrollTo({ top, behavior: "smooth" })
}

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <a href="/" aria-label="Focus ASTU Home">
          <Logo variant="full" size="sm" />
        </a>

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

/* ───────────────────────── Hero ───────────────────────── */

const HeroSection = () => (
  <section className="overflow-hidden bg-white px-6 py-24 lg:px-8 lg:py-32">
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:gap-12">
      <div className="flex flex-1 flex-col gap-6">
        <h1 className="text-3xl font-black leading-[1.1em] tracking-tight text-slate-900 sm:text-5xl lg:text-7xl">
          Building
          <br />
          Spiritually
          <br />
          Strong and
          <br />
          Purpose-Driven
          <br />
          Students
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-slate-600 lg:text-xl">
          A Christ-centered student fellowship at Adama Science and Technology University dedicated to nurturing faith, leadership, and academic excellence.
        </p>
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap sm:gap-4">
          <a
            href="/signup"
            className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-4 text-center text-base font-bold text-white shadow-lg shadow-black/10 transition-shadow hover:shadow-xl sm:text-lg"
          >
            Join the Community
          </a>
          <a
            href="/login"
            className="rounded-3xl border-2 border-slate-200 px-8 py-4 text-center text-base font-bold text-slate-900 transition-colors hover:border-slate-300 hover:bg-slate-50 sm:text-lg"
          >
            Login
          </a>
        </div>
      </div>

      <div className="relative flex-1">
        <div className="absolute -inset-4 rounded-3xl bg-indigo-500/20 blur-[40px]" />
        <div className="relative overflow-hidden rounded-2xl border-4 border-white shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
            alt="Students in fellowship"
            width={584}
            height={576}
            className="h-auto w-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  </section>
)

/* ───────────────────────── About ───────────────────────── */

const AboutSection = () => (
  <section id="about" className="bg-[#FDF4F0] px-6 py-24 lg:px-8">
    <div className="mx-auto max-w-4xl text-center">
      <p className="text-sm font-bold uppercase tracking-[0.1em] text-indigo-600">
        Our Mission
      </p>
      <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-4xl">
        About Our Fellowship
      </h2>
      <p className="mt-6 text-lg leading-loose text-slate-700 lg:text-xl">
        Focus ASTU is committed to nurturing a community where students grow spiritually while pursuing academic excellence. We believe in building a generation that leads with purpose, integrity, and faith. Through discipleship, fellowship, and outreach, we empower students to be light in their campus and beyond.
      </p>
    </div>
  </section>
)

/* ───────────────────────── Ministry Teams ───────────────────────── */

const TeamsSection = () => (
  <section id="teams" className="bg-white px-6 py-24 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
          Ministry Teams
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base text-slate-600">
          Discover where you can serve and grow within our fellowship.
        </p>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {TEAMS.map(team => (
          <div
            key={team.name}
            className="rounded-2xl bg-[#F8FAFC] p-8 transition-shadow hover:shadow-lg"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-3xl ${team.bgColor} shadow-lg`}
              style={{ boxShadow: `0 10px 15px -3px ${team.color}33` }}
            >
              <team.icon size={26} className="text-white" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-slate-900">{team.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{team.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-4">
        {TAGS.map(tag => (
          <span
            key={tag}
            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </section>
)

/* ───────────────────────── Donate ───────────────────────── */

const PRESET_AMOUNTS = [25, 50, 100, 200]

const DonateSection = () => {
  const [amount, setAmount] = useState("50")
  const [showDetails, setShowDetails] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDonate = async () => {
    const numAmount = parseFloat(amount)
    if (!numAmount || numAmount < 1) {
      setError("Please enter a valid amount (min 1 ETB)")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/v1/donations/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numAmount,
          ...(firstName && { firstName }),
          ...(email && { email }),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        const msg = typeof data.error === "string" ? data.error : "Something went wrong. Please try again."
        setError(msg)
        return
      }

      window.location.href = data.checkoutUrl
    } catch {
      setError("Connection error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="donate"
      className="relative overflow-hidden px-6 py-24 lg:px-8"
      style={{ background: "linear-gradient(173deg, #1D4ED8 0%, #3730A3 50%, #1E1B4B 100%)" }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{ background: "radial-gradient(circle at 30% 20%, #fff 0%, transparent 50%)" }}
      />
      <div className="relative mx-auto max-w-xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-sm">
          <Heart className="h-4 w-4 text-pink-300" />
          <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Give generously</span>
        </div>

        <h2 className="text-2xl font-black text-white sm:text-4xl lg:text-5xl">
          Support Our Mission
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-blue-200 sm:text-base lg:text-lg">
          Your contributions help us reach more students, host impactful conferences, and shape future leaders.
        </p>

        <div className="mx-auto mt-8 max-w-sm">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-indigo-300">ETB</span>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError("") }}
              className="w-full rounded-2xl border-2 border-white/20 bg-white/10 py-4 pl-16 pr-4 text-center text-3xl font-black text-white placeholder:text-white/30 backdrop-blur-sm transition-all focus:border-white/50 focus:bg-white/15 focus:outline-none sm:text-4xl"
              placeholder="50"
              aria-label="Donation amount in ETB"
            />
          </div>

          <div className="mt-3 flex justify-center gap-2">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => { setAmount(String(preset)); setError("") }}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                  amount === String(preset)
                    ? "bg-white text-indigo-900 shadow-lg"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
                tabIndex={0}
                aria-label={`Set amount to ${preset} ETB`}
              >
                {preset}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="mt-4 text-xs font-semibold text-blue-300 transition-colors hover:text-white"
            tabIndex={0}
            aria-expanded={showDetails}
          >
            {showDetails ? "Hide details" : "Add your details (optional)"}
          </button>

          {showDetails && (
            <div className="mt-3 flex flex-col gap-2.5">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Your name"
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 backdrop-blur-sm transition-all focus:border-white/40 focus:outline-none"
                aria-label="First name"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 backdrop-blur-sm transition-all focus:border-white/40 focus:outline-none"
                aria-label="Email address"
              />
            </div>
          )}

          {error && (
            <p className="mt-3 text-sm font-medium text-red-300" role="alert">{error}</p>
          )}

          <button
            type="button"
            onClick={handleDonate}
            disabled={loading}
            className="mt-6 w-full rounded-3xl bg-white px-10 py-4 text-lg font-black text-indigo-900 shadow-2xl transition-all hover:bg-blue-50 hover:shadow-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-800 active:scale-[0.98] disabled:opacity-60 sm:text-xl"
            tabIndex={0}
            aria-label="Donate now"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing…
              </span>
            ) : (
              "Donate Now"
            )}
          </button>

          <p className="mt-4 text-[11px] text-blue-300/60">
            Powered by Chapa &middot; Secure payment
          </p>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Latest Updates ───────────────────────── */

const UpdatesSection = () => (
  <section id="updates" className="bg-[#F8FAFC] px-6 py-24 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
            Latest Updates
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Stay informed about our journey and upcoming events.
          </p>
        </div>
        <a
          href="#"
          className="flex items-center gap-2 text-base font-bold text-indigo-600 transition-colors hover:text-indigo-700"
        >
          View all news
          <ChevronRight size={16} />
        </a>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {UPDATES.map(update => (
          <article
            key={update.title}
            className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`h-52 ${update.bgTint}`} />
            <div className="flex flex-col gap-2 p-6">
              <span className={`text-xs font-bold uppercase tracking-[0.05em] ${update.categoryColor}`}>
                {update.category}
              </span>
              <h3 className="text-xl font-bold text-slate-900">{update.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{update.description}</p>
              <a
                href="#"
                className="mt-4 flex items-center gap-1 text-sm font-bold text-slate-900 transition-colors hover:text-blue-600"
              >
                Read More
                <ChevronRight size={14} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
)

/* ───────────────────────── Join CTA ───────────────────────── */

const JoinCTASection = () => (
  <section className="bg-white px-6 py-24 lg:px-8">
    <div
      className="mx-auto max-w-7xl rounded-3xl border border-indigo-200 px-6 py-16 text-center sm:px-8 sm:py-20 lg:px-20"
      style={{ background: "linear-gradient(173deg, #EEF2FF 0%, #FAF5FF 100%)" }}
    >
      <h2 className="mx-auto max-w-4xl text-2xl font-black text-slate-900 sm:text-4xl lg:text-6xl">
        Become Part of Something Greater
      </h2>
      <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:mt-8 sm:text-lg lg:text-2xl">
        Your journey at ASTU doesn&apos;t have to be walked alone. Join a community that supports your faith and your future.
      </p>
      <a
        href="/signup"
        className="mt-8 inline-block rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-4 text-base font-black text-white shadow-lg shadow-black/10 transition-shadow hover:shadow-xl sm:mt-10 sm:px-12 sm:py-5 sm:text-xl"
      >
        Get Involved Today
      </a>
    </div>
  </section>
)

/* ───────────────────────── Footer ───────────────────────── */

const Footer = () => (
  <footer className="bg-[#020617] px-6 py-16 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-12 border-b border-slate-800 pb-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Col 1 */}
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

        {/* Col 2 — Navigation */}
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

        {/* Col 3 — Community */}
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

        {/* Col 4 — Location */}
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

/* ───────────────────────── Page ───────────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFDFF]">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <TeamsSection />
        <DonateSection />
        <UpdatesSection />
        <JoinCTASection />
      </main>
      <Footer />
    </div>
  )
}

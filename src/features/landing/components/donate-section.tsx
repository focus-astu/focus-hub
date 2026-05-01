"use client"

import { useState } from "react"
import { Heart, Loader2 } from "lucide-react"

const PRESET_AMOUNTS = [25, 50, 100, 200]

export const DonateSection = () => {
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

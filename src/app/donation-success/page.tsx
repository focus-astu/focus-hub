"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Heart, ArrowLeft, BookOpen } from "lucide-react"

const VERSES = [
  {
    text: "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.",
    ref: "2 Corinthians 9:7",
  },
  {
    text: "A generous person will prosper; whoever refreshes others will be refreshed.",
    ref: "Proverbs 11:25",
  },
]

const DonationSuccessContent = () => {
  const searchParams = useSearchParams()
  const txRef = searchParams.get("tx_ref")

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(165deg, #1D4ED8 0%, #3730A3 40%, #1E1B4B 100%)" }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{ background: "radial-gradient(circle at 60% 30%, #fff 0%, transparent 50%)" }}
      />

      <div className="relative z-10 mx-auto w-full max-w-lg">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/25">
            <Heart className="h-10 w-10 text-white" fill="white" />
          </div>

          <h1 className="text-2xl font-black text-white sm:text-3xl">
            Thank You for Your Generosity!
          </h1>
          <p className="mt-3 text-blue-200">
            Your generosity helps spread the word of God across campus and beyond.
            May He bless you abundantly for sowing into His kingdom.
          </p>

          {txRef && (
            <p className="mt-4 inline-block rounded-lg bg-white/10 px-4 py-2 font-mono text-xs text-blue-300">
              Reference: {txRef}
            </p>
          )}

          <div className="mt-8 space-y-6">
            {VERSES.map((verse) => (
              <div key={verse.ref} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <BookOpen className="mx-auto mb-3 h-5 w-5 text-amber-300" />
                <blockquote className="text-sm italic leading-relaxed text-blue-100 sm:text-base">
                  &ldquo;{verse.text}&rdquo;
                </blockquote>
                <cite className="mt-2 block text-xs font-bold not-italic text-amber-300">
                  — {verse.ref}
                </cite>
              </div>
            ))}
          </div>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3 text-sm font-bold text-indigo-900 shadow-xl transition-all hover:bg-blue-50 hover:shadow-2xl active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-blue-300/50">
          Focus ASTU Fellowship &middot; Transforming campus for Christ
        </p>
      </div>
    </div>
  )
}

const DonationSuccessPage = () => (
  <Suspense fallback={
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: "linear-gradient(165deg, #1D4ED8 0%, #3730A3 40%, #1E1B4B 100%)" }}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
    </div>
  }>
    <DonationSuccessContent />
  </Suspense>
)

export default DonationSuccessPage

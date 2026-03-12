import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Focus Hub — Authentication",
    description: "Sign in or create your Focus Hub account",
}

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex min-h-screen">
            {/* Left Hero Panel */}
            <div className="relative hidden w-[55%] overflow-hidden lg:flex lg:flex-col lg:items-center lg:justify-center">
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80')",
                    }}
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/80 to-slate-900/90" />
                {/* Subtle animated shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                <div className="relative z-10 flex max-w-lg flex-col items-center px-12 text-center">
                    {/* Logo with glow */}
                    <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-2xl shadow-blue-500/20 backdrop-blur-md">
                        <svg
                            className="h-10 w-10 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    </div>

                    <h1 className="mb-4 text-5xl font-extrabold leading-tight tracking-tight text-white">
                        Welcome Back to
                        <br />
                        <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                            Focus ASTU
                        </span>
                    </h1>

                    <p className="mb-10 max-w-sm text-base leading-relaxed text-slate-300">
                        A Christ-centered student fellowship at Adama Science and Technology
                        University. Connect, grow, and serve together.
                    </p>

                    {/* Stats row */}
                    <div className="flex gap-8 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-sm">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">500+</p>
                            <p className="text-xs text-slate-400">Members</p>
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">50+</p>
                            <p className="text-xs text-slate-400">Events</p>
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">4.9</p>
                            <p className="text-xs text-slate-400">Rating</p>
                        </div>
                    </div>

                    {/* Decorative dots */}
                    <div className="mt-10 flex gap-2">
                        <div className="h-2 w-8 rounded-full bg-blue-400/60" />
                        <div className="h-2 w-2 rounded-full bg-white/30" />
                        <div className="h-2 w-2 rounded-full bg-white/30" />
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="flex w-full flex-col items-center justify-center bg-white px-6 py-12 lg:w-[45%]">
                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    )
}

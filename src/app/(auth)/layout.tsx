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
        <div className="flex min-h-screen bg-[#F6F6F8]">
            {/* Left Hero Panel */}
            <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:items-center lg:justify-center">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80')",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#135BEC]/80 via-[#135BEC]/60 to-purple-600/70" />

                <div className="relative z-10 flex max-w-md flex-col items-center px-20 text-center">
                    <h1 className="mb-6 text-5xl font-black leading-tight tracking-tight text-white">
                        Welcome Back to
                        <br />
                        Focus ASTU
                    </h1>

                    <p className="max-w-sm text-lg font-medium leading-relaxed text-white/90">
                        A Christ-centered student fellowship at Adama Science and Technology
                        University. Connect, grow, and serve together.
                    </p>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="flex w-full flex-col items-center justify-center bg-white px-6 py-12 lg:w-1/2">
                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    )
}

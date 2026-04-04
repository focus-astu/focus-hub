import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Focus Hub — Verification",
    description: "Verify your Focus Hub account",
}

export default function VerifyLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return <>{children}</>
}

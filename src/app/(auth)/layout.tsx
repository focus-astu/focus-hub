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
    return <>{children}</>
}

import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/core/auth/infrastructure/config/auth"

export const metadata: Metadata = {
    title: "Focus Hub — Authentication",
    description: "Sign in or create your Focus Hub account",
}

export default async function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (session) {
        redirect("/dashboard")
    }

    return <>{children}</>
}

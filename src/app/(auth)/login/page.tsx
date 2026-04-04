"use client"

import dynamic from "next/dynamic"

const LoginForm = dynamic(() => import("@/features/auth/components/login-form").then(m => ({ default: m.LoginForm })), {
    ssr: false,
})

export default function LoginPage() {
    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div>
                <div className="mb-1 flex items-center gap-2 lg:hidden">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#135BEC] to-[#3B82F6]">
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    </div>
                    <span className="text-sm font-semibold text-[#135BEC]">Focus Hub</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
                    Login to Your Account
                </h1>
                <p className="mt-3 text-base text-[#64748B]">
                    Enter your credentials to access the portal.
                </p>
            </div>

            {/* Form */}
            <LoginForm />

            {/* Footer */}
            <p className="text-center text-xs text-slate-400">
                &copy; {new Date().getFullYear()} Focus ASTU Fellowship. All rights reserved.
            </p>
        </div>
    )
}

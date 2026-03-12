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
                <div className="mb-1 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 lg:hidden">
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    </div>
                    <span className="text-sm font-semibold text-blue-600 lg:hidden">Focus Hub</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                    Login to Your Account
                </h1>
                <p className="mt-2 text-sm text-slate-500">
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

"use client"

import dynamic from "next/dynamic"
import { CheckCircle } from "lucide-react"
import { AuthHeroBg } from "@/features/auth/components"
import { Logo } from "@/components/ui"

const SignupForm = dynamic(
    () => import("@/features/auth/components/signup-form").then(m => ({ default: m.SignupForm })),
    { ssr: false }
)

const features = [
    "Spiritual Growth & Mentorship",
    "Campus Fellowship & Events",
    "Biblical Teaching & Community",
]

export default function SignupPage() {
    return (
        <div className="flex h-screen bg-[#F6F6F8]">
            {/* Left Hero — fixed height, never scrolls */}
            <AuthHeroBg>
                <div className="relative z-10 flex flex-col gap-6 px-12">
                    <Logo variant="full" size="md" inverted />

                    <h1 className="text-5xl font-black leading-tight tracking-tight text-white">
                        Join the Focus ASTU
                        <br />
                        Family
                    </h1>

                    <p className="max-w-md text-lg font-medium leading-relaxed text-white/90">
                        A Christ-centered student fellowship at Adama Science and Technology
                        University. Connect, grow, and serve together.
                    </p>

                    <div className="mt-2 flex flex-col gap-4">
                        {features.map((text) => (
                            <div
                                key={text}
                                className="flex items-center gap-3 text-sm font-medium text-white"
                            >
                                <CheckCircle size={20} className="shrink-0 text-white/70" />
                                {text}
                            </div>
                        ))}
                    </div>
                </div>
            </AuthHeroBg>

            {/* Right Panel — only this side scrolls */}
            <div className="flex w-full flex-col bg-white lg:w-1/2">
                <div className="flex-1 overflow-y-auto">
                    <div className="mx-auto w-full max-w-lg px-4 py-12 sm:px-8 sm:py-20 lg:px-10">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                Create Your Account
                            </h2>
                            <p className="mt-2 text-base text-slate-500">
                                Fill in the details below to join our community.
                            </p>
                        </div>

                        <SignupForm />

                        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-[#135BEC]/10 bg-[#135BEC]/5 p-4">
                            <svg
                                className="mt-0.5 h-5 w-5 shrink-0 text-[#135BEC]"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                                />
                            </svg>
                            <p className="text-xs font-bold leading-relaxed text-slate-800">
                                <span className="font-extrabold">Important Notice:</span>{" "}
                                Your account will remain pending until approved by an Admin.
                                You will receive an email once your account is active.
                            </p>
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-2">
                            <span className="text-sm text-slate-500">
                                Already have an account?
                            </span>
                            <a
                                href="/login"
                                className="text-sm font-bold text-[#135BEC] hover:underline"
                            >
                                Login here
                            </a>
                        </div>
                    </div>
                </div>

                <div className="shrink-0 border-t border-slate-100 px-8 py-6">
                    <p className="text-center text-xs text-slate-400">
                        &copy; {new Date().getFullYear()} Focus ASTU Fellowship. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}

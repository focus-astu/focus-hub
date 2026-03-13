"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
    Mail,
    CheckCircle,
    XCircle,
    Loader2,
    RefreshCw,
    ArrowLeft,
} from "lucide-react";

// ---------- Types ----------
type VerifyState =
    | { status: "sent" }
    | { status: "verifying" }
    | { status: "success" }
    | { status: "error"; message: string };

// ---------- Resend sub-component ----------
function ResendForm({ initialEmail }: { initialEmail?: string }) {
    const [email, setEmail] = useState(initialEmail ?? "");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    async function handleResend(e: React.FormEvent) {
        e.preventDefault();
        if (!email) {
            setError("Please enter your email address.");
            return;
        }
        setSending(true);
        setError("");
        setSent(false);

        const { error: apiError } = await authClient.sendVerificationEmail({
            email,
            callbackURL: "/verify-email",
        });

        setSending(false);

        if (apiError) {
            setError(apiError.message ?? "Failed to resend. Please try again.");
        } else {
            setSent(true);
        }
    }

    return (
        <form onSubmit={handleResend} className="mt-4 w-full max-w-sm space-y-3">
            <label
                htmlFor="resend-email"
                className="block text-sm font-medium text-slate-700"
            >
                Email address
            </label>

            <div className="group relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500">
                    <Mail className="h-[18px] w-[18px]" />
                </span>
                <input
                    id="resend-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@astu.edu.et"
                    aria-label="Email address for verification resend"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
            </div>

            {error && (
                <p className="flex items-center gap-1.5 text-sm text-red-600" role="alert">
                    <XCircle className="h-3.5 w-3.5 shrink-0" />
                    {error}
                </p>
            )}
            {sent && (
                <p className="flex items-center gap-1.5 text-sm text-emerald-600">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                    Verification email sent! Check your inbox.
                </p>
            )}

            <button
                type="submit"
                disabled={sending}
                id="resend-verification-btn"
                className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
                {sending ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending…
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Resend Verification Email
                    </span>
                )}
            </button>
        </form>
    );
}

// ---------- Main page ----------
export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const [state, setState] = useState<VerifyState>({ status: "sent" });

    // Derive initial intent from URL
    const token = searchParams.get("token");
    const emailFromUrl = searchParams.get("email") ?? undefined;

    const verifyToken = useCallback(async (t: string) => {
        setState({ status: "verifying" });

        const { error } = await authClient.verifyEmail({
            query: { token: t },
        });

        if (error) {
            setState({
                status: "error",
                message:
                    error.message ??
                    "Invalid or expired verification link. Please request a new one.",
            });
        } else {
            setState({ status: "success" });
        }
    }, []);

    useEffect(() => {
        if (token) {
            verifyToken(token);
        } else {
            setState({ status: "sent" });
        }
    }, [token, verifyToken]);

    return (
        <div className="flex flex-col gap-8">
            {/* Header — logo shown on mobile only */}
            <div className="mb-1 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 lg:hidden">
                    <svg
                        className="h-5 w-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                </div>
                <span className="text-sm font-semibold text-blue-600 lg:hidden">
                    Focus Hub
                </span>
            </div>

            {/* ---- Sent state ---- */}
            {state.status === "sent" && (
                <div className="flex flex-col items-center text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 ring-8 ring-blue-50/50">
                        <Mail className="h-10 w-10 text-blue-600" />
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Check Your Email
                    </h1>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
                        We sent a verification link to your email. Please check
                        your inbox and click the link to verify your account.
                    </p>

                    <div className="mt-8 flex w-full flex-col items-center gap-2">
                        <p className="text-sm text-slate-400">
                            Didn&apos;t receive the email?
                        </p>
                        <ResendForm initialEmail={emailFromUrl} />
                    </div>

                    <Link
                        href="/login"
                        id="back-to-login-link"
                        className="mt-8 flex items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Login
                    </Link>
                </div>
            )}

            {/* ---- Verifying state ---- */}
            {state.status === "verifying" && (
                <div className="flex flex-col items-center text-center py-12">
                    <div className="mb-6">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Verifying Your Email
                    </h1>
                    <p className="mt-3 text-sm text-slate-500">
                        Please wait while we verify your email address…
                    </p>
                </div>
            )}

            {/* ---- Success state ---- */}
            {state.status === "success" && (
                <div className="flex flex-col items-center text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/50">
                        <CheckCircle className="h-10 w-10 text-emerald-600" />
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Email Verified!
                    </h1>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
                        Your email has been verified successfully. Your account
                        is now pending admin approval.
                    </p>

                    <Link
                        href="/pending-approval"
                        id="continue-to-pending-btn"
                        className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98]"
                    >
                        Continue
                    </Link>
                </div>
            )}

            {/* ---- Error state ---- */}
            {state.status === "error" && (
                <div className="flex flex-col items-center text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/50">
                        <XCircle className="h-10 w-10 text-red-500" />
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Verification Failed
                    </h1>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-red-500">
                        {state.message}
                    </p>

                    <div className="mt-6 flex w-full flex-col items-center gap-2">
                        <p className="text-sm text-slate-400">
                            Request a new verification link:
                        </p>
                        <ResendForm />
                    </div>

                    <Link
                        href="/login"
                        className="mt-8 flex items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Login
                    </Link>
                </div>
            )}

            {/* Footer */}
            <p className="text-center text-xs text-slate-400">
                &copy; {new Date().getFullYear()} Focus ASTU Fellowship. All
                rights reserved.
            </p>
        </div>
    );
}

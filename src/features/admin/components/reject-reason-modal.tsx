"use client"

import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"

type RejectReasonModalProps = {
  userName: string
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  isLoading: boolean
}

export const RejectReasonModal = ({
  userName,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: RejectReasonModalProps) => {
  const [reason, setReason] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen) {
      setReason("")
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm(reason)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-modal-title"
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close modal"
          tabIndex={0}
        >
          <X className="h-5 w-5" />
        </button>

        <h2
          id="reject-modal-title"
          className="text-lg font-bold text-slate-900"
        >
          Reject {userName}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Provide a reason for rejecting this user&apos;s account (optional).
        </p>

        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            ref={inputRef}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for rejection…"
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            aria-label="Rejection reason"
          />

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
              tabIndex={0}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-50"
              tabIndex={0}
            >
              {isLoading ? "Rejecting…" : "Reject User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

"use client"

import { useId } from "react"
import type { InputProps } from "./input.types"

export const Input = ({
  label,
  error,
  helperText,
  className = "",
  ...props
}: InputProps) => {
  const generatedId = useId()
  const inputId = props.id ?? generatedId
  const errorId = `${inputId}-error`
  const helperId = `${inputId}-helper`

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={`rounded-lg border px-3 py-2 text-sm transition-colors placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-zinc-300 dark:border-zinc-700"
        } ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      {helperText && !error ? (
        <p id={helperId} className="text-sm text-zinc-500">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}

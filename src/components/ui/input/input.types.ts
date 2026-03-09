import type { InputHTMLAttributes } from "react"

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  helperText?: string
}

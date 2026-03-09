import type { ButtonHTMLAttributes } from "react"

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger"
export type ButtonSize = "sm" | "md" | "lg"

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

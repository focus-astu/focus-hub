export type LogoVariant = "full" | "icon" | "text"

export type LogoSize = "sm" | "md" | "lg" | "xl"

export type LogoProps = {
  variant?: LogoVariant
  size?: LogoSize
  className?: string
  inverted?: boolean
}

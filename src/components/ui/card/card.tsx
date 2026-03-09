import type { HTMLAttributes } from "react"

type CardProps = HTMLAttributes<HTMLDivElement>

export const Card = ({ className = "", children, ...props }: CardProps) => (
  <div
    className={`rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 ${className}`}
    {...props}
  >
    {children}
  </div>
)

export const CardHeader = ({ className = "", children, ...props }: CardProps) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
)

export const CardTitle = ({ className = "", children, ...props }: CardProps) => (
  <h3 className={`text-lg font-semibold text-zinc-900 dark:text-zinc-100 ${className}`} {...props}>
    {children}
  </h3>
)

export const CardContent = ({ className = "", children, ...props }: CardProps) => (
  <div className={className} {...props}>
    {children}
  </div>
)

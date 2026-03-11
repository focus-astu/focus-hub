import type { ReactNode } from "react"

export const metadata = {
  title: "Focus Hub",
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-full bg-white overflow-hidden">
      {children}
    </div>
  )
}
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const AUTH_ROUTES = new Set(["/login", "/signup", "/forgot-password", "/reset-password"])

const isProtectedRoute = (pathname: string) =>
  pathname.startsWith("/dashboard") || pathname.startsWith("/admin")

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl

  const hasSession = !!(
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value
  )

  if (hasSession && AUTH_ROUTES.has(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (!hasSession && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

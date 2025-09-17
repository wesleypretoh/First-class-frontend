import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

import { DEFAULT_LOCALE } from "@/lib/i18n/config"
import { buildLocalizedPath, extractLocaleFromPathname } from "@/lib/i18n/routing"

const authRoutes = ["/", "/login", "/auth/login", "/signup"]

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  const { pathname } = req.nextUrl

  const { locale = DEFAULT_LOCALE, segments } = extractLocaleFromPathname(pathname)
  const relativePath = segments.length > 0 ? `/${segments.join("/")}` : "/"

  const isLoggedIn = !!token
  const isAuthRoute = authRoutes.includes(relativePath)
  const isApiAuthRoute = pathname.startsWith("/api/auth")

  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = buildLocalizedPath(locale, "dashboard")
      redirectUrl.search = ""

      return NextResponse.redirect(redirectUrl)
    }

    return NextResponse.next()
  }

  if (!isLoggedIn) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = buildLocalizedPath(locale, "login")
    redirectUrl.search = ""

    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

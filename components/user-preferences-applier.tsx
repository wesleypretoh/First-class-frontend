"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"

import {
  applyColorTheme,
  COLOR_THEME_STORAGE_KEY,
  DEFAULT_COLOR_THEME,
  resolveColorTheme,
} from "@/lib/color-theme"
import {
  DEFAULT_LANGUAGE_PREFERENCE,
  DEFAULT_THEME_PREFERENCE,
  resolveLanguagePreference,
  resolveThemePreference,
  type ThemePreference,
} from "@/lib/user-preferences"
import {
  buildPathnameFromSegments,
  extractLocaleFromPathname,
} from "@/lib/i18n/routing"

const AUTH_RESET_ROUTES = new Set(["/", "/login", "/signup"])

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

export function UserPreferencesApplier() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setTheme } = useTheme()

  const lastAppliedRef = React.useRef<{
    theme: ThemePreference
    color: string
    language: string
  }>({
    theme: DEFAULT_THEME_PREFERENCE,
    color: DEFAULT_COLOR_THEME,
    language: DEFAULT_LANGUAGE_PREFERENCE,
  })

  useIsomorphicLayoutEffect(() => {
    const { locale: currentLocale, segments } = extractLocaleFromPathname(
      pathname ?? "/",
    )
    const relativePath = segments.length > 0 ? `/${segments.join("/")}` : "/"
    const shouldReset = AUTH_RESET_ROUTES.has(relativePath)

    const applyDefaults = () => {
      if (lastAppliedRef.current.theme !== DEFAULT_THEME_PREFERENCE) {
        setTheme(DEFAULT_THEME_PREFERENCE)
      }

      if (lastAppliedRef.current.color !== DEFAULT_COLOR_THEME) {
        applyColorTheme(DEFAULT_COLOR_THEME)
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem("theme", DEFAULT_THEME_PREFERENCE)
        window.localStorage.setItem("color-theme", DEFAULT_COLOR_THEME)
        document.cookie = `${COLOR_THEME_STORAGE_KEY}=; path=/; max-age=0`
      }

      if (typeof document !== "undefined") {
        document.documentElement.lang = DEFAULT_LANGUAGE_PREFERENCE
      }

      lastAppliedRef.current = {
        theme: DEFAULT_THEME_PREFERENCE,
        color: DEFAULT_COLOR_THEME,
        language: DEFAULT_LANGUAGE_PREFERENCE,
      }
    }

    if (status === "loading") {
      return
    }

    if (status !== "authenticated") {
      applyDefaults()
      return
    }

    if (shouldReset) {
      applyDefaults()
      return
    }

    if (session?.user) {
      const resolvedTheme = resolveThemePreference(session.user.themePreference)
      const resolvedColor = resolveColorTheme(session.user.colorThemePreference)
      const resolvedLanguage = resolveLanguagePreference(
        session.user.languagePreference,
      )

      if (lastAppliedRef.current.theme !== resolvedTheme) {
        setTheme(resolvedTheme)
        lastAppliedRef.current.theme = resolvedTheme
      }

      if (lastAppliedRef.current.color !== resolvedColor) {
        applyColorTheme(resolvedColor)
        lastAppliedRef.current.color = resolvedColor
      }

      if (typeof document !== "undefined") {
        if (document.documentElement.lang !== resolvedLanguage) {
          document.documentElement.lang = resolvedLanguage
        }
        lastAppliedRef.current.language = resolvedLanguage
      }

      if (currentLocale !== resolvedLanguage) {
        const targetPath = buildPathnameFromSegments(resolvedLanguage, segments)
        const query = searchParams?.toString()
        const nextUrl = query ? `${targetPath}?${query}` : targetPath
        router.replace(nextUrl)
      }
    }
  }, [pathname, router, searchParams, session, setTheme, status])

  return null
}

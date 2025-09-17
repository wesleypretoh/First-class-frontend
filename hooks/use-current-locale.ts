"use client"

import { useMemo } from "react"
import { usePathname } from "next/navigation"

import { DEFAULT_LOCALE } from "@/lib/i18n/config"
import { extractLocaleFromPathname } from "@/lib/i18n/routing"

export function useCurrentLocale() {
  const pathname = usePathname()

  return useMemo(() => {
    if (!pathname) {
      return DEFAULT_LOCALE
    }

    const { locale } = extractLocaleFromPathname(pathname)
    return locale ?? DEFAULT_LOCALE
  }, [pathname])
}

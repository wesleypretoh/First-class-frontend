"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

import {
  applyColorThemeFromStorageValue,
  COLOR_THEME_STORAGE_KEY,
  initializeColorTheme,
} from "@/lib/color-theme"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  React.useEffect(() => {
    if (typeof window === "undefined") return

    initializeColorTheme()

    const handleStorage = (event: StorageEvent) => {
      if (event.key === COLOR_THEME_STORAGE_KEY) {
        applyColorThemeFromStorageValue(event.newValue)
      }
    }

    window.addEventListener("storage", handleStorage)

    return () => {
      window.removeEventListener("storage", handleStorage)
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

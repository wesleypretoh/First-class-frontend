"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  applyColorTheme,
  COLOR_THEME_OPTIONS,
  DEFAULT_COLOR_THEME,
  resolveInitialColorTheme,
  resolveColorTheme,
  type ColorThemeValue,
} from "@/lib/color-theme"

export function ColorThemeSelect() {
  const [mounted, setMounted] = React.useState(false)
  const [value, setValue] = React.useState<ColorThemeValue>(DEFAULT_COLOR_THEME)

  React.useEffect(() => {
    setMounted(true)

    const initial = resolveInitialColorTheme()
    setValue(initial)
  }, [])

  const handleChange = React.useCallback((next: string) => {
    const resolved = resolveColorTheme(next)
    setValue(resolved)
    applyColorTheme(resolved)
  }, [])

  if (!mounted) {
    return <div className="h-9 w-full rounded-md bg-muted" />
  }

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select color theme" />
      </SelectTrigger>
      <SelectContent>
        {COLOR_THEME_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

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

type ColorThemeSelectProps = {
  initialValue?: ColorThemeValue
  successMessage?: string
  errorMessage?: string
}

export function ColorThemeSelect({
  initialValue,
  successMessage,
  errorMessage,
}: ColorThemeSelectProps) {
  const { data: session, update } = useSession()
  const [mounted, setMounted] = React.useState(false)
  const [value, setValue] = React.useState<ColorThemeValue>(
    initialValue ?? DEFAULT_COLOR_THEME,
  )
  const [isPending, startTransition] = React.useTransition()

  React.useEffect(() => {
    const initial = initialValue ?? resolveInitialColorTheme()
    setValue(initial)
    setMounted(true)
  }, [initialValue])

  const updatePreferences = React.useCallback(async (payload: { colorTheme: ColorThemeValue }) => {
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error("color-theme-update-failed")
    }
  }, [])

  const handleChange = React.useCallback(
    (next: string) => {
      const resolved = resolveColorTheme(next)

      if (resolved === value) {
        return
      }

      const previous = value
      setValue(resolved)
      applyColorTheme(resolved)

      startTransition(() => {
        toast.promise(
          (async () => {
            await updatePreferences({ colorTheme: resolved })
            if (update) {
              await update({
                user: {
                  ...(session?.user ?? {}),
                  colorThemePreference: resolved,
                },
              })
            }

            return resolved
          })(),
          {
            loading: "Saving color theme…",
            success: (savedValue) => {
              const label =
                COLOR_THEME_OPTIONS.find((option) => option.value === savedValue)?.label ??
                savedValue
              if (successMessage) {
                return `${successMessage}${successMessage.endsWith(".") ? "" : ":"} ${label}`
              }

              return `Accent updated: ${label}`
            },
            error: () => {
              setValue(previous)
              applyColorTheme(previous)
              return errorMessage ?? "Unable to update color theme"
            },
          },
        )
      })
    },
    [errorMessage, session?.user, successMessage, update, updatePreferences, value],
  )

  if (!mounted) {
    return <div className="h-9 w-full rounded-md bg-muted" />
  }

  return (
    <Select value={value} onValueChange={handleChange} disabled={isPending}>
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

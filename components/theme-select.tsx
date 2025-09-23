"use client"

import * as React from "react"
import { useTheme } from "next-themes"
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
  DEFAULT_THEME_PREFERENCE,
  THEME_OPTIONS,
  type ThemePreference,
} from "@/lib/user-preferences"

type ThemeSelectProps = {
  initialValue?: ThemePreference
  successMessage?: string
  errorMessage?: string
}

export function ThemeSelect({ initialValue, successMessage, errorMessage }: ThemeSelectProps) {
  const { data: session, update } = useSession()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()
  const [selectedTheme, setSelectedTheme] = React.useState<ThemePreference>(
    () =>
      ((theme as ThemePreference | null) ?? initialValue ?? DEFAULT_THEME_PREFERENCE) as ThemePreference,
  )
  const hasAppliedInitial = React.useRef(false)

  const updatePreferences = React.useCallback(async (payload: { theme: ThemePreference }) => {
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error("theme-update-failed")
    }
  }, [])

  const handleChange = React.useCallback(
    (next: ThemePreference) => {
      const previous = selectedTheme

      if (next === previous) {
        return
      }

      setSelectedTheme(next)
      setTheme(next)

      startTransition(() => {
        toast.promise(
          (async () => {
            await updatePreferences({ theme: next })
            if (update) {
              await update({
                user: {
                  ...(session?.user ?? {}),
                  themePreference: next,
                },
              })
            }

            return next
          })(),
          {
            loading: "Saving theme…",
            success: (resolvedTheme) => {
              const label =
                THEME_OPTIONS.find((option) => option.value === resolvedTheme)?.label ??
                resolvedTheme
              if (successMessage) {
                return `${successMessage}${successMessage.endsWith(".") ? "" : ":"} ${label}`
              }

              return `Theme updated: ${label}`
            },
            error: () => {
              setTheme(previous)
              return errorMessage ?? "Unable to update theme"
            },
          },
        )
      })
    },
    [errorMessage, session?.user, setTheme, successMessage, update, updatePreferences, selectedTheme],
  )

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!mounted || hasAppliedInitial.current) {
      return
    }

    if (initialValue) {
      setTheme(initialValue)
      setSelectedTheme(initialValue)
    }

    hasAppliedInitial.current = true
  }, [initialValue, mounted, setTheme])

  React.useEffect(() => {
    if (!mounted) {
      return
    }

    setSelectedTheme(
      ((theme as ThemePreference | null) ?? selectedTheme ?? DEFAULT_THEME_PREFERENCE) as ThemePreference,
    )
  }, [mounted, theme])

  if (!mounted) {
    return <div className="h-9 w-full rounded-md bg-muted" />
  }

  return (
    <Select
      value={selectedTheme}
      onValueChange={(value) => handleChange(value as ThemePreference)}
      disabled={isPending}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select theme" />
      </SelectTrigger>
      <SelectContent>
        {THEME_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

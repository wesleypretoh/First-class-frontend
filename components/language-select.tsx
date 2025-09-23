"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"
import { toast } from "sonner"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/get-dictionary"
import {
  buildPathnameFromSegments,
  extractLocaleFromPathname,
} from "@/lib/i18n/routing"
import { cn } from "@/lib/utils"

const LOCALE_VALUES = new Set<Locale>(SUPPORTED_LOCALES)

const resolveLocale = (value: string): Locale =>
  LOCALE_VALUES.has(value as Locale) ? (value as Locale) : DEFAULT_LOCALE

type LanguageSelectProps = {
  dictionary: Dictionary
  triggerClassName?: string
  successMessage?: string
  errorMessage?: string
}

export function LanguageSelect({
  dictionary,
  triggerClassName,
  successMessage,
  errorMessage,
}: LanguageSelectProps) {
  const { data: session, status, update } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = React.useTransition()

  const { locale: currentLocale, segments } = React.useMemo(
    () => extractLocaleFromPathname(pathname ?? "/"),
    [pathname],
  )

  const options = React.useMemo(
    () =>
      SUPPORTED_LOCALES.map((locale) => ({
        value: locale,
        label: dictionary.languageNames[locale] ?? locale,
      })),
    [dictionary],
  )

  const persistPreference = React.useCallback(async (language: Locale) => {
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ language }),
    })

    if (!response.ok) {
      throw new Error("language-update-failed")
    }

    return language
  }, [])

  const handleChange = React.useCallback(
    (next: string) => {
      const normalized = resolveLocale(next)

      if (normalized === currentLocale) {
        return
      }

      const targetPath = buildPathnameFromSegments(normalized, segments)
      const query = searchParams?.toString()
      const nextUrl = query ? `${targetPath}?${query}` : targetPath
      const label = dictionary.languageNames[normalized] ?? normalized

      if (status !== "authenticated") {
        if (typeof document !== "undefined") {
          document.documentElement.lang = normalized
        }
        if (successMessage) {
          toast.success(
            `${successMessage}${successMessage.endsWith(".") ? "" : ":"} ${label}`,
          )
        }

        router.replace(nextUrl)
        return
      }

      startTransition(() => {
        toast.promise(
          (async () => {
            await persistPreference(normalized)

            if (update) {
              await update({
                user: {
                  ...(session?.user ?? {}),
                  languagePreference: normalized,
                },
              })
            }

            return normalized
          })(),
          {
            loading: "Saving language…",
            success: (savedLocale) => {
              const successLabel =
                dictionary.languageNames[savedLocale] ?? savedLocale

              if (typeof document !== "undefined") {
                document.documentElement.lang = savedLocale
              }

              router.replace(nextUrl)

              return successMessage
                ? `${successMessage}${successMessage.endsWith(".") ? "" : ":"} ${successLabel}`
                : `Language updated: ${successLabel}`
            },
            error: () => errorMessage ?? "Unable to update language",
          },
        )
      })
    },
    [
      currentLocale,
      dictionary.languageNames,
      errorMessage,
      persistPreference,
      router,
      searchParams,
      segments,
      session?.user,
      status,
      successMessage,
      update,
    ],
  )

  return (
    <Select
      value={currentLocale}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger className={cn("h-9", triggerClassName)}>
        <SelectValue
          placeholder={
            dictionary.languageNames[currentLocale] ?? "Select language"
          }
        />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

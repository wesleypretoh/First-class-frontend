"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

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

type LanguageSelectProps = {
  dictionary: Dictionary
  triggerClassName?: string
}

export function LanguageSelect({ dictionary, triggerClassName }: LanguageSelectProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

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

  const handleChange = React.useCallback(
    (next: string) => {
      const normalized = SUPPORTED_LOCALES.includes(next as Locale)
        ? (next as Locale)
        : DEFAULT_LOCALE

      const targetPath = buildPathnameFromSegments(normalized, segments)
      const query = searchParams?.toString()
      const url = query ? `${targetPath}?${query}` : targetPath

      router.replace(url)
    },
    [router, searchParams, segments],
  )

  return (
    <Select value={currentLocale} onValueChange={handleChange}>
      <SelectTrigger className={cn("h-9", triggerClassName)}>
        <SelectValue placeholder={dictionary.languageNames[currentLocale] ?? "Select language"} />
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

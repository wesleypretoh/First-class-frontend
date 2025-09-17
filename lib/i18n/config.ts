export const SUPPORTED_LOCALES = ["en", "th"] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "en"

export function isLocale(input: string | undefined | null): input is Locale {
  return !!input && SUPPORTED_LOCALES.includes(input as Locale)
}

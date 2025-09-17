import { DEFAULT_LOCALE, type Locale, isLocale } from "./config"

export function extractLocaleFromPathname(pathname: string): {
  locale: Locale
  segments: string[]
} {
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length === 0) {
    return { locale: DEFAULT_LOCALE, segments: [] }
  }

  const [maybeLocale, ...rest] = segments

  if (isLocale(maybeLocale)) {
    return { locale: maybeLocale, segments: rest }
  }

  return { locale: DEFAULT_LOCALE, segments }
}

export function buildPathnameFromSegments(locale: Locale, segments: string[]): string {
  const cleanedSegments = segments.filter(Boolean)

  if (locale === DEFAULT_LOCALE) {
    if (cleanedSegments.length === 0) {
      return "/"
    }
    return `/${cleanedSegments.join("/")}`
  }

  return `/${[locale, ...cleanedSegments].join("/")}`
}

export function buildLocalizedPath(locale: Locale, relativePath: string): string {
  const segments = relativePath.split("/").filter(Boolean)
  return buildPathnameFromSegments(locale, segments)
}

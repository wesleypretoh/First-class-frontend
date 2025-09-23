import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/config"
import { COLOR_THEME_STORAGE_KEY, DEFAULT_COLOR_THEME } from "@/lib/color-theme"

export const THEME_OPTIONS = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const

export type ThemePreference = (typeof THEME_OPTIONS)[number]["value"]

export const DEFAULT_THEME_PREFERENCE: ThemePreference = "system"

const THEME_VALUES = new Set<ThemePreference>(THEME_OPTIONS.map((option) => option.value))

export const isThemePreference = (value: unknown): value is ThemePreference =>
  typeof value === "string" && THEME_VALUES.has(value as ThemePreference)

export const resolveThemePreference = (value: unknown): ThemePreference =>
  (isThemePreference(value) ? value : DEFAULT_THEME_PREFERENCE)

export type LanguagePreference = Locale

export const LANGUAGE_PREFERENCE_OPTIONS = SUPPORTED_LOCALES.map((locale) => ({
  value: locale,
}))

export const DEFAULT_LANGUAGE_PREFERENCE: LanguagePreference = DEFAULT_LOCALE

const LANGUAGE_VALUES = new Set<LanguagePreference>(SUPPORTED_LOCALES)

export const isLanguagePreference = (value: unknown): value is LanguagePreference =>
  typeof value === "string" && LANGUAGE_VALUES.has(value as LanguagePreference)

export const resolveLanguagePreference = (value: unknown): LanguagePreference =>
  (isLanguagePreference(value) ? (value as LanguagePreference) : DEFAULT_LANGUAGE_PREFERENCE)

export const resetClientPreferences = () => {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem("theme", DEFAULT_THEME_PREFERENCE)
  window.localStorage.setItem("color-theme", DEFAULT_COLOR_THEME)
  document.cookie = `${COLOR_THEME_STORAGE_KEY}=; path=/; max-age=0`

  if (typeof document !== "undefined") {
    document.documentElement.classList.remove("dark")
    document.documentElement.classList.remove("light")
    document.documentElement.dataset.theme = DEFAULT_THEME_PREFERENCE
    if (DEFAULT_COLOR_THEME === "neutral") {
      delete document.documentElement.dataset.colorTheme
    } else {
      document.documentElement.dataset.colorTheme = DEFAULT_COLOR_THEME
    }
    document.documentElement.lang = DEFAULT_LANGUAGE_PREFERENCE
  }
}

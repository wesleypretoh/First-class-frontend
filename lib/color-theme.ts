const COLOR_THEME_STORAGE_KEY = "color-theme" as const
const COLOR_THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

const COLOR_THEME_OPTIONS = [
  { value: "neutral", label: "Neutral" },
  { value: "apricot", label: "Apricot" },
] as const

type ColorThemeOption = (typeof COLOR_THEME_OPTIONS)[number]
type ColorThemeValue = ColorThemeOption["value"]

const DEFAULT_COLOR_THEME: ColorThemeValue = "neutral"

const COLOR_THEME_VALUES = new Set<ColorThemeValue>(
  COLOR_THEME_OPTIONS.map((option) => option.value),
)

const resolveColorTheme = (value: string | null | undefined): ColorThemeValue =>
  value && COLOR_THEME_VALUES.has(value as ColorThemeValue)
    ? (value as ColorThemeValue)
    : DEFAULT_COLOR_THEME

const setDocumentColorTheme = (value: ColorThemeValue) => {
  if (typeof document === "undefined") return

  const root = document.documentElement

  if (value === DEFAULT_COLOR_THEME) {
    delete root.dataset.colorTheme
  } else {
    root.dataset.colorTheme = value
  }
}

const getColorThemeCookie = () => {
  if (typeof document === "undefined") return null

  const match = document.cookie.match(
    new RegExp(String.raw`(?:^|;\s*)${COLOR_THEME_STORAGE_KEY}=([^;]*)`),
  )

  return match ? decodeURIComponent(match[1]) : null
}

const setColorThemeCookie = (value: ColorThemeValue) => {
  if (typeof document === "undefined") return

  document.cookie = `${COLOR_THEME_STORAGE_KEY}=${encodeURIComponent(value)}; path=/; max-age=${COLOR_THEME_COOKIE_MAX_AGE}; SameSite=Lax`
}

const resolveInitialColorTheme = (): ColorThemeValue => {
  if (typeof document !== "undefined") {
    const datasetValue = document.documentElement.dataset.colorTheme

    if (datasetValue) {
      return resolveColorTheme(datasetValue)
    }
  }

  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(COLOR_THEME_STORAGE_KEY)

    if (stored) {
      return resolveColorTheme(stored)
    }
  }

  const cookieValue = getColorThemeCookie()

  return resolveColorTheme(cookieValue)
}

const applyColorTheme = (value: ColorThemeValue) => {
  setDocumentColorTheme(value)

  if (typeof window !== "undefined") {
    window.localStorage.setItem(COLOR_THEME_STORAGE_KEY, value)
  }

  setColorThemeCookie(value)
}

const initializeColorTheme = (): ColorThemeValue => {
  const resolved = resolveInitialColorTheme()

  setDocumentColorTheme(resolved)

  if (typeof window !== "undefined") {
    window.localStorage.setItem(COLOR_THEME_STORAGE_KEY, resolved)
  }

  setColorThemeCookie(resolved)

  return resolved
}

const applyColorThemeFromStorageValue = (value: string | null | undefined) => {
  const resolved = resolveColorTheme(value)

  setDocumentColorTheme(resolved)
  setColorThemeCookie(resolved)
}

export {
  applyColorTheme,
  applyColorThemeFromStorageValue,
  COLOR_THEME_OPTIONS,
  COLOR_THEME_STORAGE_KEY,
  DEFAULT_COLOR_THEME,
  resolveInitialColorTheme,
  initializeColorTheme,
  resolveColorTheme,
}

export type { ColorThemeValue }

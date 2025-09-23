import { z } from "zod"

import { USER_ROLES } from "@/lib/auth/roles"
import { COLOR_THEME_OPTIONS, type ColorThemeValue } from "@/lib/color-theme"
import {
  LANGUAGE_PREFERENCE_OPTIONS,
  THEME_OPTIONS,
  type LanguagePreference,
  type ThemePreference,
} from "@/lib/user-preferences"

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
})

export const RegisterSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export const UpdateUserRoleSchema = z.object({
  role: z.enum(USER_ROLES),
})

const DEVICE_TYPE_VALUES = ["mobile", "desktop", "tablet", "bot", "unknown"] as const

export const DeviceInfoSchema = z.object({
  ua: z.string().trim().min(1).nullable(),
  os: z.string().trim().min(1).nullable(),
  browser: z.string().trim().min(1).nullable(),
  device_type: z.enum(DEVICE_TYPE_VALUES),
  ip: z.string().trim().min(1).nullable(),
  geo: z.object({
    country: z.string().trim().min(1).nullable(),
    region: z.string().trim().min(1).nullable(),
    city: z.string().trim().min(1).nullable(),
  }),
})

export type DeviceInfo = z.infer<typeof DeviceInfoSchema>

const THEME_PREFERENCE_VALUES = THEME_OPTIONS.map((option) => option.value)
const COLOR_THEME_VALUES = COLOR_THEME_OPTIONS.map((option) => option.value)
const LANGUAGE_PREFERENCE_VALUES = LANGUAGE_PREFERENCE_OPTIONS.map(
  (option) => option.value,
)

export const UpdateUserPreferencesSchema = z
  .object({
    theme: z.enum(THEME_PREFERENCE_VALUES as [ThemePreference, ...ThemePreference[]]).optional(),
    colorTheme: z
      .enum(COLOR_THEME_VALUES as [ColorThemeValue, ...ColorThemeValue[]])
      .optional(),
    language: z
      .enum(LANGUAGE_PREFERENCE_VALUES as [LanguagePreference, ...LanguagePreference[]])
      .optional(),
  })
  .refine(
    (value) =>
      value.theme !== undefined ||
      value.colorTheme !== undefined ||
      value.language !== undefined,
    {
    message: "At least one preference must be provided",
    },
  )

export const ThemePreferenceSchema = z.enum(
  THEME_PREFERENCE_VALUES as [ThemePreference, ...ThemePreference[]],
)

export const ColorThemePreferenceSchema = z.enum(
  COLOR_THEME_VALUES as [ColorThemeValue, ...ColorThemeValue[]],
)

export const LanguagePreferenceSchema = z.enum(
  LANGUAGE_PREFERENCE_VALUES as [LanguagePreference, ...LanguagePreference[]],
)

export type UserPreferencesPayload = {
  theme?: ThemePreference
  colorTheme?: ColorThemeValue
  language?: LanguagePreference
}

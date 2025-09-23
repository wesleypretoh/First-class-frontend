import type { DefaultSession, DefaultUser } from "next-auth"

import type { AppUserRole } from "@/lib/auth/roles"
import type { LanguagePreference, ThemePreference } from "@/lib/user-preferences"
import type { ColorThemeValue } from "@/lib/color-theme"
import type { DeviceInfo } from "@/schemas"

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string
      role: AppUserRole
      themePreference: ThemePreference
      colorThemePreference: ColorThemeValue
      languagePreference: LanguagePreference
    }
  }

  interface User extends DefaultUser {
    role: AppUserRole
    lastLoginAt: Date | null
    lastLoginDevice: DeviceInfo | null
    themePreference: ThemePreference
    colorThemePreference: ColorThemeValue
    languagePreference: LanguagePreference
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AppUserRole
    themePreference?: ThemePreference
    colorThemePreference?: ColorThemeValue
    languagePreference?: LanguagePreference
  }
}

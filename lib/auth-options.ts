import { PrismaAdapter } from "@auth/prisma-adapter"

import { DEFAULT_USER_ROLE, isAppUserRole } from "@/lib/auth/roles"
import {
  DEFAULT_THEME_PREFERENCE,
  isThemePreference,
  DEFAULT_LANGUAGE_PREFERENCE,
  isLanguagePreference,
  resolveLanguagePreference,
} from "@/lib/user-preferences"
import {
  DEFAULT_COLOR_THEME,
  resolveColorTheme,
} from "@/lib/color-theme"
import prisma from "@/lib/prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" as const },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? session.user.id ?? ""
        const tokenRole = token.role
        session.user.role = isAppUserRole(tokenRole)
          ? tokenRole
          : DEFAULT_USER_ROLE
        session.user.themePreference = isThemePreference(token.themePreference)
          ? token.themePreference
          : DEFAULT_THEME_PREFERENCE
        session.user.colorThemePreference = resolveColorTheme(
          typeof token.colorThemePreference === "string"
            ? token.colorThemePreference
            : undefined,
        )
        session.user.languagePreference = isLanguagePreference(
          token.languagePreference,
        )
          ? token.languagePreference
          : DEFAULT_LANGUAGE_PREFERENCE
      }

      return session
    },
    async jwt({ token, user, trigger, session }) {
      if (user && "role" in user) {
        const userRole = user.role
        token.role = isAppUserRole(userRole)
          ? userRole
          : DEFAULT_USER_ROLE
        if ("themePreference" in user && isThemePreference(user.themePreference)) {
          token.themePreference = user.themePreference
        } else {
          token.themePreference = DEFAULT_THEME_PREFERENCE
        }

        if ("colorThemePreference" in user) {
          token.colorThemePreference = resolveColorTheme(
            (user.colorThemePreference ?? undefined) as string | undefined,
          )
        } else {
          token.colorThemePreference = DEFAULT_COLOR_THEME
        }

        if ("languagePreference" in user && isLanguagePreference(user.languagePreference)) {
          token.languagePreference = user.languagePreference
        } else {
          token.languagePreference = DEFAULT_LANGUAGE_PREFERENCE
        }
      } else if (trigger === "update" && session?.user) {
        const updatedUser = session.user

        if (isThemePreference(updatedUser.themePreference)) {
          token.themePreference = updatedUser.themePreference
        }

        if (typeof updatedUser.colorThemePreference === "string") {
          token.colorThemePreference = resolveColorTheme(
            updatedUser.colorThemePreference,
          )
        }

        if (isLanguagePreference(updatedUser.languagePreference)) {
          token.languagePreference = updatedUser.languagePreference
        }
      } else if (!isAppUserRole(token.role)) {
        if (token.sub) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: {
              role: true,
              themePreference: true,
              colorThemePreference: true,
              languagePreference: true,
            },
          })

          if (dbUser && isAppUserRole(dbUser.role)) {
            token.role = dbUser.role
          } else {
            token.role = DEFAULT_USER_ROLE
          }

          token.themePreference = isThemePreference(dbUser?.themePreference)
            ? dbUser?.themePreference
            : DEFAULT_THEME_PREFERENCE
          token.colorThemePreference = resolveColorTheme(
            dbUser?.colorThemePreference,
          )
          token.languagePreference = resolveLanguagePreference(
            dbUser?.languagePreference,
          )
        } else {
          token.role = DEFAULT_USER_ROLE
          token.themePreference = DEFAULT_THEME_PREFERENCE
          token.colorThemePreference = DEFAULT_COLOR_THEME
          token.languagePreference = DEFAULT_LANGUAGE_PREFERENCE
        }
      } else {
        token.themePreference = isThemePreference(token.themePreference)
          ? token.themePreference
          : DEFAULT_THEME_PREFERENCE
        token.colorThemePreference = resolveColorTheme(token.colorThemePreference as string | undefined)
        token.languagePreference = resolveLanguagePreference(token.languagePreference)
      }

      return token
    },
  },
}

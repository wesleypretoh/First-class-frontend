import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import authConfig from "@/auth.config"
import { authOptions } from "@/lib/auth-options"
import prisma from "@/lib/prisma"
import { UpdateUserPreferencesSchema } from "@/schemas"
import {
  resolveLanguagePreference,
  resolveThemePreference,
} from "@/lib/user-preferences"
import {
  DEFAULT_COLOR_THEME,
  resolveColorTheme,
} from "@/lib/color-theme"

export async function PATCH(req: Request) {
  const session = await getServerSession({
    ...authConfig,
    ...authOptions,
  })

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = UpdateUserPreferencesSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid preference payload" }, { status: 400 })
  }

  const { theme, colorTheme, language } = parsed.data

  if (!theme && !colorTheme && !language) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
  }

  try {
    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        themePreference: theme ?? undefined,
        colorThemePreference: colorTheme ?? undefined,
        languagePreference: language ?? undefined,
      },
      select: {
        themePreference: true,
        colorThemePreference: true,
        languagePreference: true,
      },
    })

    return NextResponse.json({
      settings: {
        themePreference: resolveThemePreference(updated.themePreference),
        colorThemePreference: resolveColorTheme(
          updated.colorThemePreference ?? DEFAULT_COLOR_THEME,
        ),
        languagePreference: resolveLanguagePreference(
          updated.languagePreference,
        ),
      },
    })
  } catch (error) {
    console.error("Failed to update user settings", error)
    return NextResponse.json(
      { error: "Unable to update settings" },
      { status: 500 },
    )
  }
}

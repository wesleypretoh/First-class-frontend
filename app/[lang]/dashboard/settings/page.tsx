import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/config"
import { renderSettingsPage } from "@/app/dashboard/settings/render-settings-page"
import { getDictionary } from "@/lib/i18n/get-dictionary"

type SettingsPageProps = {
  params: Promise<{
    lang: string
  }>
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { lang } = await params
  const locale = normalizeLocale(lang)

  if (!locale) {
    notFound()
  }

  return renderSettingsPage(locale)
}

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).map((locale) => ({
    lang: locale,
  }))
}

export async function generateMetadata({ params }: SettingsPageProps): Promise<Metadata> {
  const { lang } = await params
  const locale = normalizeLocale(lang)

  if (!locale) {
    notFound()
  }

  const dictionary = await getDictionary(locale)

  return {
    title: dictionary.pageTitles.settings,
  }
}

function normalizeLocale(input: string): Locale | null {
  return SUPPORTED_LOCALES.includes(input as Locale) ? (input as Locale) : null
}

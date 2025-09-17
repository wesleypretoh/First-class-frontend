import { notFound } from "next/navigation"

import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/config"
import Home from "@/app/page"

type LocalizedHomeProps = {
  params: Promise<{
    lang: string
  }>
}

export default async function LocalizedHome({ params }: LocalizedHomeProps) {
  const { lang } = await params
  const locale = normalizeLocale(lang)

  if (!locale || locale === DEFAULT_LOCALE) {
    notFound()
  }

  return <Home />
}

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).map((locale) => ({
    lang: locale,
  }))
}

function normalizeLocale(input: string): Locale | null {
  return SUPPORTED_LOCALES.includes(input as Locale) ? (input as Locale) : null
}

import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/get-dictionary"
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

export async function generateMetadata({ params }: LocalizedHomeProps): Promise<Metadata> {
  const { lang } = await params
  const locale = normalizeLocale(lang)

  if (!locale || locale === DEFAULT_LOCALE) {
    notFound()
  }

  const dictionary = await getDictionary(locale)

  return {
    title: dictionary.pageTitles.home,
  }
}

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).map((locale) => ({
    lang: locale,
  }))
}

function normalizeLocale(input: string): Locale | null {
  return SUPPORTED_LOCALES.includes(input as Locale) ? (input as Locale) : null
}

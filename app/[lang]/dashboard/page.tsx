import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/config"
import { renderDashboardPage } from "@/app/dashboard/render-dashboard-page"
import { getDictionary } from "@/lib/i18n/get-dictionary"

type DashboardPageProps = {
  params: Promise<{
    lang: string
  }>
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { lang } = await params
  const locale = normalizeLocale(lang)

  if (!locale) {
    notFound()
  }

  return renderDashboardPage(locale)
}

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).map((locale) => ({
    lang: locale,
  }))
}

export async function generateMetadata({ params }: DashboardPageProps): Promise<Metadata> {
  const { lang } = await params
  const locale = normalizeLocale(lang)

  if (!locale) {
    notFound()
  }

  const dictionary = await getDictionary(locale)

  return {
    title: dictionary.pageTitles.dashboard,
  }
}

function normalizeLocale(input: string): Locale | null {
  return SUPPORTED_LOCALES.includes(input as Locale) ? (input as Locale) : null
}

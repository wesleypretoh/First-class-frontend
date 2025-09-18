import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { RegisterForm } from "@/components/register-form"

type SignUpPageProps = {
  params: Promise<{
    lang: string
  }>
}

export default async function SignUpPage({ params }: SignUpPageProps) {
  const { lang } = await params
  const locale = normalizeLocale(lang)

  if (!locale) {
    notFound()
  }

  const dictionary = await getDictionary(locale)

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <RegisterForm dictionary={dictionary} />
    </div>
  )
}

export async function generateMetadata({ params }: SignUpPageProps): Promise<Metadata> {
  const { lang } = await params
  const locale = normalizeLocale(lang)

  if (!locale) {
    notFound()
  }

  const dictionary = await getDictionary(locale)

  return {
    title: dictionary.pageTitles.signup,
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

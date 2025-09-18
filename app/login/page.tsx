import type { Metadata } from "next"

import { DEFAULT_LOCALE } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
  title: "Login",
}

export default async function Page() {
  const dictionary = await getDictionary(DEFAULT_LOCALE)

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm dictionary={dictionary} />
      </div>
    </div>
  )
}

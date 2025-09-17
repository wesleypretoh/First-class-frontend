import { DEFAULT_LOCALE } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { RegisterForm } from "@/components/register-form"

export default async function RegisterPage() {
  const dictionary = await getDictionary(DEFAULT_LOCALE)

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <RegisterForm dictionary={dictionary} />
    </div>
  )
}

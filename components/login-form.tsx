"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { type ComponentProps, type FormEvent, useState, useTransition } from "react"
import { z } from "zod"

import { login } from "@/actions/login"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LanguageSelect } from "@/components/language-select"
import { DEFAULT_LOCALE } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/get-dictionary"
import { buildLocalizedPath } from "@/lib/i18n/routing"
import { cn } from "@/lib/utils"
import { LoginSchema } from "@/schemas"

type LoginFormProps = ComponentProps<"div"> & {
  dictionary: Dictionary
}

export function LoginForm({
  className,
  dictionary,
  ...props
}: LoginFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const router = useRouter()
  const locale = dictionary.locale ?? DEFAULT_LOCALE

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("")

    startTransition(async () => {
      const result = await login(values)

      if (result?.error) {
        setError(result.error)
        return
      }

      if (result?.success) {
        const signInResult = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        })

        if (signInResult?.error) {
          setError(dictionary.auth.login.error)
          return
        }

        router.push(buildLocalizedPath(locale, "dashboard"))
      }
    })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const values: z.infer<typeof LoginSchema> = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    }

    onSubmit(values)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{dictionary.auth.login.title}</CardTitle>
          <CardDescription>
            {dictionary.auth.login.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">{dictionary.auth.login.emailLabel}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">{dictionary.auth.login.passwordLabel}</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    {dictionary.auth.login.forgotPassword}
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                {error ? (
                  <div
                    role="alert"
                    className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
                  >
                    {error}
                  </div>
                ) : null}
                <Button
                  disabled={isPending}
                  type="submit"
                  size="lg"
                  className="w-full"
                >
                  {dictionary.auth.login.submit}
                </Button>
                <Button variant="outline" className="w-full">
                  {dictionary.auth.login.google}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              {dictionary.auth.login.ctaPrompt}{" "}
              <Link
                href={buildLocalizedPath(locale, "signup")}
                className="underline underline-offset-4"
              >
                {dictionary.auth.login.ctaAction}
              </Link>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex w-full justify-end">
          <LanguageSelect
            dictionary={dictionary}
            triggerClassName="h-8 text-xs"
          />
        </CardFooter>
      </Card>
    </div>
  )
}

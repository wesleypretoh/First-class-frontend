"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { register } from "@/actions/register"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LanguageSelect } from "@/components/language-select"
import { DEFAULT_LOCALE } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/get-dictionary"
import { buildLocalizedPath } from "@/lib/i18n/routing"
import { RegisterSchema } from "@/schemas"

type RegisterFormProps = {
  dictionary: Dictionary
}

export const RegisterForm = ({ dictionary }: RegisterFormProps) => {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const locale = dictionary.locale ?? DEFAULT_LOCALE

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("")
    setSuccess("")

    startTransition(async () => {
      const data = await register(values)

      if (data?.success) {
        setSuccess(data.success)
        form.reset()
      }

      if (data?.error) {
        setError(data.error)
      }
    })
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{dictionary.auth.register.title}</CardTitle>
        <CardDescription>{dictionary.auth.register.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.auth.register.nameLabel}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.auth.register.emailLabel}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.auth.register.passwordLabel}</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="******" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {success ? (
              <div
                role="status"
                className="rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700"
              >
                {success}
              </div>
            ) : null}
            {error ? (
              <div
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
              >
                {error}
              </div>
            ) : null}
            <Button disabled={isPending} type="submit" size="lg" className="w-full">
              {dictionary.auth.register.submit}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {dictionary.auth.register.ctaPrompt}{" "}
          <Link
            href={buildLocalizedPath(locale, "login")}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {dictionary.auth.register.ctaAction}
          </Link>
        </div>
        <LanguageSelect
          dictionary={dictionary}
          triggerClassName="h-8 text-xs"
        />
      </CardFooter>
    </Card>
  )
}

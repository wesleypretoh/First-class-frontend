"use client"

import { signOut } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { buildLocalizedPath } from "@/lib/i18n/routing"
import { useCurrentLocale } from "@/hooks/use-current-locale"

export function SignOutButton() {
  const locale = useCurrentLocale()

  return (
    <Button
      className="w-full"
      onClick={() => {
        void signOut({ callbackUrl: buildLocalizedPath(locale, "login") })
      }}
    >
      Sign out
    </Button>
  )
}

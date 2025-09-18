import type { Metadata } from "next"

import { DEFAULT_LOCALE } from "@/lib/i18n/config"
import { renderSettingsPage } from "./render-settings-page"

export const metadata: Metadata = {
  title: "Settings",
}

export default async function SettingsPage() {
  return renderSettingsPage(DEFAULT_LOCALE)
}

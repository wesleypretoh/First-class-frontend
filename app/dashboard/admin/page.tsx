import { DEFAULT_LOCALE } from "@/lib/i18n/config"
import { renderAdminPage } from "./render-admin-page"

export default async function AdminPage() {
  return renderAdminPage(DEFAULT_LOCALE)
}

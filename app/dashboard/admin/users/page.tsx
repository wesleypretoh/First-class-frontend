import { DEFAULT_LOCALE } from "@/lib/i18n/config"

import { renderAdminUsersPage } from "./render-users-page"

export default async function AdminUsersPage() {
  return renderAdminUsersPage(DEFAULT_LOCALE)
}

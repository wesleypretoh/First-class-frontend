import { DEFAULT_LOCALE } from "@/lib/i18n/config"
import { renderDashboardPage } from "./render-dashboard-page"

export default async function DashboardPage() {
  return renderDashboardPage(DEFAULT_LOCALE)
}

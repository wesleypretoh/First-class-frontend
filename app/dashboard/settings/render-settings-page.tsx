import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { AppSidebar } from "@/components/app-sidebar"
import { ColorThemeSelect } from "@/components/color-theme-select"
import { LanguageSelect } from "@/components/language-select"
import { ThemeSelect } from "@/components/theme-select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import authConfig from "@/auth.config"
import { authOptions } from "@/lib/auth-options"
import type { Locale } from "@/lib/i18n/config"
import { buildLocalizedPath } from "@/lib/i18n/routing"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { hasAccessToPath } from "@/lib/auth/permissions"
import { DEFAULT_COLOR_THEME } from "@/lib/color-theme"
import { DEFAULT_THEME_PREFERENCE } from "@/lib/user-preferences"

export async function renderSettingsPage(locale: Locale) {
  const session = await getServerSession({
    ...authConfig,
    ...authOptions,
  })

  if (!session?.user) {
    redirect("/login")
  }

  if (!hasAccessToPath("/dashboard/settings", session.user.role)) {
    redirect(buildLocalizedPath(locale, "dashboard"))
  }

  const dictionary = await getDictionary(locale)
  const userThemePreference = session.user.themePreference ?? DEFAULT_THEME_PREFERENCE
  const userColorThemePreference =
    session.user.colorThemePreference ?? DEFAULT_COLOR_THEME

  return (
    <SidebarProvider>
      <AppSidebar user={session.user} dictionary={dictionary} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={buildLocalizedPath(locale, "")}>
                    {dictionary.settings.breadcrumb.home}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={buildLocalizedPath(locale, "dashboard")}>
                    {dictionary.settings.breadcrumb.dashboard}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {dictionary.settings.breadcrumb.settings}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card>
            <CardHeader>
              <CardTitle>{dictionary.settings.pageTitle}</CardTitle>
              <CardDescription>
                {dictionary.settings.pageDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium">
                      {dictionary.settings.appearance.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {dictionary.settings.appearance.description}
                    </p>
                  </div>
                  <div className="md:w-56">
                    <ThemeSelect
                      initialValue={userThemePreference}
                      successMessage={dictionary.settings.notifications.themeUpdated}
                      errorMessage={dictionary.settings.notifications.themeUpdateError}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium">
                      {dictionary.settings.colorTheme.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {dictionary.settings.colorTheme.description}
                    </p>
                  </div>
                  <div className="md:w-56">
                    <ColorThemeSelect
                      initialValue={userColorThemePreference}
                      successMessage={dictionary.settings.notifications.colorThemeUpdated}
                      errorMessage={dictionary.settings.notifications.colorThemeUpdateError}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium">
                      {dictionary.settings.language.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {dictionary.settings.language.description}
                    </p>
                  </div>
                  <div className="md:w-56">
                    <LanguageSelect
                      dictionary={dictionary}
                      successMessage={dictionary.settings.notifications.languageUpdated}
                      errorMessage={dictionary.settings.notifications.languageUpdateError}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

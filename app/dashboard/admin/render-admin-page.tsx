import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { AppSidebar } from "@/components/app-sidebar"
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
import { hasAccessToPath } from "@/lib/auth/permissions"
import type { Locale } from "@/lib/i18n/config"
import { buildLocalizedPath } from "@/lib/i18n/routing"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export async function renderAdminPage(locale: Locale) {
  const session = await getServerSession({
    ...authConfig,
    ...authOptions,
  })

  if (!session?.user) {
    redirect("/login")
  }

  if (!hasAccessToPath("/dashboard/admin", session.user.role)) {
    redirect(buildLocalizedPath(locale, "dashboard"))
  }

  const dictionary = await getDictionary(locale)
  const copy = dictionary.admin

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
                    {copy.breadcrumb.home}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={buildLocalizedPath(locale, "dashboard")}>
                    {copy.breadcrumb.dashboard}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{copy.breadcrumb.admin}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card>
            <CardHeader>
              <CardTitle>{copy.pageTitle}</CardTitle>
              <CardDescription>{copy.pageDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>{copy.sections.overview}</p>
                <p>{copy.sections.management}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

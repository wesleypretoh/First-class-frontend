import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import authConfig from "@/auth.config"
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
import { authOptions } from "@/lib/auth-options"
import { hasAccessToPath } from "@/lib/auth/permissions"
import { USER_ROLES } from "@/lib/auth/roles"
import type { Locale } from "@/lib/i18n/config"
import { buildLocalizedPath } from "@/lib/i18n/routing"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import prisma from "@/lib/prisma"
import { DeviceInfoSchema } from "@/schemas"

import { UserTable } from "./user-table"

export async function renderAdminUsersPage(locale: Locale) {
  const session = await getServerSession({
    ...authConfig,
    ...authOptions,
  })

  if (!session?.user) {
    redirect("/login")
  }

  if (!hasAccessToPath("/dashboard/admin/users", session.user.role)) {
    redirect(buildLocalizedPath(locale, "dashboard"))
  }

  const dictionary = await getDictionary(locale)
  const adminCopy = dictionary.admin
  const copy = adminCopy.usersPage

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
      lastLoginDevice: true,
    },
  })

  const dateFormatter = new Intl.DateTimeFormat(dictionary.locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const tableData = users.map((user) => {
    const parsedDevice = DeviceInfoSchema.safeParse(user.lastLoginDevice)

    return {
      id: user.id,
      name: user.name ?? copy.table.noName,
      email: user.email,
      role: user.role,
      roleLabel: dictionary.userRoles[user.role],
      createdAtISO: user.createdAt.toISOString(),
      createdAtLabel: dateFormatter.format(user.createdAt),
      lastLoginISO: user.lastLoginAt?.toISOString() ?? null,
      lastLoginLabel: user.lastLoginAt
        ? dateFormatter.format(user.lastLoginAt)
        : copy.table.neverLoggedIn,
      lastLoginDevice: parsedDevice.success ? parsedDevice.data : null,
    }
  })

  const roleFilters = USER_ROLES.map((role) => ({
    value: role,
    label: dictionary.userRoles[role],
  }))

  const canManageUsers = session.user.role === "ADMIN"
  const currentUserId = session.user.id ?? ""

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
                    {adminCopy.breadcrumb.home}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={buildLocalizedPath(locale, "dashboard")}>
                    {adminCopy.breadcrumb.dashboard}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={buildLocalizedPath(locale, "dashboard/admin")}>
                    {adminCopy.breadcrumb.admin}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{adminCopy.breadcrumb.users}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card>
            <CardHeader>
              <CardTitle>{copy.title}</CardTitle>
              <CardDescription>{copy.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <UserTable
                data={tableData}
                strings={{
                  searchPlaceholder: copy.searchPlaceholder,
                  roleFilterLabel: copy.roleFilterLabel,
                  roleFilterAll: copy.roleFilterAll,
                  empty: copy.table.empty,
                  neverLoggedIn: copy.table.neverLoggedIn,
                  columns: copy.table.columns,
                  pagination: {
                    previous: copy.table.previous,
                    next: copy.table.next,
                  },
                  actions: {
                    header: copy.table.actions,
                    label: copy.actions.label,
                    deviceInfo: copy.actions.deviceInfo,
                    changeRole: copy.actions.changeRole,
                    delete: copy.actions.delete,
                  },
                  deviceDialog: copy.deviceDialog,
                  roleDialog: copy.roleDialog,
                  deleteDialog: copy.deleteDialog,
                }}
                roleOptions={roleFilters}
                canManageUsers={canManageUsers}
                currentUserId={currentUserId}
              />
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

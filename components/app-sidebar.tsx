"use client"

import * as React from "react"
import {
  BarChart3,
  Briefcase,
  DollarSign,
  FileText,
  LifeBuoy,
  NotebookPen,
  Settings,
  SquareTerminal,
  type LucideIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import type { Dictionary } from "@/lib/i18n/get-dictionary"
import { buildLocalizedPath } from "@/lib/i18n/routing"
import { hasAccessToPath } from "@/lib/auth/permissions"
import type { AppUserRole } from "@/lib/auth/roles"

const QUICK_LINK_ICONS: LucideIcon[] = [
  NotebookPen,
  LifeBuoy,
  DollarSign,
  Briefcase,
  FileText,
]

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: AppUserRole | null
  }
  dictionary: Dictionary
}

export function AppSidebar({ user, dictionary, ...props }: AppSidebarProps) {
  const userRole = user?.role ?? null
  const userRoleLabel = userRole ? dictionary.userRoles[userRole] ?? userRole : null

  const displayUser = {
    name: user?.name ?? dictionary.teamSwitcher.defaultTeamName,
    email: user?.email ?? "support@example.com",
    avatar: user?.image ?? null,
    role: userRoleLabel,
  }

  const filterItemsByRole = (items: { title: string; path: string }[]) =>
    items.filter((item) => hasAccessToPath(`/${item.path}`, userRole))

  const workspaceItems = filterItemsByRole(
    dictionary.navigation.workspace.items,
  )
  const insightsItems = filterItemsByRole(dictionary.navigation.insights.items)
  const managementItems = filterItemsByRole(
    dictionary.navigation.management.items,
  )
  const adminConsoleItems = filterItemsByRole(
    dictionary.navigation.adminConsole.items,
  )

  const navMainItems: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items: {
      title: string
      url: string
    }[]
  }[] = []

  if (workspaceItems.length > 0) {
    navMainItems.push({
      title: dictionary.navigation.workspace.title,
      url: buildLocalizedPath(
        dictionary.locale,
        workspaceItems[0]?.path ?? "dashboard",
      ),
      icon: SquareTerminal,
      isActive: true,
      items: workspaceItems.map((item) => ({
        title: item.title,
        url: buildLocalizedPath(dictionary.locale, item.path),
      })),
    })
  }

  if (insightsItems.length > 0) {
    navMainItems.push({
      title: dictionary.navigation.insights.title,
      url: buildLocalizedPath(
        dictionary.locale,
        insightsItems[0]?.path ?? "dashboard/reports",
      ),
      icon: BarChart3,
      items: insightsItems.map((item) => ({
        title: item.title,
        url: buildLocalizedPath(dictionary.locale, item.path),
      })),
    })
  }

  if (managementItems.length > 0) {
    navMainItems.push({
      title: dictionary.navigation.management.title,
      url: buildLocalizedPath(
        dictionary.locale,
        managementItems[0]?.path ?? "dashboard/settings",
      ),
      icon: Settings,
      items: managementItems.map((item) => ({
        title: item.title,
        url: buildLocalizedPath(dictionary.locale, item.path),
      })),
    })
  }

  if (adminConsoleItems.length > 0) {
    navMainItems.push({
      title: dictionary.navigation.adminConsole.title,
      url: buildLocalizedPath(
        dictionary.locale,
        adminConsoleItems[0]?.path ?? "dashboard/admin",
      ),
      icon: SquareTerminal,
      items: adminConsoleItems.map((item) => ({
        title: item.title,
        url: buildLocalizedPath(dictionary.locale, item.path),
      })),
    })
  }

  const quickLinks = dictionary.navigation.quickLinks.map((link, index) => {
    const isExternal = /^https?:\/\//i.test(link.url)
    const normalizedPath = link.url.replace(/^\//, "")
    const resolvedUrl = isExternal
      ? link.url
      : buildLocalizedPath(dictionary.locale, normalizedPath)

    return {
      name: link.name,
      url: resolvedUrl,
      icon: QUICK_LINK_ICONS[index % QUICK_LINK_ICONS.length] ?? NotebookPen,
    }
  })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={[
            {
              name: displayUser.name ?? dictionary.teamSwitcher.defaultTeamName,
              logo: SquareTerminal,
              plan: userRoleLabel ?? "",
            },
          ]}
          labels={dictionary.teamSwitcher}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={navMainItems}
          label={dictionary.navigation.platformLabel}
        />
        <NavProjects
          title={dictionary.navigation.quickLinksLabel}
          projects={quickLinks}
          labels={dictionary.navProjects}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={displayUser} labels={dictionary.navUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

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
  }
  dictionary: Dictionary
}

export function AppSidebar({ user, dictionary, ...props }: AppSidebarProps) {
  const displayUser = {
    name: user?.name ?? dictionary.teamSwitcher.defaultTeamName,
    email: user?.email ?? "support@example.com",
    avatar: user?.image ?? null,
  }

  const navMainItems = [
    {
      title: dictionary.navigation.workspace.title,
      url: buildLocalizedPath(dictionary.locale, dictionary.navigation.workspace.items[0]?.path ?? "dashboard"),
      icon: SquareTerminal,
      isActive: true,
      items: dictionary.navigation.workspace.items.map((item) => ({
        title: item.title,
        url: buildLocalizedPath(dictionary.locale, item.path),
      })),
    },
    {
      title: dictionary.navigation.insights.title,
      url: buildLocalizedPath(dictionary.locale, dictionary.navigation.insights.items[0]?.path ?? "dashboard/reports"),
      icon: BarChart3,
      items: dictionary.navigation.insights.items.map((item) => ({
        title: item.title,
        url: buildLocalizedPath(dictionary.locale, item.path),
      })),
    },
    {
      title: dictionary.navigation.management.title,
      url: buildLocalizedPath(dictionary.locale, dictionary.navigation.management.items[0]?.path ?? "dashboard/settings"),
      icon: Settings,
      items: dictionary.navigation.management.items.map((item) => ({
        title: item.title,
        url: buildLocalizedPath(dictionary.locale, item.path),
      })),
    },
  ]

  const quickLinks = dictionary.navigation.quickLinks.map((link, index) => ({
    name: link.name,
    url: link.url,
    icon: QUICK_LINK_ICONS[index] ?? NotebookPen,
  }))

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={[
            {
              name: displayUser.name ?? dictionary.teamSwitcher.defaultTeamName,
              logo: SquareTerminal,
              plan: dictionary.teamSwitcher.defaultPlan,
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

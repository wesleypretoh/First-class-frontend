"use client"

import * as React from "react"
import { signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import {
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { buildLocalizedPath, extractLocaleFromPathname } from "@/lib/i18n/routing"

type NavUserLabels = {
  upgrade: string
  settings: string
  notifications: string
  billing: string
  logout: string
}

export function NavUser({
  user,
  labels,
}: {
  user: {
    name?: string | null
    email?: string | null
    avatar?: string | null
  }
  labels: NavUserLabels
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()

  const locale = React.useMemo(
    () => extractLocaleFromPathname(pathname ?? "/").locale,
    [pathname],
  )

  const displayName = user.name ?? "User"
  const displayEmail = user.email ?? ""
  const avatarUrl = user.avatar ?? undefined

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="rounded-lg">
                  {displayName.slice(0, 2).toUpperCase() || "CN"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs">{displayEmail}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback className="rounded-lg">
                    {displayName.slice(0, 2).toUpperCase() || "CN"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs">{displayEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                {labels.upgrade}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault()
                  router.push(buildLocalizedPath(locale, "dashboard/settings"))
                }}
              >
                <Settings />
                {labels.settings}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                {labels.notifications}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                {labels.billing}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault()
                void signOut({ callbackUrl: buildLocalizedPath(locale, "login") })
              }}
            >
              <LogOut />
              {labels.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

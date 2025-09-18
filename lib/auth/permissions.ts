import { DEFAULT_USER_ROLE, type AppUserRole, isAppUserRole } from "@/lib/auth/roles"

type RouteAccessRule = {
  route: string
  allowedRoles: AppUserRole[]
}

const normalizePath = (path: string): string => {
  if (!path) {
    return "/"
  }

  const normalized = path.split("?")[0]?.split("#")[0] ?? "/"
  const ensuredLeadingSlash = normalized.startsWith("/")
    ? normalized
    : `/${normalized}`
  const trimmedTrailing = ensuredLeadingSlash.replace(/\/$/, "")

  return trimmedTrailing === "" ? "/" : trimmedTrailing
}

export const ROUTE_ACCESS_RULES: RouteAccessRule[] = [
  {
    route: "/dashboard/admin",
    allowedRoles: ["ADMIN"],
  },
  {
    route: "/dashboard/settings",
    allowedRoles: ["ADMIN", "STAFF", DEFAULT_USER_ROLE],
  },
  {
    route: "/dashboard",
    allowedRoles: ["ADMIN", "STAFF", DEFAULT_USER_ROLE],
  },
]

export const getAllowedRolesForPath = (
  path: string,
): AppUserRole[] | null => {
  const normalizedPath = normalizePath(path)

  let matchedRoles: AppUserRole[] | null = null
  let longestMatchLength = -1

  for (const rule of ROUTE_ACCESS_RULES) {
    const normalizedRulePath = normalizePath(rule.route)

    if (
      normalizedPath === normalizedRulePath ||
      normalizedPath.startsWith(`${normalizedRulePath}/`)
    ) {
      if (normalizedRulePath.length > longestMatchLength) {
        matchedRoles = rule.allowedRoles
        longestMatchLength = normalizedRulePath.length
      }
    }
  }

  return matchedRoles
}

export const hasAccessToPath = (
  path: string,
  role: string | null | undefined,
): boolean => {
  const normalizedRole = isAppUserRole(role) ? role : null
  const allowedRoles = getAllowedRolesForPath(path)

  if (!allowedRoles || allowedRoles.length === 0) {
    return true
  }

  if (!normalizedRole) {
    return false
  }

  return allowedRoles.includes(normalizedRole)
}

export const getFallbackRouteForRole = (
  role: string | null | undefined,
): string => {
  if (isAppUserRole(role) && role === "ADMIN") {
    return "/dashboard"
  }

  return "/dashboard"
}

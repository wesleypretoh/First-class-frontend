export const USER_ROLES = ["ADMIN", "STAFF", "USER"] as const

export type AppUserRole = (typeof USER_ROLES)[number]

export const DEFAULT_USER_ROLE: AppUserRole = "USER"

export const isAppUserRole = (value: unknown): value is AppUserRole =>
  typeof value === "string" && USER_ROLES.includes(value as AppUserRole)

import type { DefaultSession, DefaultUser } from "next-auth"

import type { AppUserRole } from "@/lib/auth/roles"
import type { DeviceInfo } from "@/schemas"

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string
      role: AppUserRole
    }
  }

  interface User extends DefaultUser {
    role: AppUserRole
    lastLoginAt: Date | null
    lastLoginDevice: DeviceInfo | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AppUserRole
  }
}

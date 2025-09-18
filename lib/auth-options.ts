import { PrismaAdapter } from "@auth/prisma-adapter"

import { DEFAULT_USER_ROLE, isAppUserRole } from "@/lib/auth/roles"
import prisma from "@/lib/prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" as const },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? session.user.id ?? ""
        const tokenRole = token.role
        session.user.role = isAppUserRole(tokenRole)
          ? tokenRole
          : DEFAULT_USER_ROLE
      }

      return session
    },
    async jwt({ token, user }) {
      if (user && "role" in user) {
        const userRole = user.role
        token.role = isAppUserRole(userRole)
          ? userRole
          : DEFAULT_USER_ROLE
      } else if (!isAppUserRole(token.role)) {
        if (token.sub) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { role: true },
          })

          if (dbUser && isAppUserRole(dbUser.role)) {
            token.role = dbUser.role
          } else {
            token.role = DEFAULT_USER_ROLE
          }
        } else {
          token.role = DEFAULT_USER_ROLE
        }
      }

      return token
    },
  },
}

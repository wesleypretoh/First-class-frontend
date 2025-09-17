import { PrismaAdapter } from "@auth/prisma-adapter"

import prisma from "@/lib/prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" as const },
  secret: process.env.AUTH_SECRET,
}

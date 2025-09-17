import NextAuth from "next-auth"

import authConfig from "@/auth.config"
import { authOptions } from "@/lib/auth-options"

const handler = NextAuth({
  ...authConfig,
  ...authOptions,
})

export { handler as GET, handler as POST }

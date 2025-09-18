import type { NextAuthConfig } from "next-auth"
import credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import prisma from "@/lib/prisma"
import { LoginSchema } from "@/schemas"

const authConfig = {
  providers: [
    credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials)

        if (!validatedFields.success) {
          return null
        }

        const { email, password } = validatedFields.data

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user || !user.password) {
          return null
        }

        const passwordsMatch = await bcrypt.compare(password, user.password)

        if (!passwordsMatch) {
          return null
        }

        const { password: _password, ...sanitizedUser } = user
        void _password

        return sanitizedUser
      },
    }),
  ],
} satisfies NextAuthConfig

export default authConfig

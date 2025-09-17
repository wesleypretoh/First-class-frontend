"use server"

import bcrypt from "bcryptjs"

import prisma from "@/lib/prisma"
import { LoginSchema } from "@/schemas"

export const login = async (values: unknown) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: "Invalid credentials!",
    }
  }

  const { email, password } = validatedFields.data

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.password) {
      return {
        error: "Invalid credentials!",
      }
    }

    const passwordsMatch = await bcrypt.compare(password, user.password)

    if (!passwordsMatch) {
      return {
        error: "Invalid credentials!",
      }
    }

    return {
      success: "Login successful",
    }
  } catch (error) {
    console.error("Login failed", error)

    return {
      error: "Database connection error. Please try again later.",
    }
  }
}

"use server"

import bcrypt from "bcryptjs"

import prisma from "@/lib/prisma"
import { RegisterSchema } from "@/schemas"

export const register = async (values: unknown) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: "Invalid fields!",
    }
  }

  const { name, email, password } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        error: "Email already taken!",
      }
    }

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return {
      success: "User successfully created!",
    }
  } catch (error) {
    console.error("Registration failed", error)

    return {
      error: "Database connection error. Please try again later.",
    }
  }
}

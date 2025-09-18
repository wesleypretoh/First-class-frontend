import { z } from "zod"

import { USER_ROLES } from "@/lib/auth/roles"

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
})

export const RegisterSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export const UpdateUserRoleSchema = z.object({
  role: z.enum(USER_ROLES),
})

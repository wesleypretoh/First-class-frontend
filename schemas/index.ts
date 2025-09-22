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

const DEVICE_TYPE_VALUES = ["mobile", "desktop", "tablet", "bot", "unknown"] as const

export const DeviceInfoSchema = z.object({
  ua: z.string().trim().min(1).nullable(),
  os: z.string().trim().min(1).nullable(),
  browser: z.string().trim().min(1).nullable(),
  device_type: z.enum(DEVICE_TYPE_VALUES),
  ip: z.string().trim().min(1).nullable(),
  geo: z.object({
    country: z.string().trim().min(1).nullable(),
    region: z.string().trim().min(1).nullable(),
    city: z.string().trim().min(1).nullable(),
  }),
})

export type DeviceInfo = z.infer<typeof DeviceInfoSchema>

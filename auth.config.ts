import type { NextAuthConfig } from "next-auth"
import credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import prisma from "@/lib/prisma"
import { DeviceInfoSchema, LoginSchema, type DeviceInfo } from "@/schemas"

type HeaderValue = string | null

type AuthorizeRequest = {
  headers?: Headers | Record<string, string | string[] | undefined>
}

const isHeadersInstance = (headers: unknown): headers is Headers =>
  typeof Headers !== "undefined" && headers instanceof Headers

const getHeaderValue = (headers: AuthorizeRequest["headers"], name: string): HeaderValue => {
  if (!headers) {
    return null
  }

  const normalized = name.toLowerCase()

  if (isHeadersInstance(headers)) {
    return headers.get(name) ?? headers.get(normalized)
  }

  const record = headers as Record<string, string | string[] | undefined>
  const value = record[name] ?? record[normalized]

  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

const normalizeString = (value: HeaderValue): string | null => {
  if (!value) {
    return null
  }

  const trimmed = value.trim()

  return trimmed.length > 0 ? trimmed : null
}

const pickPrimaryIp = (raw: HeaderValue): string | null => {
  if (!raw) {
    return null
  }

  const first = raw.split(",")[0]?.trim()

  return first && first.length > 0 ? first : null
}

const detectDeviceType = (userAgent: string | null): DeviceInfo["device_type"] => {
  if (!userAgent) {
    return "unknown"
  }

  const ua = userAgent.toLowerCase()

  if (/bot|crawl|spider|slurp/.test(ua)) {
    return "bot"
  }

  if (/mobile|iphone|ipod|android/.test(ua)) {
    return "mobile"
  }

  if (/ipad|tablet/.test(ua)) {
    return "tablet"
  }

  return "desktop"
}

const detectOs = (userAgent: string | null): DeviceInfo["os"] => {
  if (!userAgent) {
    return null
  }

  const ua = userAgent.toLowerCase()

  if (ua.includes("windows")) return "Windows"
  if (ua.includes("mac os")) return "macOS"
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ios")) return "iOS"
  if (ua.includes("android")) return "Android"
  if (ua.includes("linux")) return "Linux"
  if (ua.includes("cros")) return "ChromeOS"

  return null
}

const detectBrowser = (userAgent: string | null): DeviceInfo["browser"] => {
  if (!userAgent) {
    return null
  }

  const ua = userAgent.toLowerCase()

  if (ua.includes("edg/")) return "Edge"
  if (ua.includes("opr/") || ua.includes("opera")) return "Opera"
  if (ua.includes("firefox")) return "Firefox"
  if (ua.includes("safari") && !ua.includes("chrome")) return "Safari"
  if (ua.includes("chrome") || ua.includes("crios")) return "Chrome"
  if (ua.includes("msie") || ua.includes("trident")) return "Internet Explorer"

  return null
}

const buildDeviceInfo = (request?: AuthorizeRequest): DeviceInfo => {
  const headers = request?.headers
  const userAgent = normalizeString(getHeaderValue(headers, "user-agent"))

  const ip =
    pickPrimaryIp(getHeaderValue(headers, "x-forwarded-for")) ??
    pickPrimaryIp(getHeaderValue(headers, "x-real-ip")) ??
    null

  const country =
    normalizeString(getHeaderValue(headers, "x-vercel-ip-country")) ??
    normalizeString(getHeaderValue(headers, "cf-ipcountry")) ??
    null

  const region =
    normalizeString(getHeaderValue(headers, "x-vercel-ip-country-region")) ??
    normalizeString(getHeaderValue(headers, "x-vercel-ip-region")) ??
    null

  const city = normalizeString(getHeaderValue(headers, "x-vercel-ip-city"))

  return {
    ua: userAgent,
    os: detectOs(userAgent),
    browser: detectBrowser(userAgent),
    device_type: detectDeviceType(userAgent),
    ip,
    geo: {
      country,
      region,
      city,
    },
  }
}

const authConfig = {
  providers: [
    credentials({
      async authorize(credentials, request?: AuthorizeRequest) {
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

        let updatedUser = user
        const deviceInfo = buildDeviceInfo(request)
        const parsedDevice = DeviceInfoSchema.safeParse(deviceInfo)
        const lastLoginDevice = parsedDevice.success ? parsedDevice.data : null

        try {
          updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date(), lastLoginDevice },
          })
        } catch (error) {
          console.error("Failed to update last login timestamp", error)
        }

        const { password: _password, ...sanitizedUser } = updatedUser
        void _password

        return sanitizedUser
      },
    }),
  ],
} satisfies NextAuthConfig

export default authConfig

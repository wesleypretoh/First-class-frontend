import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import authConfig from "@/auth.config"
import { authOptions } from "@/lib/auth-options"
import { hasAccessToPath } from "@/lib/auth/permissions"
import prisma from "@/lib/prisma"
import { DeviceInfoSchema } from "@/schemas"

export async function GET() {
  const session = await getServerSession({
    ...authConfig,
    ...authOptions,
  })

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!hasAccessToPath("/dashboard/admin/users", session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        lastLoginDevice: true,
      },
    })

    const serializedUsers = users.map((user) => {
      const parsedDevice = DeviceInfoSchema.safeParse(user.lastLoginDevice)

      return {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
        lastLoginDevice: parsedDevice.success ? parsedDevice.data : null,
      }
    })

    return NextResponse.json({ users: serializedUsers })
  } catch (error) {
    console.error("Failed to fetch users", error)

    return NextResponse.json(
      { error: "Unable to fetch users" },
      { status: 500 },
    )
  }
}

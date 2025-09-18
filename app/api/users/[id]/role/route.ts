import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { Prisma } from "@prisma/client"

import authConfig from "@/auth.config"
import { authOptions } from "@/lib/auth-options"
import prisma from "@/lib/prisma"
import { UpdateUserRoleSchema } from "@/schemas"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession({
    ...authConfig,
    ...authOptions,
  })

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  const parsedBody = UpdateUserRoleSchema.safeParse(body)

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid role payload" },
      { status: 400 },
    )
  }

  const { id } = params

  if (!id) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 })
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: parsedBody.data.role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.error("Failed to update user role", error)

    return NextResponse.json(
      { error: "Unable to update user role" },
      { status: 500 },
    )
  }
}

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import authConfig from "@/auth.config"
import { authOptions } from "@/lib/auth-options"
import prisma from "@/lib/prisma"

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> },
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

  const { id } = await context.params

  if (!id) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 })
  }

  try {
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete user", error)

    return NextResponse.json(
      { error: "Unable to delete user" },
      { status: 500 },
    )
  }
}

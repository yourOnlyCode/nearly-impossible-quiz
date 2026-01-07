import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Get all prompts (admin only)
export async function GET(request: Request) {
  try {
    const session = await getSession()

    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const prompts = await prisma.prompt.findMany({
      select: {
        id: true,
        promptDate: true,
        content: true,
        createdAt: true,
      },
      orderBy: {
        promptDate: "desc",
      },
    })

    return NextResponse.json(prompts)
  } catch (error) {
    console.error("Error fetching prompts:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

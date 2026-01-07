import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { parseDateString, isSameCalendarDay } from "@/lib/date-utils"

// GET - Check if a date already has a prompt
export async function GET(request: Request) {
  try {
    const session = await getSession()

    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get("date")

    if (!dateStr) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      )
    }

    // Parse the date string (format: YYYY-MM-DD) and create date at start of day in UTC
    const checkDate = parseDateString(dateStr)

    // Get all prompts and check by exact calendar date match
    const allPrompts = await prisma.prompt.findMany()

    // Check if any prompt matches this exact calendar date
    const exists = allPrompts.some((p: { promptDate: Date | string }) => {
      const promptDate = new Date(p.promptDate)
      return isSameCalendarDay(promptDate, checkDate)
    })

    return NextResponse.json({
      exists: exists,
      available: !exists,
    })
  } catch (error) {
    console.error("Error checking date:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

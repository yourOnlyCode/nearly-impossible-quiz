import { NextResponse } from "next/server"
import { getTodayUTC, formatDateString } from "@/lib/date-utils"

// GET - Get today's date from server
export async function GET() {
  try {
    const today = getTodayUTC()
    const todayStr = formatDateString(today)
    
    return NextResponse.json({
      today: today.toISOString(),
      todayString: todayStr,
      year: today.getUTCFullYear(),
      month: today.getUTCMonth() + 1,
      day: today.getUTCDate(),
    })
  } catch (error) {
    console.error("Error getting today's date:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

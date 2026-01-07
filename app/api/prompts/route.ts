import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getTodayUTC, isSameCalendarDay, parseDateString, isFutureDate, formatDateString, parseLocalDateString, isSameLocalCalendarDay } from "@/lib/date-utils"

// GET - Get today's prompt ONLY (based on client's timezone)
export async function GET(request: Request) {
  try {
    // Get client's local date from query parameter
    // Format: YYYY-MM-DD (e.g., "2026-01-07")
    const { searchParams } = new URL(request.url)
    const clientDateStr = searchParams.get("date")
    
    let today: Date
    if (clientDateStr) {
      // Use client's provided date (their local calendar day)
      today = parseLocalDateString(clientDateStr)
    } else {
      // Fallback to server UTC if no date provided (for backward compatibility)
      today = getTodayUTC()
    }
    
    // Extract today's calendar day components once
    const todayYear = today.getUTCFullYear()
    const todayMonth = today.getUTCMonth()
    const todayDay = today.getUTCDate()
    
    // Get all prompts
    const allPrompts = await prisma.prompt.findMany({
      orderBy: {
        promptDate: 'asc' // Order by ascending to process chronologically
      }
    })

    // Find the prompt that matches today's calendar date EXACTLY
    // Compare using local calendar day (year, month, day)
    // Prompts in DB are stored as UTC dates, but we compare calendar days
    let matchingPrompt = null
    for (const p of allPrompts) {
      const promptDate = new Date(p.promptDate)
      
      // Get the calendar day components from the prompt (stored as UTC but represents a calendar day)
      // Compare against today's calendar day
      const promptYear = promptDate.getUTCFullYear()
      const promptMonth = promptDate.getUTCMonth()
      const promptDay = promptDate.getUTCDate()
      
      // Match if same calendar day (year, month, day)
      if (promptYear === todayYear && promptMonth === todayMonth && promptDay === todayDay) {
        matchingPrompt = p
        break // Found today's prompt, stop searching
      }
    }

    if (!matchingPrompt) {
      return NextResponse.json(
        { error: "No prompt available for today" },
        { status: 404 }
      )
    }

    // Final validation: verify it's actually today's prompt (safety check)
    const finalPromptDate = new Date(matchingPrompt.promptDate)
    const finalYear = finalPromptDate.getUTCFullYear()
    const finalMonth = finalPromptDate.getUTCMonth()
    const finalDay = finalPromptDate.getUTCDate()
    
    if (finalYear !== todayYear || finalMonth !== todayMonth || finalDay !== todayDay) {
      // This should never happen, but safety check
      return NextResponse.json(
        { error: "No prompt available for today" },
        { status: 404 }
      )
    }

    // Don't send the solution to the client
    const { solution, ...promptWithoutSolution } = matchingPrompt

    return NextResponse.json(promptWithoutSolution)
  } catch (error) {
    console.error("Error fetching prompt:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Create a new prompt (admin only)
export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { content, solution, promptDate } = await request.json()

    if (!content || !solution || !promptDate) {
      return NextResponse.json(
        { error: "Content, solution, and promptDate are required" },
        { status: 400 }
      )
    }

    // Parse the date string (format: YYYY-MM-DD) and create date at start of day in UTC
    const date = parseDateString(promptDate)

    const prompt = await prisma.prompt.create({
      data: {
        content,
        solution: solution.trim(),
        promptDate: date,
      }
    })

    return NextResponse.json(prompt, { status: 201 })
  } catch (error: any) {
    console.error("Error creating prompt:", error)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A prompt already exists for this date" },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
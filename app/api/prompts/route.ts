import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getTodayUTC, isSameCalendarDay, parseDateString, isFutureDate, formatDateString } from "@/lib/date-utils"

// GET - Get today's prompt ONLY
export async function GET(request: Request) {
  try {
    // Get today's date based on server time (UTC)
    // This ensures we use the server's date, not the client's machine date
    const today = getTodayUTC()
    
    // Get all prompts
    const allPrompts = await prisma.prompt.findMany({
      orderBy: {
        promptDate: 'asc' // Order by ascending to process chronologically
      }
    })

    // Find the prompt that matches today's calendar date EXACTLY
    // IMPORTANT: Only match today's date, NEVER return future prompts
    let matchingPrompt = null
    for (const p of allPrompts) {
      const promptDate = new Date(p.promptDate)
      
      // NEVER return future prompts - skip immediately
      if (isFutureDate(promptDate)) {
        continue
      }
      
      // Check if it's an exact calendar date match (year, month, day)
      if (isSameCalendarDay(promptDate, today)) {
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
    
    if (!isSameCalendarDay(finalPromptDate, today) || isFutureDate(finalPromptDate)) {
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
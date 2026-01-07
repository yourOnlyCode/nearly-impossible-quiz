import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { promptId, guessText } = await request.json()

    if (!promptId || !guessText) {
      return NextResponse.json(
        { error: "promptId and guessText are required" },
        { status: 400 }
      )
    }

    // Get the prompt and solution
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId }
    })

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404 }
      )
    }

    // Case-insensitive comparison
    const isCorrect = prompt.solution.trim().toLowerCase() === guessText.trim().toLowerCase()

    // Return just the validation result - client will track the score
    return NextResponse.json({
      isCorrect,
    })
  } catch (error) {
    console.error("Error validating guess:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const promptId = searchParams.get("promptId")

    if (!promptId) {
      return NextResponse.json(
        { error: "promptId is required" },
        { status: 400 }
      )
    }

    // Get all guesses for this user and prompt
    const guesses = await prisma.guess.findMany({
      where: {
        userId: session.user.id,
        promptId: promptId,
      },
      orderBy: {
        guessOrder: "asc",
      },
    })

    // Find if there's a correct guess
    const correctGuess = guesses.find((g: { isCorrect: boolean }) => g.isCorrect)
    const isCorrect = !!correctGuess

    // Score is the number of guesses (higher = worse)
    const score = guesses.length

    return NextResponse.json({
      score,
      isCorrect,
      guesses: guesses.map((g: { guessText: string }) => g.guessText),
    })
  } catch (error) {
    console.error("Error fetching score:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
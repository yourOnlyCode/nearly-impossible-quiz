import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get all guesses for this user
    const guesses = await prisma.guess.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        prompt: {
          select: {
            id: true,
            content: true,
            promptDate: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Calculate scores per prompt
    const promptScores: Record<string, { prompt: any; score: number; isCorrect: boolean }> = {}

    guesses.forEach((guess: any) => {
      const promptId = guess.promptId
      if (!promptScores[promptId]) {
        promptScores[promptId] = {
          prompt: guess.prompt,
          score: 0,
          isCorrect: false,
        }
      }
      promptScores[promptId].score = Math.max(promptScores[promptId].score, guess.guessOrder)
      if (guess.isCorrect) {
        promptScores[promptId].isCorrect = true
      }
    })

    // Calculate grand total score (sum of all scores)
    const grandTotal = Object.values(promptScores).reduce(
      (sum, { score }) => sum + score,
      0
    )

    return NextResponse.json({
      grandTotal,
      promptScores: Object.values(promptScores),
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
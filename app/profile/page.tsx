"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PromptScore {
  prompt: {
    id: string
    content: string
    promptDate: string
  }
  score: number
  isCorrect: boolean
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [grandTotal, setGrandTotal] = useState(0)
  const [promptScores, setPromptScores] = useState<PromptScore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      fetchProfile()
    }
  }, [status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        const data = await response.json()
        setGrandTotal(data.grandTotal || 0)
        setPromptScores(data.promptScores || [])
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </main>
    )
  }

  if (!session) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/quiz">
            <Button variant="outline">Back to Quiz</Button>
          </Link>
          {session.user.isAdmin && (
            <Link href="/admin">
              <Button variant="outline">Admin</Button>
            </Link>
          )}
          <Button variant="outline" onClick={() => signOut()}>
            Logout
          </Button>
        </div>

        <Card className="w-full mb-6">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              {session.user.name || session.user.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-4xl font-bold mb-2">{grandTotal}</div>
              <div className="text-muted-foreground">Grand Total Score</div>
              <p className="text-sm text-muted-foreground mt-2">
                (Lower is better - this is your total number of guesses across all challenges)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Challenge History</CardTitle>
            <CardDescription>Your scores for each challenge</CardDescription>
          </CardHeader>
          <CardContent>
            {promptScores.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No challenges completed yet. Start playing to see your scores!
              </p>
            ) : (
              <div className="space-y-4">
                {promptScores.map((item) => (
                  <div
                    key={item.prompt.id}
                    className="border rounded-lg p-4 flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <div className="font-semibold mb-1">
                        {new Date(item.prompt.promptDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {item.prompt.content}
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span className={item.isCorrect ? "text-green-600" : "text-muted-foreground"}>
                          {item.isCorrect ? "✓ Solved" : "Not solved"}
                        </span>
                        <span>Score: {item.score}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
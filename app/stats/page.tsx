"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GradientOrbs } from "@/components/gradient-orbs"
import { getAllPromptData, getGrandTotalScore, PromptData } from "@/lib/localStorage"

export default function StatsPage() {
  const [grandTotal, setGrandTotal] = useState(0)
  const [promptDataList, setPromptDataList] = useState<PromptData[]>([])

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = () => {
    const allData = getAllPromptData()
    const total = getGrandTotalScore()
    setPromptDataList(allData)
    setGrandTotal(total)
  }

  const clearStats = () => {
    if (confirm("Are you sure you want to clear all your stats? This cannot be undone.")) {
      localStorage.removeItem("nearly-impossible-quiz-stats")
      setGrandTotal(0)
      setPromptDataList([])
    }
  }

  return (
    <main className="min-h-screen relative p-4 bg-black">
      <GradientOrbs />
      <div className="content-wrapper max-w-4xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/quiz">
            <Button variant="outline" className="glass border-white/30 text-white hover:bg-white/20">Back to Quiz</Button>
          </Link>
        </div>

        <Card className="w-full mb-6 glass border-white/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Your Stats
            </CardTitle>
            <CardDescription className="text-white/70">Your performance across all challenges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{grandTotal}</div>
              <div className="text-white/70">Grand Total Score</div>
              <p className="text-sm text-white/60 mt-2">
                (Lower is better - this is your total number of guesses across all challenges)
              </p>
              <div className="mt-4 text-sm text-white/70">
                Challenges Solved: <span className="font-semibold text-white">{promptDataList.filter(p => p.isCorrect).length} / {promptDataList.length}</span>
              </div>
              {promptDataList.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-4 glass border-red-500/30 bg-red-500/20 text-red-200 hover:bg-red-500/30"
                  onClick={clearStats}
                >
                  Clear All Stats
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="w-full glass border-white/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Challenge History
            </CardTitle>
            <CardDescription className="text-white/70">Your scores for each challenge</CardDescription>
          </CardHeader>
          <CardContent>
            {promptDataList.length === 0 ? (
              <p className="text-center text-white/60 py-8">
                No challenges completed yet. Start playing to see your stats!
              </p>
            ) : (
              <div className="space-y-4">
                {promptDataList.map((item) => (
                  <div
                    key={item.promptId}
                    className="glass border-white/20 bg-white/5 rounded-lg p-4 backdrop-blur-sm hover:bg-white/10 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-semibold mb-1 text-white">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex gap-4 text-sm mt-2 flex-wrap">
                        <span className={item.isCorrect ? "text-green-400 font-semibold" : "text-white/60"}>
                          {item.isCorrect ? "✓ Solved" : "Not solved"}
                        </span>
                        <span className="text-white/80">Score: <span className="font-semibold text-white">{item.score}</span></span>
                        {item.guesses.length > 0 && (
                          <span className="text-white/60">
                            Guesses: <span className="text-white/80">{item.guesses.join(", ")}</span>
                          </span>
                        )}
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
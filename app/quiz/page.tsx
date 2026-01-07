"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert-simple"
import { GradientOrbs } from "@/components/gradient-orbs"
import { WelcomeModal } from "@/components/welcome-modal"
import { getPromptData, savePromptData, getGrandTotalScore } from "@/lib/localStorage"

interface Prompt {
  id: string
  content: string
  promptDate: string
}

export default function QuizPage() {
  const { data: session } = useSession()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [guess, setGuess] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [score, setScore] = useState(0)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [message, setMessage] = useState("")
  const [guesses, setGuesses] = useState<string[]>([])
  const [grandTotal, setGrandTotal] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    // Check if user has seen welcome modal
    const hasSeenWelcome = localStorage.getItem("nearly-impossible-welcome-seen")
    if (!hasSeenWelcome) {
      setShowWelcome(true)
    }
    fetchPrompt()
  }, [])

  const handleWelcomeClose = () => {
    setShowWelcome(false)
    localStorage.setItem("nearly-impossible-welcome-seen", "true")
  }

  useEffect(() => {
    setGrandTotal(getGrandTotalScore())
  }, [score, isCorrect])

  const loadLocalData = (promptId: string) => {
    const localData = getPromptData(promptId)
    if (localData) {
      setScore(localData.score)
      setGuesses(localData.guesses)
      setIsCorrect(localData.isCorrect)
      if (localData.isCorrect) {
        setMessage("You've already solved this challenge! Check back tomorrow for a new one.")
      }
    }
  }

  const fetchPrompt = async () => {
    try {
      // Get client's local date (YYYY-MM-DD format)
      const now = new Date()
      const clientYear = now.getFullYear()
      const clientMonth = String(now.getMonth() + 1).padStart(2, '0')
      const clientDay = String(now.getDate()).padStart(2, '0')
      const clientDateStr = `${clientYear}-${clientMonth}-${clientDay}`
      
      // Send client's local date to API
      const response = await fetch(`/api/prompts?date=${clientDateStr}`)
      if (response.ok) {
        const data = await response.json()
        
        // Verify the prompt date matches today (client-side validation)
        // The prompt date comes as UTC but represents a calendar day
        // Convert it to a UTC date and extract the calendar day components
        const promptDate = new Date(data.promptDate)
        const promptYear = promptDate.getUTCFullYear()
        const promptMonth = promptDate.getUTCMonth()
        const promptDay = promptDate.getUTCDate()
        
        // Compare calendar days: prompt (from UTC date) vs client local date
        if (promptYear !== clientYear || promptMonth !== (now.getMonth()) || promptDay !== now.getDate()) {
          console.error(`Prompt date ${promptYear}-${promptMonth + 1}-${promptDay} does not match client today ${clientYear}-${now.getMonth() + 1}-${now.getDate()}`)
          setMessage("No prompt available for today. Check back tomorrow!")
          setPrompt(null)
          return
        }
        
        setPrompt(data)
        loadLocalData(data.id)
      } else {
        setMessage("No prompt available for today. Check back tomorrow!")
      }
    } catch (error) {
      setMessage("Error loading prompt. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt || !guess.trim() || isCorrect) return

    setSubmitting(true)
    setMessage("")

    try {
      const response = await fetch("/api/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptId: prompt.id,
          guessText: guess,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const newGuesses = [...guesses, guess.trim()]
        const newScore = newGuesses.length

        if (data.isCorrect) {
          setIsCorrect(true)
          setScore(newScore)
          setGuesses(newGuesses)
          setMessage(`Correct! You solved it in ${newScore} guess${newScore > 1 ? "es" : ""}!`)
          
          // Save to localStorage
          savePromptData(prompt.id, {
            promptId: prompt.id,
            date: prompt.promptDate,
            guesses: newGuesses,
            score: newScore,
            isCorrect: true,
            solvedAt: new Date().toISOString(),
          })
        } else {
          setScore(newScore)
          setGuesses(newGuesses)
          setMessage(`Incorrect. Try again! (Attempts: ${newScore})`)
          
          // Save to localStorage
          savePromptData(prompt.id, {
            promptId: prompt.id,
            date: prompt.promptDate,
            guesses: newGuesses,
            score: newScore,
            isCorrect: false,
          })
        }
        setGrandTotal(getGrandTotalScore())
        setGuess("")
      } else {
        setMessage(data.error || "Error submitting guess")
      }
    } catch (error) {
      setMessage("Error submitting guess. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen relative flex items-center justify-center bg-black">
        <GradientOrbs />
        <div className="content-wrapper text-white">Loading...</div>
      </main>
    )
  }

  if (!prompt) {
    return (
      <main className="min-h-screen relative flex items-center justify-center p-4 bg-black">
        <GradientOrbs />
        <div className="content-wrapper w-full max-w-2xl">
          <Card className="glass border-white/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white">No Prompt Available</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">{message || "No prompt available for today. Check back tomorrow!"}</p>
              <div className="mt-4 flex gap-2">
                <Link href="/">
                  <Button variant="outline" className="glass border-white/30 text-white hover:bg-white/20">Home</Button>
                </Link>
                <Link href="/stats">
                  <Button variant="outline" className="glass border-white/30 text-white hover:bg-white/20">View Stats</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen relative p-4 bg-black">
      <GradientOrbs />
      <WelcomeModal open={showWelcome} onClose={handleWelcomeClose} />
      <div className="content-wrapper max-w-4xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="outline" className="glass border-white/30 text-white hover:bg-white/20">Home</Button>
          </Link>
          <div className="flex gap-4 items-center">
            <div className="text-sm text-white/90">
              {score > 0 && (
                <>
                  Score: <span className="font-bold text-white">{score}</span>
                  {grandTotal > 0 && (
                    <span className="ml-4 text-white/70">
                      Total: <span className="font-bold text-white">{grandTotal}</span>
                    </span>
                  )}
                </>
              )}
            </div>
            <Link href="/stats">
              <Button variant="outline" className="glass border-white/30 text-white hover:bg-white/20">Stats</Button>
            </Link>
            {session?.user?.isAdmin && (
              <Link href="/admin">
                <Button variant="outline" className="glass border-white/30 text-white hover:bg-white/20">Admin</Button>
              </Link>
            )}
          </div>
        </div>

        <Card className="w-full glass border-white/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Today's Challenge
            </CardTitle>
            <CardDescription className="text-white/70">
              {(() => {
                // Extract calendar day from prompt date (stored as UTC but represents a calendar day)
                const promptDate = new Date(prompt.promptDate)
                const year = promptDate.getUTCFullYear()
                const month = promptDate.getUTCMonth()
                const day = promptDate.getUTCDate()
                
                // Create a date in local timezone for display (but using the calendar day from UTC)
                const displayDate = new Date(year, month, day)
                return displayDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              })()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg whitespace-pre-wrap text-white/90 leading-relaxed">
              {prompt.content}
            </div>

            {message && (
              <Alert variant={isCorrect ? "default" : "destructive"} className={isCorrect ? "glass border-green-500/30 bg-green-500/20" : "glass border-red-500/30 bg-red-500/20"}>
                <AlertTitle className={isCorrect ? "text-green-200" : "text-red-200"}>{isCorrect ? "Success! 🎉" : "Incorrect"}</AlertTitle>
                <AlertDescription className={isCorrect ? "text-green-100" : "text-red-100"}>{message}</AlertDescription>
              </Alert>
            )}

            {guesses.length > 0 && !isCorrect && (
              <div className="text-sm text-white/70 bg-white/5 rounded-lg p-4 backdrop-blur-sm">
                <p className="font-semibold mb-2 text-white">Previous guesses:</p>
                <ul className="list-disc list-inside space-y-1">
                  {guesses.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>
            )}

            {!isCorrect ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter your answer..."
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  disabled={submitting}
                  className="text-lg glass border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:border-white/50"
                  autoFocus
                />
                <Button 
                  type="submit" 
                  className="w-full glass border-white/30 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg disabled:opacity-50" 
                  disabled={submitting || !guess.trim()}
                >
                  {submitting ? "Submitting..." : "Submit Answer"}
                </Button>
              </form>
            ) : (
              <div className="p-5 glass border-green-500/30 bg-green-500/20 rounded-xl backdrop-blur-sm">
                <p className="text-green-100 text-center font-medium">
                  🎉 You've solved this challenge! Check back tomorrow for a new one.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert-simple"
import { GradientOrbs } from "@/components/gradient-orbs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [content, setContent] = useState("")
  const [solution, setSolution] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [dateError, setDateError] = useState<string | null>(null)
  const [checkingDate, setCheckingDate] = useState(false)
  const [existingPrompts, setExistingPrompts] = useState<Array<{ id: string; promptDate: string }>>([])
  const [popoverOpen, setPopoverOpen] = useState(false)

  // Fetch all prompts on page load
  useEffect(() => {
    const fetchPrompts = async () => {
      if (status === "authenticated" && session?.user?.isAdmin) {
        try {
          const response = await fetch("/api/prompts/all")
          if (response.ok) {
            const data = await response.json()
            setExistingPrompts(data)
          }
        } catch (error) {
          console.error("Error fetching prompts:", error)
        }
      }
    }

    fetchPrompts()
  }, [status, session])

  useEffect(() => {
    if (status === "loading") {
      return // Still loading, wait
    }

    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      // Debug: Log session data to help troubleshoot
      console.log("Session data:", session)
      console.log("isAdmin:", session?.user?.isAdmin)
      
      if (!session?.user?.isAdmin) {
        console.log("User is not an admin, redirecting...")
        router.push("/quiz")
        return
      }
    }
  }, [status, session, router])

  // Check if date is available when it changes or when popover opens
  useEffect(() => {
    const checkDateAvailability = async () => {
      if (!date) {
        setDateError(null)
        return
      }

      setCheckingDate(true)
      setDateError(null)

      try {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const dateStr = `${year}-${month}-${day}`
        
        const response = await fetch(`/api/prompts/check-date?date=${dateStr}`)
        const data = await response.json()

        if (response.ok) {
          if (data.exists) {
            setDateError("Prompt already assigned that day")
          } else {
            setDateError(null)
          }
        }
      } catch (error) {
        console.error("Error checking date:", error)
      } finally {
        setCheckingDate(false)
      }
    }

    checkDateAvailability()
  }, [date, popoverOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) {
      setMessage({ type: "error", text: "Please select a date" })
      return
    }

    if (dateError) {
      setMessage({ type: "error", text: dateError })
      return
    }

    setMessage(null)
    setLoading(true)

    try {
      // Format date as YYYY-MM-DD
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const promptDate = `${year}-${month}-${day}`
      
      const response = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          solution,
          promptDate,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: "Prompt created successfully!" })
        setContent("")
        setSolution("")
        setDate(new Date())
        setDateError(null)
        // Refresh prompts list
        const promptsResponse = await fetch("/api/prompts/all")
        if (promptsResponse.ok) {
          const promptsData = await promptsResponse.json()
          setExistingPrompts(promptsData)
        }
      } else {
        // Check if it's a duplicate date error and show it near the date field
        if (data.error && data.error.includes("already exists for this date")) {
          setDateError("Prompt already assigned that day")
          setMessage({ type: "error", text: "Please select a different date" })
        } else {
          setMessage({ type: "error", text: data.error || "Failed to create prompt" })
        }
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  // Show loading state while checking auth
  if (status === "loading") {
    return (
      <main className="min-h-screen relative flex items-center justify-center bg-black">
        <GradientOrbs />
        <div className="content-wrapper text-white">Loading...</div>
      </main>
    )
  }

  // If not authenticated, redirect happens in useEffect
  if (status === "unauthenticated") {
    return null
  }

  // If authenticated but not admin, show helpful message
  if (status === "authenticated" && (!session || !session.user.isAdmin)) {
    return (
      <main className="min-h-screen relative flex items-center justify-center bg-black">
        <GradientOrbs />
        <div className="content-wrapper">
          <Card className="glass border-white/30 shadow-2xl max-w-md">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
              <p className="text-white/80 mb-4">
                Admin privileges required to access this page.
              </p>
              {session && (
                <p className="text-white/60 text-sm mb-4">
                  Logged in as: {session.user.email}
                </p>
              )}
              <div className="flex justify-center gap-2">
                <Link href="/quiz">
                  <Button variant="outline" className="glass border-white/30 text-white hover:bg-white/20">
                    Go to Quiz
                  </Button>
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
      <div className="content-wrapper max-w-4xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/quiz">
            <Button variant="outline" className="glass border-white/30 text-white hover:bg-white/20">Back to Quiz</Button>
          </Link>
          <Link href="/stats">
            <Button variant="outline" className="glass border-white/30 text-white hover:bg-white/20">Stats</Button>
          </Link>
        </div>

        <Card className="w-full glass border-white/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Admin Dashboard
            </CardTitle>
            <CardDescription className="text-white/70">
              Create new prompts for the quiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            {message && (
              <Alert 
                variant={message.type === "error" ? "destructive" : "default"} 
                className={`mb-4 glass border-white/30 ${
                  message.type === "error" 
                    ? "border-red-500/30 bg-red-500/20" 
                    : "border-green-500/30 bg-green-500/20"
                }`}
              >
                <AlertTitle className={message.type === "error" ? "text-red-200" : "text-green-200"}>
                  {message.type === "error" ? "Error" : "Success"}
                </AlertTitle>
                <AlertDescription className={message.type === "error" ? "text-red-100" : "text-green-100"}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="promptDate" className="text-white">Prompt Date</Label>
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal glass border-white/30 bg-white/10 text-white hover:bg-white/20",
                        !date && "text-muted-foreground",
                        dateError && "border-red-500/50"
                      )}
                      disabled={checkingDate}
                      onClick={() => setPopoverOpen(true)}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkingDate ? (
                        <span>Checking date...</span>
                      ) : date ? (
                        format(date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 glass border-white/30 bg-black/80 backdrop-blur-xl" align="start">
                    <Calendar 
                      value={date} 
                      onChange={setDate}
                      onSelect={() => setPopoverOpen(false)}
                      className="text-white"
                    />
                  </PopoverContent>
                </Popover>
                {dateError && (
                  <p className="text-xs text-red-400 font-medium flex items-center gap-1">
                    <span>⚠</span>
                    {dateError}
                  </p>
                )}
                {!dateError && (
                  <p className="text-xs text-white/60">
                    The date when this prompt should be displayed
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-white">Prompt Content</Label>
                <textarea
                  id="content"
                  className="flex min-h-[120px] w-full rounded-md border border-white/30 glass bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter the prompt, riddle, puzzle, or question..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="solution" className="text-white">Solution</Label>
                <Input
                  id="solution"
                  type="text"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder="Enter the correct answer"
                  className="glass border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:border-white/50"
                  required
                />
                <p className="text-xs text-white/60">
                  Answers are case-insensitive
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full glass border-white/30 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg disabled:opacity-50" 
                disabled={loading || !date}
              >
                {loading ? "Creating..." : "Create Prompt"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GradientOrbs } from "@/components/gradient-orbs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert-simple"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Registration failed")
      } else {
        router.push("/login?registered=true")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 bg-black">
      <GradientOrbs />
      <div className="content-wrapper w-full max-w-md">
        <Card className="glass border-white/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Sign Up
            </CardTitle>
            <CardDescription className="text-center text-white/70">
              Create an account to track your scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Name (Optional)</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:border-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:border-white/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:border-white/50"
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive" className="glass border-red-500/30 bg-red-500/20">
                  <AlertTitle className="text-red-200">Error</AlertTitle>
                  <AlertDescription className="text-red-100">{error}</AlertDescription>
                </Alert>
              )}
              <Button 
                type="submit" 
                className="w-full glass border-white/30 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg disabled:opacity-50" 
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <p className="text-white/70">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 hover:underline font-medium">
                  Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
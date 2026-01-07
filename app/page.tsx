import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientOrbs } from "@/components/gradient-orbs";

export default function Home() {
  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 bg-black">
      <GradientOrbs />
      <div className="content-wrapper w-full max-w-md">
        <Card className="glass border-white/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Nearly Impossible Quiz
            </CardTitle>
            <CardDescription className="text-center text-white/70 mt-2">
              Daily prompts, riddles, and puzzles with wacky solutions from across the world
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3">
              <Link href="/quiz" className="w-full">
                <Button className="w-full glass border-white/30 hover:bg-white/20 text-white font-semibold shadow-lg" size="lg">
                  Play Today's Quiz
                </Button>
              </Link>
              <Link href="/stats" className="w-full">
                <Button variant="outline" className="w-full glass border-white/30 hover:bg-white/10 text-white/90 font-semibold" size="lg">
                  View Stats
                </Button>
              </Link>
            </div>
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/20">
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full glass border-white/30 hover:bg-white/10 text-white/90 font-medium" size="lg">
                  Login
                </Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button variant="outline" className="w-full glass border-white/30 hover:bg-white/10 text-white/90 font-medium" size="lg">
                  Sign Up
                </Button>
              </Link>
            </div>
            <p className="text-xs text-center text-white/60 mt-4">
              No account needed. Just start playing! ✨
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
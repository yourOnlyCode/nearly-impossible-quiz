"use client"

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertFooter,
  AlertHeader,
  AlertTitle,
  AlertAction,
} from "@/components/ui/alert"

interface WelcomeModalProps {
  open: boolean
  onClose: () => void
}

export function WelcomeModal({ open, onClose }: WelcomeModalProps) {
  return (
    <Alert open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertContent className="max-w-2xl glass border-white/30 rounded-2xl z-[100]">
        <AlertHeader>
          <AlertTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
            Welcome to Nearly Impossible Quiz! 🎯
          </AlertTitle>
          <AlertDescription className="text-base pt-4 text-left">
            <div className="space-y-4">
              <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/20">
                <h3 className="font-semibold text-lg mb-3 text-foreground">How to Play</h3>
                <ol className="list-decimal list-inside space-y-2 text-foreground/80">
                  <li>Each day, a new puzzle, riddle, or challenge is presented</li>
                  <li>Read the prompt carefully - the answer might be wacky!</li>
                  <li>Type your guess in the input box</li>
                  <li>Answers are <strong className="text-foreground">case-insensitive</strong> - type however you like!</li>
                  <li>Each guess counts as +1 to your score (lower is better!)</li>
                  <li>Once you solve it, check back tomorrow for a new challenge</li>
                </ol>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-5 backdrop-blur-sm border border-blue-300/30">
                <h3 className="font-semibold text-lg mb-3 text-foreground">Important Notes 🎲</h3>
                <ul className="list-disc list-inside space-y-2 text-foreground/80">
                  <li><strong className="text-foreground">Solutions are truly random</strong> - they could reference <em>any</em> niche thing, concept, meme, game, movie, song, cultural reference, or obscure knowledge that exists in the world</li>
                  <li>There's no pattern or predictable logic - each puzzle has its own unique reasoning that you'll need to discover</li>
                  <li>The connection between the prompt and solution might seem impossible at first, but there's always a logic (however wacky it may be!)</li>
                  <li>Your score is saved locally in your browser, so you can track your progress over time</li>
                </ul>
              </div>
            </div>
          </AlertDescription>
        </AlertHeader>
        <AlertFooter>
          <AlertAction
            onClick={onClose}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 w-full"
          >
            Let's Play! 🚀
          </AlertAction>
        </AlertFooter>
      </AlertContent>
    </Alert>
  )
}
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

// Logo component matching the site's blue/cyan theme
function QuizLogo({ className }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      {/* Question mark shape with gradient */}
      <path
        d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S6 21.523 6 16 10.477 6 16 6z"
        fill="url(#logoGradient)"
      />
      <path
        d="M16 12c-1.105 0-2 .895-2 2h2v-2zm0 4v2h-2c0 1.105.895 2 2 2s2-.895 2-2-2-2-2-2z"
        fill="url(#logoGradient)"
      />
      <circle cx="16" cy="22" r="1.5" fill="url(#logoGradient)" />
    </svg>
  )
}

export function WelcomeModal({ open, onClose }: WelcomeModalProps) {
  return (
    <Alert open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertContent className="max-w-2xl glass border-white/30 rounded-2xl z-[100] max-h-[90vh] flex flex-col m-4 sm:m-0 p-0 overflow-hidden">
        <AlertHeader className="flex-shrink-0 p-4 sm:p-6 pb-4">
          <AlertTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
            <span>Welcome to Nearly Impossible Quiz!</span>
            <QuizLogo className="flex-shrink-0" />
          </AlertTitle>
        </AlertHeader>
        
        <AlertDescription className="text-sm sm:text-base text-left overflow-y-auto flex-1 min-h-0 px-4 sm:px-6 custom-scrollbar">
          <div className="space-y-4 pr-2 pb-4">
            <div className="bg-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-sm border border-white/20">
              <h3 className="font-semibold text-base sm:text-lg mb-3 text-foreground">How to Play</h3>
              <ol className="list-decimal list-inside space-y-2 text-foreground/80 text-sm sm:text-base">
                <li>Each day, a new puzzle, riddle, or challenge is presented</li>
                <li>Read the prompt carefully - google and AI allowed!</li>
                <li>Type your guess in the input box</li>
                <li>Answers are <strong className="text-foreground">case-insensitive</strong> - type however you like!</li>
                <li>Each guess counts as +1 to your score (lower is better!)</li>
                <li>Once you solve it, check back tomorrow for a new challenge</li>
              </ol>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-4 sm:p-5 backdrop-blur-sm border border-blue-300/30">
              <h3 className="font-semibold text-base sm:text-lg mb-3 text-foreground">Important Notes 🎲</h3>
              <ul className="list-disc list-inside space-y-2 text-foreground/80 text-sm sm:text-base">
                <li><strong className="text-foreground">Solutions are truly random</strong> - they could reference <em>any</em> niche thing, concept, meme, game, movie, song, cultural reference, or obscure knowledge that exists in the world</li>
                <li>There's no pattern or predictable logic - each puzzle has its own unique reasoning that you'll need to discover</li>
                <li>The connection between the prompt and solution might seem impossible at first, but there's always a logic (however wacky it may be!)</li>
                <li>Your score is saved locally in your browser, so you can track your progress over time</li>
              </ul>
            </div>
          </div>
        </AlertDescription>
        
        <AlertFooter className="flex-shrink-0 pt-4 border-t border-white/20 glass border-t-white/30 sticky bottom-0 px-4 sm:px-6 pb-4 sm:pb-6 backdrop-blur-md">
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
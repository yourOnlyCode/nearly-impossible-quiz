// Utility functions for managing quiz data in localStorage

export interface PromptData {
  promptId: string
  date: string
  guesses: string[]
  score: number
  isCorrect: boolean
  solvedAt?: string
}

export interface UserStats {
  [promptId: string]: PromptData
}

const STORAGE_KEY = "nearly-impossible-quiz-stats"

export function getLocalStats(): UserStats {
  if (typeof window === "undefined") return {}
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

export function savePromptData(promptId: string, data: PromptData) {
  if (typeof window === "undefined") return
  
  const stats = getLocalStats()
  stats[promptId] = data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

export function getPromptData(promptId: string): PromptData | null {
  const stats = getLocalStats()
  return stats[promptId] || null
}

export function getGrandTotalScore(): number {
  const stats = getLocalStats()
  return Object.values(stats).reduce((total, data) => total + data.score, 0)
}

export function getAllPromptData(): PromptData[] {
  const stats = getLocalStats()
  return Object.values(stats).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}
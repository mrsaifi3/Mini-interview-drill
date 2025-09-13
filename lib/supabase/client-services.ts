import { createClient } from "./client"

// Types for our database schema
export interface Drill {
  id: string
  title: string
  difficulty: "easy" | "medium" | "hard"
  tags: string[]
  questions: Question[]
  created_at: string
}

export interface Question {
  id: number
  prompt: string
  keywords: string[]
}

export interface Attempt {
  id: string
  user_id: string
  drill_id: string
  answers: Answer[]
  score: number
  created_at: string
}

export interface Answer {
  questionId: number
  answer: string
}

// Database operations for client-side
export const drillsService = {
  async getAll(): Promise<Drill[]> {
    const supabase = createClient()
    const { data, error } = await supabase.from("drills").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Drill | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from("drills").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  async getByDifficulty(difficulty: string): Promise<Drill[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("drills")
      .select("*")
      .eq("difficulty", difficulty)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },
}

export const attemptsService = {
  async create(attempt: Omit<Attempt, "id" | "created_at">): Promise<Attempt> {
    const supabase = createClient()
    const { data, error } = await supabase.from("attempts").insert(attempt).select().single()

    if (error) throw error
    return data
  },

  async getByUserId(userId: string, limit = 5): Promise<Attempt[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("attempts")
      .select(`
        *,
        drills (
          title,
          difficulty
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  },

  async getStats(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("attempts")
      .select("score, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error

    const attempts = data || []
    const totalAttempts = attempts.length
    const averageScore =
      totalAttempts > 0 ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts) : 0

    return {
      totalAttempts,
      averageScore,
      recentAttempts: attempts.slice(0, 10),
    }
  },
}

// Scoring utility
export function calculateScore(answers: Answer[], questions: Question[]): number {
  let totalKeywords = 0
  let matchedKeywords = 0

  questions.forEach((question) => {
    const answer = answers.find((a) => a.questionId === question.id)
    if (!answer) return

    const answerText = answer.answer.toLowerCase()
    totalKeywords += question.keywords.length

    question.keywords.forEach((keyword) => {
      if (answerText.includes(keyword.toLowerCase())) {
        matchedKeywords++
      }
    })
  })

  return totalKeywords > 0 ? Math.round((matchedKeywords / totalKeywords) * 100) : 0
}

// Aliases for backward compatibility
export const clientDrillsService = drillsService
export const clientAttemptsService = attemptsService

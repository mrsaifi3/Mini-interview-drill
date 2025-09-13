import { createClient } from "./server"

// Re-export types from client services
export type { Drill, Question, Attempt, Answer } from "./client-services"

// Database operations for server-side
export const serverDrillsService = {
  async getAll() {
    const supabase = await createClient()
    const { data, error } = await supabase.from("drills").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from("drills").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },
}

export const serverAttemptsService = {
  async getByUserId(userId: string, limit = 5) {
    const supabase = await createClient()
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
    const supabase = await createClient()
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

"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Clock, Award } from "lucide-react"
import { attemptsService } from "@/lib/supabase/client-services"

interface UserStatsData {
  totalAttempts: number
  averageScore: number
  recentAttempts: Array<{
    score: number
    created_at: string
  }>
}

export function UserStats() {
  const { user } = useUser()
  const [stats, setStats] = useState<UserStatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      if (!user?.id) return

      try {
        const data = await attemptsService?.getStats(user.id)
        setStats(data)
      } catch (error) {
        // console.error("Error fetching user stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user?.id])

  if (loading) {
    return (
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Start your first drill!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">No attempts yet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Drills completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Keep practicing!</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getPerformanceBadge = (score: number) => {
    if (score >= 80) return { text: "Excellent", color: "bg-green-100 text-green-800" }
    if (score >= 60) return { text: "Good", color: "bg-blue-100 text-blue-800" }
    if (score >= 40) return { text: "Fair", color: "bg-yellow-100 text-yellow-800" }
    return { text: "Needs Work", color: "bg-red-100 text-red-800" }
  }

  const performance = getPerformanceBadge(stats.averageScore)
  const thisWeekAttempts = stats.recentAttempts.filter((attempt) => {
    const attemptDate = new Date(attempt.created_at)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return attemptDate >= weekAgo
  }).length

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalAttempts}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalAttempts === 1 ? "drill completed" : "drills completed"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageScore}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalAttempts > 1 ? "across all attempts" : "from your attempt"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Week</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{thisWeekAttempts}</div>
          <p className="text-xs text-muted-foreground">
            {thisWeekAttempts === 1 ? "drill completed" : "drills completed"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Performance</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge className={performance.color}>{performance.text}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Based on average score</p>
        </CardContent>
      </Card>
    </div>
  )
}

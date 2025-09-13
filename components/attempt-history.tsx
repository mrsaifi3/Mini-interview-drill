"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Target, TrendingUp, Award, BarChart3 } from "lucide-react"
import Link from "next/link"
import { attemptsService } from "@/lib/supabase/client-services"

interface AttemptWithDrill {
  id: string
  user_id: string
  drill_id: string
  score: number
  created_at: string
  drills: {
    title: string
    difficulty: "easy" | "medium" | "hard"
  }
}

const difficultyColors = {
  easy: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  hard: "bg-red-100 text-red-800 border-red-200",
}

export function AttemptHistory() {
  const { user } = useUser()
  const [attempts, setAttempts] = useState<AttemptWithDrill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAttempts() {
      if (!user?.id) return

      try {
        const data = await attemptsService.getByUserId(user.id, 20) // Get last 20 attempts
        setAttempts(data as AttemptWithDrill[])
      } catch (err) {
        setError("Failed to load attempt history")
        console.error("Error fetching attempts:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAttempts()
  }, [user?.id])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-blue-600"
    if (score >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { text: "Excellent", color: "bg-green-100 text-green-800" }
    if (score >= 60) return { text: "Good", color: "bg-blue-100 text-blue-800" }
    if (score >= 40) return { text: "Fair", color: "bg-yellow-100 text-yellow-800" }
    return { text: "Needs Work", color: "bg-red-100 text-red-800" }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const calculateStats = () => {
    if (attempts.length === 0) return null

    const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0)
    const averageScore = Math.round(totalScore / attempts.length)

    const difficultyStats = attempts.reduce(
      (acc, attempt) => {
        acc[attempt.drills.difficulty] = (acc[attempt.drills.difficulty] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const recentAttempts = attempts.slice(0, 5)
    const olderAttempts = attempts.slice(5, 10)
    const recentAvg =
      recentAttempts.length > 0
        ? Math.round(recentAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / recentAttempts.length)
        : 0
    const olderAvg =
      olderAttempts.length > 0
        ? Math.round(olderAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / olderAttempts.length)
        : 0

    const improvement = recentAvg - olderAvg

    return {
      totalAttempts: attempts.length,
      averageScore,
      difficultyStats,
      improvement,
    }
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Stats Cards Loading */}
        <div className="grid md:grid-cols-4 gap-6">
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

        {/* History Loading */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </CardContent>
      </Card>
    )
  }

  if (attempts.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No attempts yet</h3>
          <p className="text-gray-600 mb-6">Start taking drills to see your progress here.</p>
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700">Browse Drills</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-6">
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
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>{stats.averageScore}%</div>
              <p className="text-xs text-muted-foreground">Overall performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Improvement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.improvement >= 0 ? "text-green-600" : "text-red-600"}`}>
                {stats.improvement >= 0 ? "+" : ""}
                {stats.improvement}%
              </div>
              <p className="text-xs text-muted-foreground">Recent vs older attempts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Practiced</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {Object.entries(stats.difficultyStats).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">Difficulty level</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Attempt History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Attempts
          </CardTitle>
          <CardDescription>Your last {Math.min(attempts.length, 20)} drill attempts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attempts.map((attempt) => {
              const scoreBadge = getScoreBadge(attempt.score)
              return (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{attempt.drills.title}</h4>
                      <Badge variant="outline" className={`${difficultyColors[attempt.drills.difficulty]} capitalize`}>
                        {attempt.drills.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(attempt.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(attempt.score)}`}>{attempt.score}%</div>
                      <Badge className={scoreBadge.color}>{scoreBadge.text}</Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="text-center py-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Keep Improving!</h3>
          <p className="text-gray-600 mb-6">
            Regular practice is key to mastering technical interviews. Try a new drill to continue your progress.
          </p>
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700">Practice More Drills</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Code, Target } from "lucide-react"
import Link from "next/link"
import { drillsService, type Drill } from "@/lib/supabase/client-services"

const difficultyColors = {
  easy: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  hard: "bg-red-100 text-red-800 border-red-200",
}

const difficultyIcons = {
  easy: "🟢",
  medium: "🟡",
  hard: "🔴",
}

export function DrillsList() {
  const [drills, setDrills] = useState<Drill[]>([])
  const [filteredDrills, setFilteredDrills] = useState<Drill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")

  useEffect(() => {
    async function fetchDrills() {
      try {
        const data = await drillsService.getAll()
        setDrills(data)
        setFilteredDrills(data)
      } catch (err) {
        setError("Failed to load drills")
        console.error("Error fetching drills:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDrills()
  }, [])

  useEffect(() => {
    if (difficultyFilter === "all") {
      setFilteredDrills(drills)
    } else {
      setFilteredDrills(drills.filter((drill) => drill.difficulty === difficultyFilter))
    }
  }, [drills, difficultyFilter])

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
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

  return (
    <div>
      {/* Filter */}
      <div className="mb-6 flex items-center gap-4">
        <label htmlFor="difficulty-filter" className="text-sm font-medium text-gray-700">
          Filter by difficulty:
        </label>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Drills Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrills.map((drill) => (
          <Card key={drill.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2 text-balance">{drill.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Test your knowledge with 5 carefully crafted questions
                  </CardDescription>
                </div>
                <Badge variant="outline" className={`ml-2 ${difficultyColors[drill.difficulty]} capitalize`}>
                  {difficultyIcons[drill.difficulty]} {drill.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {drill.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {drill.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{drill.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Code className="h-4 w-4" />
                    <span>5 questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>~15 min</span>
                  </div>
                </div>

                {/* Action Button */}
                <Link href={`/drill/${drill.id}`} className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Target className="h-4 w-4 mr-2" />
                    Start Drill
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDrills.length === 0 && !loading && (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-gray-600 mb-4">No drills found for the selected difficulty.</p>
            <Button onClick={() => setDifficultyFilter("all")}>Show All Drills</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

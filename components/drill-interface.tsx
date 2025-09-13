"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Brain } from "lucide-react"
import Link from "next/link"
import { type Drill, type Answer, calculateScore, attemptsService } from "@/lib/supabase/client-services"

interface DrillInterfaceProps {
  drill: Drill
}

export function DrillInterface({ drill }: DrillInterfaceProps) {
  const { user } = useUser()
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  const progress = ((currentQuestion + 1) / drill.questions.length) * 100
  const isLastQuestion = currentQuestion === drill.questions.length - 1
  const currentAnswer = answers.find((a) => a.questionId === drill.questions[currentQuestion].id)?.answer || ""

  const handleAnswerChange = (value: string) => {
    const questionId = drill.questions[currentQuestion].id
    const updatedAnswers = answers.filter((a) => a.questionId !== questionId)
    updatedAnswers.push({ questionId, answer: value })
    setAnswers(updatedAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < drill.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    if (!user?.id || answers.length !== drill.questions.length) return

    setIsSubmitting(true)
    try {
      const calculatedScore = calculateScore(answers, drill.questions)

      await attemptsService.create({
        user_id: user.id,
        drill_id: drill.id,
        answers,
        score: calculatedScore,
      })

      setScore(calculatedScore)
      setIsCompleted(true)
    } catch (error) {
      console.error("Error submitting drill:", error)
      alert("Failed to submit drill. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-blue-600"
    if (score >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreMessage = (score: number) => {
    if (score >= 80) return "Excellent work! You have a strong understanding of this topic."
    if (score >= 60) return "Good job! You're on the right track with room for improvement."
    if (score >= 40) return "Fair attempt. Consider reviewing the key concepts."
    return "Keep practicing! Focus on the fundamental concepts."
  }

  if (isCompleted && score !== null) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="border-b bg-white">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Interview Drill</h1>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Drill Completed!</CardTitle>
                <CardDescription className="text-lg">{drill.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>{score}%</div>
                  <p className="text-gray-600 text-lg">{getScoreMessage(score)}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900">{drill.questions.length}</div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900">{answers.length}</div>
                    <div className="text-sm text-gray-600">Answered</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                      Try Another Drill
                    </Button>
                  </Link>
                  <Link href="/history">
                    <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">View History</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Interview Drill</h1>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit Drill
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Drill Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{drill.title}</h2>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="capitalize">
                    {drill.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      Question {currentQuestion + 1} of {drill.questions.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          {/* Question Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-balance">{drill.questions[currentQuestion].prompt}</CardTitle>
              <CardDescription>
                Provide a detailed answer. Your response will be scored based on key concepts and keywords.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Type your answer here..."
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="min-h-[200px] resize-none"
              />
              <div className="mt-2 text-sm text-gray-500">{currentAnswer.length} characters</div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {drill.questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentQuestion
                      ? "bg-blue-600"
                      : answers.some((a) => a.questionId === drill.questions[index].id)
                        ? "bg-green-500"
                        : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={answers.length !== drill.questions.length || isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Submitting..." : "Submit Drill"}
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!currentAnswer.trim()}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Answer Status */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {answers.length} of {drill.questions.length} questions answered
          </div>
        </div>
      </main>
    </div>
  )
}

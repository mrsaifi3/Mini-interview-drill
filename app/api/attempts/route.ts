import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { attemptsService, calculateScore } from "@/lib/supabase/client-services"
import { serverDrillsService } from "@/lib/supabase/server-services"

// Validation schema for attempt submission
const attemptSchema = z.object({
  drill_id: z.string().uuid("Invalid drill ID format"),
  answers: z
    .array(
      z.object({
        questionId: z.number().int().positive("Question ID must be a positive integer"),
        answer: z.string().min(1, "Answer cannot be empty").max(5000, "Answer too long"),
      }),
    )
    .min(1, "At least one answer is required")
    .max(10, "Too many answers"),
})

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = attemptSchema.parse(body)

    const drill = await serverDrillsService.getById(validatedData.drill_id)
    if (!drill) {
      return NextResponse.json({ error: "Drill not found" }, { status: 404 })
    }

    // Verify drill exists and get questions for scoring
    // const drill = await drillsService.getById(validatedData.drill_id)
    // if (!drill) {
    //   return NextResponse.json({ error: "Drill not found" }, { status: 404 })
    // }

    // Validate that all questions are answered
    if (validatedData.answers.length !== drill.questions.length) {
      return NextResponse.json({ error: "All questions must be answered" }, { status: 400 })
    }

    // Validate question IDs match drill questions
    const drillQuestionIds = drill.questions.map((q) => q.id)
    const answerQuestionIds = validatedData.answers.map((a) => a.questionId)
    const invalidQuestionIds = answerQuestionIds.filter((id) => !drillQuestionIds.includes(id))

    if (invalidQuestionIds.length > 0) {
      return NextResponse.json({ error: "Invalid question IDs provided" }, { status: 400 })
    }

    // Calculate score
    const score = calculateScore(validatedData.answers, drill.questions)

    // Create attempt record
    const attempt = await attemptsService.create({
      user_id: userId,
      drill_id: validatedData.drill_id,
      answers: validatedData.answers,
      score,
    })

    return NextResponse.json({
      attempt: {
        id: attempt.id,
        score: attempt.score,
        created_at: attempt.created_at,
      },
    })
  } catch (error) {
    console.error("Error creating attempt:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: "Failed to submit attempt" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get("limit")
    const limit = limitParam ? Math.min(Number.parseInt(limitParam), 50) : 10 // Max 50 attempts

    const attempts = await attemptsService.getByUserId(userId, limit)

    return NextResponse.json({ attempts })
  } catch (error) {
    console.error("Error fetching attempts:", error)
    return NextResponse.json({ error: "Failed to fetch attempts" }, { status: 500 })
  }
}

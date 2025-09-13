import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { serverDrillsService } from "@/lib/supabase/server-services"

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const difficulty = searchParams.get("difficulty")

    let drills
    if (difficulty && ["easy", "medium", "hard"].includes(difficulty)) {
      drills = await serverDrillsService.getAll()
      drills = drills.filter((drill) => drill.difficulty === difficulty)
    } else {
      drills = await serverDrillsService.getAll()
    }

    return NextResponse.json({ drills })
  } catch (error) {
    console.error("Error fetching drills:", error)
    return NextResponse.json({ error: "Failed to fetch drills" }, { status: 500 })
  }
}

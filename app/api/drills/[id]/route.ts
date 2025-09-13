import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { serverDrillsService } from "@/lib/supabase/server-services"

interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Verify authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Drill ID is required" }, { status: 400 })
    }

    const drill = await serverDrillsService.getById(id)

    if (!drill) {
      return NextResponse.json({ error: "Drill not found" }, { status: 404 })
    }

    return NextResponse.json({ drill })
  } catch (error) {
    console.error("Error fetching drill:", error)
    return NextResponse.json({ error: "Failed to fetch drill" }, { status: 500 })
  }
}

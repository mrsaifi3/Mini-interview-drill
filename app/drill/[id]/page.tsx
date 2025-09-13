import { notFound } from "next/navigation"
import { serverDrillsService } from "@/lib/supabase/server-services"
import { DrillInterface } from "@/components/drill-interface"

interface DrillPageProps {
  params: Promise<{ id: string }>
}

export default async function DrillPage({ params }: DrillPageProps) {
  const { id } = await params

  try {
    const drill = await serverDrillsService.getById(id)

    if (!drill) {
      notFound()
    }

    return <DrillInterface drill={drill} />
  } catch (error) {
    console.error("Error loading drill:", error)
    notFound()
  }
}

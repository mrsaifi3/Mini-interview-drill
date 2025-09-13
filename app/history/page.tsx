import { UserButton } from "@clerk/nextjs"
import { Brain } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AttemptHistory } from "@/components/attempt-history"

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Interview Drill</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/history">
              <Button variant="ghost" className="bg-gray-100">
                History
              </Button>
            </Link>
            <UserButton />
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h2>
          <p className="text-gray-600">Track your interview preparation journey and see how you're improving.</p>
        </div>

        <AttemptHistory />
      </main>
    </div>
  )
}

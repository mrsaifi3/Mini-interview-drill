'use client'

import { UserButton } from "@clerk/nextjs"
import { Brain, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DrillsList } from "@/components/drills-list"
import { UserStats } from "@/components/user-stats"

export default function DashboardPage() {
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
              <Button variant="ghost">History</Button>
            </Link>
            <UserButton />
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600">Ready to practice some interview questions?</p>
        </div>

        {/* Stats Section */}
        <UserStats />

        {/* Drills Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Available Drills</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>5 questions each</span>
            </div>
          </div>
          <DrillsList />
        </div>
      </main>
    </div>
  )
}

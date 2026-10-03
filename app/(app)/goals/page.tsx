import type { Metadata } from "next"
import { Suspense } from "react"
import { GoalsBrowser } from "@/components/goals/goals-browser"

export const metadata: Metadata = { title: "Goals", description: "Find teammates by skills and shared goals." }

export default function GoalsPage() {
  return (
    <Suspense>
      <GoalsBrowser />
    </Suspense>
  )
}

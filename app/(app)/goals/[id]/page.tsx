import type { Metadata } from "next"
import { GoalRoom } from "@/components/goals/goal-room"

export const metadata: Metadata = { title: "Team room" }

export default async function GoalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <GoalRoom goalId={id} />
}

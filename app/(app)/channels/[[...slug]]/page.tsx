import type { Metadata } from "next"
import { RequireAuth } from "@/components/demo/require-auth"
import { DiscordApp } from "@/components/discord/discord-app"

export const metadata: Metadata = {
  title: "Chat | AcadHub",
  description: "Servers, channels, direct messages and friends for your campus.",
}

export default async function ChannelsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params
  return (
    <RequireAuth>
      <DiscordApp slug={slug} />
    </RequireAuth>
  )
}

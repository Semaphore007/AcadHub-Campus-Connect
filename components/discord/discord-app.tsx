"use client"

import { useState } from "react"
import Link from "next/link"
import * as Dialog from "@radix-ui/react-dialog"
import { toast } from "react-toastify"
import { discord, useCurrentUser, useDemo } from "@/lib/demo/store"
import { dmChannelId } from "@/lib/demo/discord-seed"
import type { DemoUser } from "@/lib/demo/types"
import { DmSidebar, ServerSidebar, type VoiceState } from "./channel-sidebar"
import { ChatView } from "./chat-view"
import { CreateServerDialog, ExploreServersDialog } from "./dialogs"
import { FriendsView } from "./friends-view"
import { MemberList } from "./member-list"
import { ServerRail } from "./server-rail"

export function DiscordApp({ slug }: { slug: string[] }) {
  const me = useCurrentUser() as DemoUser
  const servers = useDemo((s) => s.servers)
  const users = useDemo((s) => s.users)
  const [navOpen, setNavOpen] = useState(false)
  const [voice, setVoice] = useState<VoiceState>(null)
  const [showMembers, setShowMembers] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)

  const [first, second] = slug
  const isHome = !first || first === "me"
  const server = isHome ? undefined : servers.find((s) => s.id === first)
  const channel = server
    ? (server.channels.find((c) => c.id === second && c.type === "text") ?? server.channels.find((c) => c.type === "text"))
    : undefined
  const dmUser = isHome && second ? users.find((u) => u.id === second) : undefined
  const isMember = server ? server.memberIds.includes(me.id) : false

  const closeNav = () => setNavOpen(false)

  const nav = (onNavigate?: () => void) => (
    <div className="flex h-full">
      <ServerRail
        meId={me.id}
        activeServerId={server?.id ?? null}
        onNavigate={onNavigate}
        onCreateServer={() => setCreateOpen(true)}
        onExplore={() => setExploreOpen(true)}
      />
      {server ? (
        <ServerSidebar server={server} me={me} activeChannelId={channel?.id ?? null} voice={voice} onVoiceChange={setVoice} onNavigate={onNavigate} />
      ) : (
        <DmSidebar me={me} activeUserId={dmUser?.id ?? null} voice={voice} onVoiceChange={setVoice} onNavigate={onNavigate} />
      )}
    </div>
  )

  let main: React.ReactNode
  if (!isHome && !server) {
    main = (
      <NotFound
        title="Server not found"
        text="It may have been deleted, or the invite is wrong."
        onOpenNav={() => setNavOpen(true)}
      />
    )
  } else if (server && channel) {
    main = (
      <ChatView
        key={channel.id}
        me={me}
        channelId={channel.id}
        title={channel.name}
        topic={channel.topic}
        kind="channel"
        canPost={isMember}
        onOpenNav={() => setNavOpen(true)}
        showMembers={showMembers}
        onToggleMembers={() => setShowMembers((v) => !v)}
        joinPrompt={
          <div className="flex items-center justify-between gap-3 rounded-lg bg-secondary px-4 py-3">
            <p className="text-sm">
              {"You're previewing "}
              <span className="font-semibold">{server.name}</span>
            </p>
            <button
              type="button"
              onClick={() => {
                discord.joinServer(server.id)
                toast.success(`Joined ${server.name}`)
              }}
              className="rounded-md bg-success px-4 py-1.5 text-sm font-semibold text-white hover:bg-success/90"
            >
              Join Server
            </button>
          </div>
        }
      />
    )
  } else if (isHome && second && !dmUser) {
    main = <NotFound title="User not found" text="This conversation doesn't exist." onOpenNav={() => setNavOpen(true)} />
  } else if (dmUser) {
    main = (
      <ChatView
        key={dmUser.id}
        me={me}
        channelId={dmChannelId(me.id, dmUser.id)}
        title={dmUser.name}
        topic={dmUser.bio}
        kind="dm"
        canPost
        onOpenNav={() => setNavOpen(true)}
      />
    )
  } else {
    main = <FriendsView me={me} onOpenNav={() => setNavOpen(true)} />
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background text-foreground">
      <div className="hidden h-full md:flex">{nav()}</div>

      <Dialog.Root open={navOpen} onOpenChange={setNavOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 md:hidden" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex outline-none md:hidden" aria-describedby={undefined}>
            <Dialog.Title className="sr-only">Navigation</Dialog.Title>
            {nav(closeNav)}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <main className="flex min-w-0 flex-1">
        {main}
        {server && channel && showMembers ? <MemberList server={server} me={me} /> : null}
      </main>

      <CreateServerDialog open={createOpen} onOpenChange={setCreateOpen} />
      <ExploreServersDialog meId={me.id} open={exploreOpen} onOpenChange={setExploreOpen} />
    </div>
  )
}

function NotFound({ title, text, onOpenNav }: { title: string; text: string; onOpenNav: () => void }) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-3 bg-card p-6 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{text}</p>
      <div className="flex gap-2">
        <button type="button" onClick={onOpenNav} className="rounded-md bg-secondary px-4 py-2 text-sm font-semibold md:hidden">
          Open menu
        </button>
        <Link href="/channels/me" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          Go home
        </Link>
      </div>
    </section>
  )
}

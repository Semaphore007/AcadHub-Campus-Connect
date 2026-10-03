import { getMyCommunities, getPendingRequestCount } from "@/lib/queries"
import type { SessionUser } from "@/lib/session"
import { ShellFrame } from "./shell-frame"

export async function AppShell({ user, children }: { user: SessionUser | null; children: React.ReactNode }) {
  let communities: { id: number; slug: string; name: string; icon: string; color: string }[] = []
  let pending = 0

  if (user && process.env.DATABASE_URL) {
    ;[communities, pending] = await Promise.all([
      getMyCommunities(user.id),
      getPendingRequestCount(user.id),
    ])
  }

  const shellUser = user
    ? { id: user.id, name: user.name, username: user.username, image: user.image, email: user.email, isDemo: user.isDemo }
    : null

  return (
    <ShellFrame
      user={shellUser}
      communities={communities}
      pendingRequests={pending}
    >
      {children}
    </ShellFrame>
  )
}

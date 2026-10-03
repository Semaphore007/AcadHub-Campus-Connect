// Root layout already wraps with AppShell.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { requireUser } = await import("@/lib/session")
  await requireUser()
  return <>{children}</>
}

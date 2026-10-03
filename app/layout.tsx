import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Providers } from "@/components/layout/providers"
import { SITE } from "@/lib/constants/site"
import { getCurrentUser } from "@/lib/session"
import { AppShell } from "@/components/shell/app-shell"
import { Footer } from "@/components/footer/footer"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: { default: SITE.title, template: `%s · ${SITE.fullTitle}` },
  description:
    "AcadHub Campus Connect — the student community for your campus. Join communities, chat and voice message friends, share files, and study with an AI buddy.",
  keywords: ["AcadHub", "Campus Connect", "IIIT Dharwad", "student community", "study groups", "student chat", "collaboration"],
  authors: [{ name: "Siddharth Gautam" }],
  openGraph: { title: SITE.fullTitle, description: SITE.description, type: "website" },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f8fc" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0e14" },
  ],
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser()
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        <Providers>
          <AppShell user={user}>
            {children}
            <Footer />
          </AppShell>
        </Providers>
      </body>
    </html>
  )
}

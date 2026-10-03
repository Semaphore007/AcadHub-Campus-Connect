import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

const ALLOWED = [
  "image/*",
  "video/*",
  "audio/*",
  "application/pdf",
  "application/zip",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const session = await auth.api.getSession({ headers: await headers() })
        if (!session?.user) throw new Error("Unauthorized")
        if (!pathname.startsWith(`uploads/${session.user.id}/`)) throw new Error("Invalid path")
        return {
          allowedContentTypes: ALLOWED,
          maximumSizeInBytes: 50 * 1024 * 1024,
          addRandomSuffix: true,
        }
      },
    })
    return NextResponse.json(json)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 400 })
  }
}

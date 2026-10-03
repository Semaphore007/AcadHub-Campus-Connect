"use client"

import { useState } from "react"
import Link from "next/link"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import {
  ArrowUp,
  Bookmark,
  Check,
  Clock,
  Copy,
  Filter,
  Flame,
  Flag,
  EyeOff,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Share2,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Sort = "hot" | "new" | "top"
type PostFilter = "all" | FeedPost["type"]
type FeedPost = {
  id: string
  community: string
  communityEmoji: string
  communityColor: string
  author: string
  authorBadge: string
  timeAgo: string
  type: "goal" | "discussion" | "resource"
  title: string
  body: string
  skills: string[]
  slotsTotal: number
  slotsFilled: number
  votes: number
  comments: number
  deadline: string | null
  saved: boolean
}

const MOCK_POSTS: FeedPost[] = [
  {
    id: "1",
    community: "aiml",
    communityEmoji: "🤖",
    communityColor: "bg-blue-500",
    author: "arjun_iitd",
    authorBadge: "ML Enthusiast",
    timeAgo: "2h ago",
    type: "goal",
    title: "Building a real-time sign-language to text converter using MediaPipe",
    body: "Need 2 more team members with Python and Computer Vision experience. This will be a 3-week project for our college fest demo. Beginners welcome — I'll help with the ML part!",
    skills: ["Python", "MediaPipe", "OpenCV", "React"],
    slotsTotal: 4,
    slotsFilled: 2,
    votes: 47,
    comments: 12,
    deadline: "Apply by Sunday",
    saved: false,
  },
  {
    id: "2",
    community: "webdev",
    communityEmoji: "🌐",
    communityColor: "bg-indigo-500",
    author: "priya_cs23",
    authorBadge: "Full-Stack Dev",
    timeAgo: "4h ago",
    type: "goal",
    title: "College timetable app with smart conflict detection",
    body: "Tired of manual timetable clashes? Let's build an app that automatically detects and resolves scheduling conflicts. Looking for backend and frontend devs.",
    skills: ["Next.js", "Node.js", "PostgreSQL", "Tailwind"],
    slotsTotal: 3,
    slotsFilled: 1,
    votes: 31,
    comments: 8,
    deadline: "2 weeks left",
    saved: true,
  },
  {
    id: "3",
    community: "hackathons",
    communityEmoji: "⚡",
    communityColor: "bg-orange-500",
    author: "dev_rishi",
    authorBadge: "Hackathon Pro",
    timeAgo: "6h ago",
    type: "discussion",
    title: "SIH 2026 preparation — who's forming teams?",
    body: "Smart India Hackathon registrations open soon. Looking to form a diverse team across domains. Share your skills and let's see if we can put a team together!",
    skills: [],
    slotsTotal: 6,
    slotsFilled: 3,
    votes: 89,
    comments: 34,
    deadline: null,
    saved: false,
  },
  {
    id: "4",
    community: "dsa",
    communityEmoji: "🏆",
    communityColor: "bg-yellow-500",
    author: "competitive_sam",
    authorBadge: "Specialist",
    timeAgo: "8h ago",
    type: "resource",
    title: "Free graph theory study group — weekends 9AM",
    body: "Starting a weekly study group for graph algorithms (BFS/DFS/Dijkstra/Floyd). Perfect for CP beginners. We'll solve LeetCode + Codeforces problems together on Discord.",
    skills: ["Algorithms", "C++", "Python"],
    slotsTotal: 10,
    slotsFilled: 7,
    votes: 56,
    comments: 19,
    deadline: "Ongoing",
    saved: false,
  },
  {
    id: "5",
    community: "iot",
    communityEmoji: "🔌",
    communityColor: "bg-emerald-500",
    author: "hardware_nerd",
    authorBadge: "Maker",
    timeAgo: "12h ago",
    type: "goal",
    title: "Smart hostel energy monitor — ESP32 + MQTT + Dashboard",
    body: "Project for frugal innovation course. Sensors are already available in the electronics lab. Need someone with React for the dashboard and Python for the MQTT broker.",
    skills: ["ESP32", "MQTT", "React", "Python", "InfluxDB"],
    slotsTotal: 3,
    slotsFilled: 1,
    votes: 28,
    comments: 6,
    deadline: "3 weeks left",
    saved: false,
  },
]

const TYPE_BADGE: Record<string, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  goal: { label: "Goal", className: "bg-primary/10 text-primary", icon: Target },
  discussion: { label: "Discussion", className: "bg-accent/10 text-accent", icon: MessageCircle },
  resource: { label: "Resource", className: "bg-success/10 text-success", icon: Sparkles },
}

const GENERATED_TITLES = [
  "Looking for collaborators on a campus project",
  "Weekend study circle: learn by building together",
  "Need feedback on a student-built prototype",
  "Starting a peer group for this semester",
  "Campus innovation idea — who wants to join?",
  "Sharing a useful resource for project teams",
]

const GENERATED_BODIES = [
  "I have a first draft ready and would love to work with students who want hands-on experience. Beginners are welcome, and we can plan the next steps together.",
  "A few of us are organizing a relaxed weekly session to learn, share progress, and help each other get unstuck. Add your interests and join the discussion.",
  "We are putting together a small cross-disciplinary team. Bring your ideas, ask questions, and help shape the project as we go.",
  "I found a practical way to get started and wanted to share it with the campus community. Let me know what you would add or improve.",
]

const GENERATED_COMMUNITIES = [
  { community: "aiml", communityEmoji: "🤖", communityColor: "bg-blue-500", authorBadge: "ML Enthusiast" },
  { community: "webdev", communityEmoji: "🌐", communityColor: "bg-indigo-500", authorBadge: "Full-Stack Dev" },
  { community: "hackathons", communityEmoji: "⚡", communityColor: "bg-orange-500", authorBadge: "Hackathon Pro" },
  { community: "dsa", communityEmoji: "🏆", communityColor: "bg-yellow-500", authorBadge: "Specialist" },
  { community: "iot", communityEmoji: "🔌", communityColor: "bg-emerald-500", authorBadge: "Maker" },
]

const GENERATED_AUTHORS = ["campus_builder", "curious_dev", "study_partner", "project_maker", "student_creator"]
const GENERATED_SKILLS = ["Python", "React", "Next.js", "UI/UX", "C++", "AI", "IoT", "PostgreSQL", "Figma"]

function choose<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!]
  }
  return result
}

function generatePosts(firstIndex: number, count: number): FeedPost[] {
  return Array.from({ length: count }, (_, offset) => {
    const community = choose(GENERATED_COMMUNITIES)
    const skills = shuffle(GENERATED_SKILLS).slice(0, 2 + Math.floor(Math.random() * 3))
    const type = choose(["goal", "discussion", "resource"] as const)
    const slotsTotal = 2 + Math.floor(Math.random() * 7)

    return {
      id: `generated-${firstIndex + offset}`,
      ...community,
      author: choose(GENERATED_AUTHORS),
      timeAgo: "just now",
      type,
      title: choose(GENERATED_TITLES),
      body: choose(GENERATED_BODIES),
      skills: type === "discussion" ? [] : skills,
      slotsTotal,
      slotsFilled: Math.floor(Math.random() * slotsTotal),
      votes: Math.floor(Math.random() * 70),
      comments: Math.floor(Math.random() * 25),
      deadline: type === "goal" ? choose(["Apply this week", "2 weeks left", "Ongoing"]) : null,
      saved: false,
    }
  })
}

function PostCard({ post, onHide }: { post: FeedPost; onHide: () => void }) {
  const [votes, setVotes] = useState(post.votes)
  const [voted, setVoted] = useState<"up" | null>(null)
  const [saved, setSaved] = useState(post.saved)
  const [reported, setReported] = useState(false)
  const [message, setMessage] = useState("")
  const badge = TYPE_BADGE[post.type]
  const Icon = badge.icon

  const vote = () => {
    if (voted === "up") {
      setVotes((v) => v - 1)
      setVoted(null)
    } else {
      setVotes((v) => v + 1)
      setVoted("up")
    }
  }

  const copyPostLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/feed#post-${post.id}`)
      setMessage("Post link copied.")
    } catch (error) {
      console.error("Could not copy post link:", error)
      setMessage("Could not copy the link. Check clipboard permissions and try again.")
    }
  }

  const reportPost = () => {
    setReported(true)
    setMessage("Marked as reported in this preview.")
  }

  return (
    <article id={`post-${post.id}`} className="group flex gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-all hover:border-primary/20 hover:shadow-md sm:p-5">
      {/* Vote column */}
      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={vote}
          aria-label={voted ? "Remove upvote" : "Upvote"}
          aria-pressed={voted === "up"}
          className={cn(
            "flex size-8 items-center justify-center rounded-xl transition-all",
            voted === "up"
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          <ArrowUp className="size-4" aria-hidden />
        </button>
        <span className={cn("font-mono text-sm font-bold", voted === "up" ? "text-primary" : "text-foreground")}>
          {votes}
        </span>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col gap-3 min-w-0">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Link
            href={`/c/${post.community}`}
            className="flex items-center gap-1.5 font-semibold text-foreground hover:text-primary transition-colors"
          >
            <span className={cn("size-4 rounded-md text-white flex items-center justify-center text-[9px]", post.communityColor)} aria-hidden>
              {post.communityEmoji}
            </span>
            c/{post.community}
          </Link>
          <span>·</span>
          <Link href={`/u/${post.author}`} className="hover:text-foreground transition-colors">
            u/{post.author}
          </Link>
          <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-medium">{post.authorBadge}</span>
          <span>·</span>
          <time className="flex items-center gap-1">
            <Clock className="size-3" aria-hidden />
            {post.timeAgo}
          </time>
        </div>

        {/* Title */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", badge.className)}>
            <Icon className="size-2.5" aria-hidden />
            {badge.label}
          </span>
          <h2 className="text-base font-semibold text-foreground leading-snug">{post.title}</h2>
        </div>

        {/* Body */}
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">{post.body}</p>

        {/* Skills */}
        {post.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5" aria-label="Required skills">
            {post.skills.map((skill) => (
              <span key={skill} className="rounded-lg bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Goal progress + deadline */}
        {post.type === "goal" && (
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="size-3.5" aria-hidden />
              <span>{post.slotsFilled}/{post.slotsTotal} joined</span>
              <div className="h-1.5 w-16 rounded-full bg-border/60">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${(post.slotsFilled / post.slotsTotal) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={post.slotsFilled}
                  aria-valuemin={0}
                  aria-valuemax={post.slotsTotal}
                />
              </div>
            </div>
            {post.deadline && (
              <span className="flex items-center gap-1 text-orange-500">
                <Zap className="size-3" aria-hidden />
                {post.deadline}
              </span>
            )}
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-1 pt-1">
          <button
            type="button"
            onClick={copyPostLink}
            className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <MessageCircle className="size-3.5" aria-hidden />
            {post.comments} comments
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Share2 className="size-3.5" aria-hidden />
            Share
          </button>
          <button
            type="button"
            onClick={() => setSaved((s) => !s)}
            aria-label={saved ? "Unsave" : "Save"}
            aria-pressed={saved}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs transition-colors",
              saved ? "text-accent" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Bookmark className={cn("size-3.5", saved && "fill-current")} aria-hidden />
            {saved ? "Saved" : "Save"}
          </button>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              type="button"
              aria-label={`More options for ${post.title}`}
              className="ml-auto flex size-7 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <MoreHorizontal className="size-4" aria-hidden />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={6}
                className="z-50 min-w-44 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl"
              >
                <DropdownMenu.Item
                  onSelect={() => setSaved((current) => !current)}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-[highlighted]:bg-secondary"
                >
                  <Bookmark className="size-4" aria-hidden />
                  {saved ? "Unsave post" : "Save post"}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={() => void copyPostLink()}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-[highlighted]:bg-secondary"
                >
                  <Copy className="size-4" aria-hidden />
                  Copy post link
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={onHide}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-[highlighted]:bg-secondary"
                >
                  <EyeOff className="size-4" aria-hidden />
                  Hide post
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-border/60" />
                <DropdownMenu.Item
                  disabled={reported}
                  onSelect={reportPost}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive outline-none data-[disabled]:cursor-default data-[disabled]:opacity-60 data-[highlighted]:bg-destructive/10"
                >
                  <Flag className="size-4" aria-hidden />
                  {reported ? "Reported" : "Report post"}
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          {post.type === "goal" && post.slotsFilled < post.slotsTotal && (
            <button
              type="button"
              className="ml-1 rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            >
              Request to Join
            </button>
          )}
        </div>
        {message && <p role="status" aria-live="polite" className="text-xs text-muted-foreground">{message}</p>}
      </div>
    </article>
  )
}

const SORT_OPTIONS: { id: Sort; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "hot", label: "Hot", icon: Flame },
  { id: "new", label: "New", icon: Clock },
  { id: "top", label: "Top", icon: TrendingUp },
]

export default function FeedPage() {
  const [sort, setSort] = useState<Sort>("hot")
  const [postFilter, setPostFilter] = useState<PostFilter>("all")
  const [posts, setPosts] = useState<FeedPost[]>(MOCK_POSTS)
  const [hiddenPosts, setHiddenPosts] = useState<string[]>([])
  const [loadCount, setLoadCount] = useState(0)
  const visiblePosts = posts.filter(
    (post) => !hiddenPosts.includes(post.id) && (postFilter === "all" || post.type === postFilter),
  )
  const filterOptions: { id: PostFilter; label: string }[] = [
    { id: "all", label: "All posts" },
    { id: "goal", label: "Goals" },
    { id: "discussion", label: "Discussions" },
    { id: "resource", label: "Resources" },
  ]

  const loadMorePosts = () => {
    const firstIndex = loadCount * 3 + 1
    setPosts((current) => [...current, ...generatePosts(firstIndex, 3)])
    setLoadCount((current) => current + 1)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Your Feed</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Goals and discussions from your communities</p>
        </div>
        <Link
          href="/submit"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
        >
          <Plus className="size-4" aria-hidden />
          Post a Goal
        </Link>
      </div>

      {/* Sort bar */}
      <div className="mb-4 flex items-center gap-2">
        {SORT_OPTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSort(id)}
            aria-pressed={sort === id}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all",
              sort === id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </button>
        ))}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            type="button"
            aria-label="Filter feed posts"
            className={cn(
              "ml-auto flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
              postFilter === "all"
                ? "border-border/60 bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
                : "border-primary/30 bg-primary/10 text-primary",
            )}
          >
            <Filter className="size-4" aria-hidden />
            {postFilter === "all" ? "Filter" : filterOptions.find((option) => option.id === postFilter)?.label}
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={6}
              aria-label="Filter posts by type"
              className="z-50 min-w-48 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl"
            >
              <DropdownMenu.Label className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                Show post type
              </DropdownMenu.Label>
              {filterOptions.map(({ id, label }) => (
                <DropdownMenu.Item
                  key={id}
                  onSelect={() => setPostFilter(id)}
                  aria-current={postFilter === id ? "true" : undefined}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-[highlighted]:bg-secondary"
                >
                  <Check className={cn("size-4", postFilter === id ? "opacity-100 text-primary" : "opacity-0")} aria-hidden />
                  {label}
                  {id !== "all" && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {posts.filter((post) => !hiddenPosts.includes(post.id) && post.type === id).length}
                    </span>
                  )}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* Posts */}
      <div className="flex flex-col gap-3">
        {visiblePosts.map((post) => (
          <PostCard key={post.id} post={post} onHide={() => setHiddenPosts((current) => [...current, post.id])} />
        ))}
        {visiblePosts.length === 0 && (
          <p className="rounded-2xl border border-border/60 bg-card px-5 py-8 text-center text-sm text-muted-foreground">
            {postFilter === "all"
              ? "You hid all the posts in this feed. Load more posts to continue browsing."
              : `No ${filterOptions.find((option) => option.id === postFilter)?.label.toLowerCase()} are in this feed yet. Load more posts or choose another filter.`}
          </p>
        )}
      </div>

      {/* Load more */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={loadMorePosts}
          className="rounded-2xl border border-border/60 bg-card px-8 py-3 text-sm font-medium text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground hover:shadow-md"
        >
          Load more posts
        </button>
      </div>
    </div>
  )
}

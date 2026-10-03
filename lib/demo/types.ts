export type GoalStatus = "open" | "active" | "completed" | "archived"
export type GoalCategory = "Hackathon" | "Study" | "Project" | "Research" | "Club" | "Event"
export type TaskStatus = "todo" | "doing" | "done"

export type DemoUser = {
  id: string
  name: string
  email: string
  username: string
  password?: string
  branch: string
  year: string
  bio: string
  skills: string[]
  interests: string[]
  createdAt: string
}

export type Goal = {
  id: string
  title: string
  description: string
  category: GoalCategory
  skills: string[]
  slots: number
  deadline: string
  status: GoalStatus
  ownerId: string
  memberIds: string[]
  createdAt: string
}

export type ChatMessage = {
  id: string
  goalId: string
  authorId: string
  text: string
  createdAt: string
}

export type GoalTask = {
  id: string
  goalId: string
  title: string
  status: TaskStatus
  assigneeId: string | null
  createdAt: string
}

export type GoalResource = {
  id: string
  goalId: string
  title: string
  url: string
  addedBy: string
  createdAt: string
}

export type Activity = {
  id: string
  text: string
  href?: string
  createdAt: string
  read: boolean
}

export type ChannelType = "text" | "voice"

export type Channel = {
  id: string
  name: string
  type: ChannelType
  topic: string
}

export type Server = {
  id: string
  name: string
  description: string
  color: string
  ownerId: string
  memberIds: string[]
  channels: Channel[]
  createdAt: string
}

export type ChannelMessage = {
  id: string
  channelId: string
  authorId: string
  text: string
  createdAt: string
  editedAt?: string
}

export type Friendship = {
  id: string
  requesterId: string
  addresseeId: string
  status: "pending" | "accepted"
  createdAt: string
}

export type DemoState = {
  version: number
  servers: Server[]
  channelMessages: ChannelMessage[]
  friendships: Friendship[]
  lastRead: Record<string, string>
  sessionUserId: string | null
  users: DemoUser[]
  goals: Goal[]
  messages: ChatMessage[]
  tasks: GoalTask[]
  resources: GoalResource[]
  activity: Activity[]
  joinedCommunities: string[]
}

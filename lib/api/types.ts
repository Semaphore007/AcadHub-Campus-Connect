export type GoalStatus = "open" | "joining" | "active" | "completed" | "archived"

export type Group = {
  groupCode: string
  name: string
  description: string
  category: "Project" | "Learning" | "Research" | "Competition" | "Campus"
  skills: string[]
  members: number
  maxMembers: number
  deadline: string
  status: GoalStatus
  beginnerFriendly: boolean
}

export type Thread = {
  id: string
  groupCode: string
  title: string
  author: string
  replies: number
  createdAt: string
}

export type CreateGroupInput = {
  name: string
  description?: string
  skills: string[]
  maxMembers: number
  isPrivate?: boolean
}

export type CreateThreadInput = {
  title: string
  content: string
}

export type ApiSource = "backend" | "mock"

export type ApiResult<T> = {
  data: T
  source: ApiSource
  error?: string
}

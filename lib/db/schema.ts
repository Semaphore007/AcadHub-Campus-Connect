import { boolean, integer, pgTable, primaryKey, serial, text, timestamp } from "drizzle-orm/pg-core"

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  username: text("username").unique(),
  bio: text("bio"),
  academicBranch: text("academicBranch"),
  graduationYear: text("graduationYear"),
  technicalInterests: text("technicalInterests"),
  profilePublic: boolean("profilePublic").notNull().default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

export const communities = pgTable("communities", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  icon: text("icon").notNull().default("users"),
  color: text("color").notNull().default("blue"),
  createdBy: text("createdBy"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const communityMembers = pgTable(
  "community_members",
  {
    communityId: integer("communityId").notNull(),
    userId: text("userId").notNull(),
    role: text("role").notNull().default("member"),
    joinedAt: timestamp("joinedAt").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.communityId] })],
)

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  communityId: integer("communityId").notNull(),
  userId: text("userId").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  mediaPath: text("mediaPath"),
  mediaType: text("mediaType"),
  mediaName: text("mediaName"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const postVotes = pgTable(
  "post_votes",
  {
    postId: integer("postId").notNull(),
    userId: text("userId").notNull(),
    value: integer("value").notNull(),
  },
  (t) => [primaryKey({ columns: [t.postId, t.userId] })],
)

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("postId").notNull(),
  userId: text("userId").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const friendships = pgTable("friendships", {
  id: serial("id").primaryKey(),
  requesterId: text("requesterId").notNull(),
  addresseeId: text("addresseeId").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: text("senderId").notNull(),
  recipientId: text("recipientId"),
  communityId: integer("communityId"),
  body: text("body").notNull().default(""),
  kind: text("kind").notNull().default("text"),
  mediaPath: text("mediaPath"),
  mediaName: text("mediaName"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

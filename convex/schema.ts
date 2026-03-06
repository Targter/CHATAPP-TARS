// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    email: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
    isOnline: v.boolean(), // We keep this for explicit offline/online toggles if needed
    lastSeen: v.optional(v.number()), // NEW: The heartbeat timestamp
  })
  .index("by_token", ["tokenIdentifier"])
  .index("by_email", ["email"]), 

  conversations: defineTable({
    participantOne: v.id("users"),
    participantTwo: v.id("users"),
  })
  .index("by_participantOne", ["participantOne", "participantTwo"])
  .index("by_participantTwo", ["participantTwo", "participantOne"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
    format: v.string(),
    updatedAt: v.number(),
  })
  .index("by_conversation", ["conversationId"]),
});


import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    email: v.string(),
    name: v.string(),
    imageId: v.optional(v.id("_storage")),
    image: v.optional(v.string()),
    isOnline: v.boolean(),
    lastSeen: v.optional(v.number()),
  })
  .index("by_token", ["tokenIdentifier"])
  .index("by_email", ["email"]), 

  conversations: defineTable({
    participantOne: v.optional(v.id("users")),
    participantTwo: v.optional(v.id("users")),
    
    // FIX: Make these optional so old data doesn't crash the app
    isGroup: v.optional(v.boolean()), 
    participants: v.optional(v.array(v.id("users"))),
    
    // Group Fields
    name: v.optional(v.string()), 
    groupImage: v.optional(v.string()), 
    adminId: v.optional(v.id("users")), 
    
    // Customization
    themeColor: v.optional(v.string()), 
    nicknames: v.optional(v.any()), 
    disappearingTimer: v.optional(v.number()), 
  })
  .index("by_participantOne", ["participantOne", "participantTwo"])
  .index("by_participantTwo", ["participantTwo", "participantOne"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
    format: v.string(),
    updatedAt: v.number(),

    isDeleted: v.optional(v.boolean()),
    // 
    expiresAt: v.optional(v.number()), 
    isScheduled: v.optional(v.boolean()),
    scheduledFor: v.optional(v.number()),
  })
  .index("by_conversation", ["conversationId"]),

  typing: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    expiresAt: v.number(),
  })
  .index("by_conversation", ["conversationId"]),

  conversation_last_read: defineTable({
    userId: v.id("users"),
    conversationId: v.id("conversations"),
    lastSeen: v.number(),
  })
  .index("by_user_conversation", ["userId", "conversationId"]),

  // 
  reactions: defineTable({
    messageId: v.id("messages"),
    userId: v.id("users"),
    emoji: v.string(), // e.g., "👍"
  })
  .index("by_message", ["messageId"])
  .index("by_message_user_emoji", ["messageId", "userId", "emoji"]),

  // block;
  blocks: defineTable({
    blockerId: v.id("users"),
    blockedId: v.id("users"),
  })
  .index("by_blocker", ["blockerId", "blockedId"]),
});


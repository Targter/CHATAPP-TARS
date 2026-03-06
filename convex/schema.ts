// // convex/schema.ts
// import { defineSchema, defineTable } from "convex/server";
// import { v } from "convex/values";

// export default defineSchema({
//   users: defineTable({
//     tokenIdentifier: v.string(),
//     email: v.string(),
//     name: v.string(),
//       imageId: v.optional(v.id("_storage")), // NEW: Storage ID
//     image: v.optional(v.string()),
//     isOnline: v.boolean(), // We keep this for explicit offline/online toggles if needed
//     lastSeen: v.optional(v.number()), // NEW: The heartbeat timestamp
//   })
//   .index("by_token", ["tokenIdentifier"])
//   .index("by_email", ["email"]), 

//   conversations: defineTable({
//     participantOne: v.id("users"),
//     participantTwo: v.id("users"),
//      // NEW: Group Fields
//     isGroup: v.boolean(),
//     name: v.optional(v.string()), // Group Name
//     groupImage: v.optional(v.string()), 
//     adminId: v.optional(v.id("users")), // Who created it
//     participants: v.array(v.id("users")), // List of ALL members
    
//     // NEW: Customization
//     // Use a string for hex color (e.g. "#FF0000")
//     themeColor: v.optional(v.string()), 
    
//     // Map of userId -> Nickname string. 
//     // We store as JSON string or Object because Convex Maps are strict. 
//     // Let's use an object: { [userId]: "Nickname" }
//     nicknames: v.optional(v.any()), 
//   })
//   .index("by_participantOne", ["participantOne", "participantTwo"])
//   .index("by_participantTwo", ["participantTwo", "participantOne"]),

//   messages: defineTable({
//     conversationId: v.id("conversations"),
//     senderId: v.id("users"),
//     content: v.string(),
//     format: v.string(),
//     updatedAt: v.number(),
//         isDeleted: v.optional(v.boolean()), // NEW: Soft delete flag

//   })
//   .index("by_conversation", ["conversationId"]),

//    // NEW: Typing Status
//   typing: defineTable({
//     conversationId: v.id("conversations"),
//     userId: v.id("users"),
//     expiresAt: v.number(),
//   })
//   .index("by_conversation", ["conversationId"]),

//    conversation_last_read: defineTable({
//     userId: v.id("users"),
//     conversationId: v.id("conversations"),
//     lastSeen: v.number(),
//   })
//   .index("by_user_conversation", ["userId", "conversationId"]),
// });

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
});
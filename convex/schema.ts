// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(), // Clerk User ID
    email: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
    isOnline: v.boolean(),
  })
  .index("by_token", ["tokenIdentifier"])
  .index("by_email", ["email"]), 
});
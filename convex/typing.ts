// convex/typing.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Call this when user types
export const kick = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) return;

    // Remove existing entry for this user in this conversation to avoid duplicates/clutter
    const existing = await ctx.db
      .query("typing")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .filter(q => q.eq(q.field("userId"), user._id))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }

    // Insert new entry expiring in 2 seconds
    await ctx.db.insert("typing", {
      conversationId: args.conversationId,
      userId: user._id,
      expiresAt: Date.now() + 2000,
    });
  },
});

// Get list of people typing
export const list = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!currentUser) return [];

    const typingRecords = await ctx.db
      .query("typing")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    // Filter expired and self
    const now = Date.now();
    const activeTypers = typingRecords.filter(
      (t) => t.userId !== currentUser._id && t.expiresAt > now
    );

    // Get user details
    return Promise.all(
      activeTypers.map(async (t) => {
        const user = await ctx.db.get(t.userId);
        return user?.name;
      })
    );
  },
});
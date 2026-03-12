import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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

    const existing = await ctx.db
      .query("typing")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .filter(q => q.eq(q.field("userId"), user._id))
      .unique();

    if (existing) {
      // Extend expiration
      await ctx.db.patch(existing._id, { expiresAt: Date.now() + 2000 });
    } else {
      // Create new
      await ctx.db.insert("typing", {
        conversationId: args.conversationId,
        userId: user._id,
        expiresAt: Date.now() + 2000,
      });
    }
  },
});

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

    const now = Date.now();
    const activeTypers = typingRecords.filter(
      (t) => t.userId !== currentUser._id && t.expiresAt > now
    );

    return Promise.all(
      activeTypers.map(async (t) => {
        const user = await ctx.db.get(t.userId);
        return user?.name;
      })
    );
  },
});

// NEW: Explicitly stop typing
export const stop = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) return;

    const existing = await ctx.db
      .query("typing")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .filter(q => q.eq(q.field("userId"), user._id))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
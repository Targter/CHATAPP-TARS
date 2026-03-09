// convex/reactions.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const toggle = mutation({
  args: { 
    messageId: v.id("messages"), 
    emoji: v.string() 
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) throw new Error("User not found");

    // Check if user already reacted with THIS emoji on THIS message
    const existing = await ctx.db
      .query("reactions")
      .withIndex("by_message_user_emoji", (q) =>
        q.eq("messageId", args.messageId)
         .eq("userId", user._id)
         .eq("emoji", args.emoji)
      )
      .first();

    if (existing) {
      // Toggle OFF: Remove reaction
      await ctx.db.delete(existing._id);
    } else {
      // Toggle ON: Add reaction
      await ctx.db.insert("reactions", {
        messageId: args.messageId,
        userId: user._id,
        emoji: args.emoji,
      });
    }
  },
});
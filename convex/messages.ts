// convex/messages.ts
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// List messages for a specific conversation
export const list = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    // Fetch reactions for every message
     return await Promise.all(
      messages.map(async (msg) => {
        const reactions = await ctx.db
          .query("reactions")
          .withIndex("by_message", (q) => q.eq("messageId", msg._id))
          .collect();

            let mediaUrl = null;
          if (msg.format !== "text") {
          // 'content' stores the storageId when format is image/video/audio
          mediaUrl = await ctx.storage.getUrl(msg.content as Id<"_storage">);
        }

          
        return {
          ...msg,
          mediaUrl,
          reactions, // Attach reactions array to the message object
        };
      })
    );
  },
});

// Send a message
export const send = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
    format:v.optional(v.string()), // "text", "image", "video", "audio"
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: user._id,
      content: args.content,
      format: args.format || "text",
      updatedAt: Date.now(),
    });
  },
});


export const deleteMessage = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) throw new Error("User not found");

    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");

    // Verify ownership
    if (message.senderId !== user._id) {
      throw new Error("You can only delete your own messages");
    }

    // Soft delete: Update content and set flag
    await ctx.db.patch(args.messageId, {
      content: "This message was deleted",
      isDeleted: true,
       format: "text",
    });
  },
});
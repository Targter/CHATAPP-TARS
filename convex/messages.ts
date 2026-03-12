import { mutation, query, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api"; // Required for calling internal functions
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// 1. Message List (Filter out un-published scheduled messages)
export const list = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return[];

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) return[];

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    const now = Date.now();

    const visibleMessages = messages.filter((msg) => {
      // 1. Hide if expired (in case background cron is delayed by a few seconds)
      if (msg.expiresAt && msg.expiresAt < now) return false;
      // 2. If scheduled for future, ONLY the sender can see it (as a pending message)
      if (msg.isScheduled && msg.scheduledFor && msg.scheduledFor > now) {
        if (msg.senderId !== user._id) return false;
      }
      return true;
    });

    return await Promise.all(
      visibleMessages.map(async (msg) => {
        const reactions = await ctx.db
          .query("reactions")
          .withIndex("by_message", (q) => q.eq("messageId", msg._id))
          .collect();
          
        let mediaUrl = null;
        if (msg.format && msg.format !== "text") {
          mediaUrl = await ctx.storage.getUrl(msg.content as Id<"_storage">);
        }

        return { ...msg, reactions, mediaUrl };
      })
    );
  },
});

export const send = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
    format: v.optional(v.string()),
    scheduledFor: v.optional(v.number()), 
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) throw new Error("User not found");

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error("Conversation not found");
        if (!conversation.isGroup) {
      const partnerId = conversation.participantOne === user._id ? conversation.participantTwo : conversation.participantOne;
      if (partnerId) {
        const isBlocker = await ctx.db.query("blocks").withIndex("by_blocker", q => q.eq("blockerId", user._id).eq("blockedId", partnerId)).unique();
        const isBlocked = await ctx.db.query("blocks").withIndex("by_blocker", q => q.eq("blockerId", partnerId).eq("blockedId", user._id)).unique();
        
        if (isBlocker || isBlocked) {
          throw new Error("Cannot send message. Conversation is blocked.");
        }
      }
    }

    const timer = conversation.disappearingTimer;

    // SCENARIO A: User scheduled this message for the future
    if (args.scheduledFor && args.scheduledFor > Date.now()) {
      const msgId = await ctx.db.insert("messages", {
        conversationId: args.conversationId,
        senderId: user._id,
        content: args.content,
        format: args.format || "text",
        updatedAt: Date.now(),
        isScheduled: true,
        scheduledFor: args.scheduledFor,
      });

      // Schedule the publishing of this message
      await ctx.scheduler.runAt(args.scheduledFor, internal.messages.publishScheduled, { 
        messageId: msgId, 
        disappearingTimer: timer 
      });

    } 
    // SCENARIO B: Send Immediately
    else {
      const expiresAt = timer ? Date.now() + timer : undefined;

      const msgId = await ctx.db.insert("messages", {
        conversationId: args.conversationId,
        senderId: user._id,
        content: args.content,
        format: args.format || "text",
        updatedAt: Date.now(),
        expiresAt: expiresAt,
      });

      // If a disappearing timer exists, schedule background hard-deletion
      if (expiresAt) {
        await ctx.scheduler.runAt(expiresAt, internal.messages.hardDelete, { messageId: msgId });
      }
    }
  },
});


// Called by scheduler to actually erase a disappearing message
export const hardDelete = internalMutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    const msg = await ctx.db.get(args.messageId);
    if (msg) {
      await ctx.db.delete(args.messageId);
      // Optional: Delete associated reactions
      const reactions = await ctx.db.query("reactions").withIndex("by_message", q => q.eq("messageId", args.messageId)).collect();
      for (const reaction of reactions) {
        await ctx.db.delete(reaction._id);
      }
    }
  },
});

// ... keep existing deleteMessage mutation ...
export const deleteMessage = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const user = await ctx.db.query("users").withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier)).unique();
    if (!user) throw new Error("User not found");
    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");
    if (message.senderId !== user._id) throw new Error("You can only delete your own messages");

    await ctx.db.patch(args.messageId, {
      content: "This message was deleted",
      format: "text",
      isDeleted: true,
    });
  }
});

export const cancelScheduled = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) throw new Error("User not found");

    const message = await ctx.db.get(args.messageId);
    
    // Only allow the sender to cancel it, and only if it's currently scheduled
    if (message && message.senderId === user._id && message.isScheduled) {
      await ctx.db.delete(args.messageId);
    }
  },
});

// UPDATED: Prevent sending if the message was cancelled or deleted
export const publishScheduled = internalMutation({
  args: { 
    messageId: v.id("messages"), 
    disappearingTimer: v.optional(v.number()) 
  },
  handler: async (ctx, args) => {
    const msg = await ctx.db.get(args.messageId);
    
    // SAFETY CHECK: If the message was cancelled (hard deleted) or soft-deleted, DO NOT send it.
    if (!msg || msg.isDeleted) return;

    const patchData: any = {
      isScheduled: false,
      updatedAt: Date.now(),
    };

    if (args.disappearingTimer) {
      const expiresAt = Date.now() + args.disappearingTimer;
      patchData.expiresAt = expiresAt;
      await ctx.scheduler.runAt(expiresAt, internal.messages.hardDelete, { messageId: args.messageId });
    }

    await ctx.db.patch(args.messageId, patchData);
  },
});



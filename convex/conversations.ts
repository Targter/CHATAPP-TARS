// convex/conversations.ts
import { mutation ,query} from "./_generated/server";
import { v } from "convex/values";

export const createConversation = mutation({
  args: {
    participantId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!currentUser) throw new Error("User not found");

    // Check if conversation already exists
    const existingConversation = await ctx.db
      .query("conversations")
      .filter((q) => 
        q.or(
          q.and(
            q.eq(q.field("participantOne"), currentUser._id),
            q.eq(q.field("participantTwo"), args.participantId)
          ),
          q.and(
            q.eq(q.field("participantOne"), args.participantId),
            q.eq(q.field("participantTwo"), currentUser._id)
          )
        )
      )
      .first();

    if (existingConversation) {
      return existingConversation._id;
    }

    // Create new conversation
    const conversationId = await ctx.db.insert("conversations", {
      participantOne: currentUser._id,
      participantTwo: args.participantId,
    });

    return conversationId;
  },
});

export const get = query({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const conversation = await ctx.db.get(args.id);
    if (!conversation) return null;

    // Get the partner ID
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!currentUser) return null;

    const partnerId =
      conversation.participantOne === currentUser._id
        ? conversation.participantTwo
        : conversation.participantOne;

    const partner = await ctx.db.get(partnerId);

    return {
      ...conversation,
      partner,
    };
  },
});


export const getMyConversations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!currentUser) return [];

    // Get all conversations where user is participantOne or participantTwo
    const conversations1 = await ctx.db
      .query("conversations")
      .withIndex("by_participantOne", (q) => q.eq("participantOne", currentUser._id))
      .collect();

    const conversations2 = await ctx.db
      .query("conversations")
      .withIndex("by_participantTwo", (q) => q.eq("participantTwo", currentUser._id))
      .collect();

    const allConversations = [...conversations1, ...conversations2];

    // Enrich with partner details and last message
    const conversationsWithDetails = await Promise.all(
      allConversations.map(async (conv) => {
        const partnerId =
          conv.participantOne === currentUser._id
            ? conv.participantTwo
            : conv.participantOne;

        const partner = await ctx.db.get(partnerId);
        if (!partner) return null;

        const lastMessage = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) => q.eq("conversationId", conv._id))
          .order("desc")
          .first();

        return {
          ...conv,
          partner,
          lastMessage,
        };
      })
    );

    // Filter nulls (if partner deleted) and sort by last message time
    return conversationsWithDetails
      .filter((c) => c !== null)
      .sort((a, b) => {
        const timeA = a!.lastMessage?._creationTime || a!._creationTime;
        const timeB = b!.lastMessage?._creationTime || b!._creationTime;
        return timeB - timeA;
      });
  },
});
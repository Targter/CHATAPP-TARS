import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 1. Generate Upload URL (New)
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// ... createConversation ...
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

    const conversationId = await ctx.db.insert("conversations", {
      participantOne: currentUser._id,
      participantTwo: args.participantId,
      isGroup: false,
      participants: [currentUser._id, args.participantId],
      themeColor: "#9280FC",
    });

    return conversationId;
  },
});

// ... createGroup ...
export const createGroup = mutation({
  args: {
    name: v.string(),
    participants: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const allParticipants = [...args.participants, currentUser._id];

    return await ctx.db.insert("conversations", {
      isGroup: true,
      name: args.name,
      adminId: currentUser._id,
      participants: allParticipants,
      themeColor: "#9280FC",
    });
  },
});

// 2. UPDATED: Update Settings (Handles Images Now)
export const updateSettings = mutation({
  args: {
    conversationId: v.id("conversations"),
    name: v.optional(v.string()),
    themeColor: v.optional(v.string()),
    targetUserId: v.optional(v.id("users")),
    groupImageId: v.optional(v.id("_storage")), // NEW: Accept storage ID
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error("Conversation not found");

    let patchData: any = {};

    if (args.themeColor) patchData.themeColor = args.themeColor;

    // Handle Image Upload
    if (args.groupImageId) {
      const url = await ctx.storage.getUrl(args.groupImageId);
      if (url) {
        patchData.groupImage = url;
      }
    }

    // Handle Naming
    if (args.name !== undefined) {
       if (conversation.isGroup) {
          patchData.name = args.name;
       } else if (args.targetUserId) {
          const currentNicknames = conversation.nicknames || {};
          patchData.nicknames = {
             ...currentNicknames,
             [args.targetUserId]: args.name
          };
       }
    }

    await ctx.db.patch(args.conversationId, patchData);
  },
});

// ... get, getMyConversations, markAsRead (Keep exactly as before) ...
export const get = query({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const conversation = await ctx.db.get(args.id);
    if (!conversation) return null;

    let partner = null;
    
    // Logic: If it is NOT a group (isGroup is false or undefined), try to find partner
    if (!conversation.isGroup) {
        const currentUser = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();

        if (currentUser) {
             const partnerId = conversation.participantOne === currentUser._id
            ? conversation.participantTwo
            : conversation.participantOne;
            
            if (partnerId) {
                partner = await ctx.db.get(partnerId);
            }
        }
    }

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

    const allConversations = await ctx.db.query("conversations").collect();

    const myConversations = allConversations.filter(conv => 
        conv.participants?.includes(currentUser._id) || 
        conv.participantOne === currentUser._id || 
        conv.participantTwo === currentUser._id
    );

    const enriched = await Promise.all(
      myConversations.map(async (conv) => {
        let name = conv.name;
        let image = conv.groupImage;
        let isOnline = false;
        let partnerLastSeen = 0;

        if (!conv.isGroup) {
             const partnerId = conv.participantOne === currentUser._id ? conv.participantTwo : conv.participantOne;
             if (partnerId) {
                 const partner = await ctx.db.get(partnerId);
                 const nick = conv.nicknames?.[partnerId];
                 name = nick || partner?.name || "User";
                 image = partner?.image;
                 isOnline = partner?.isOnline || false;
                 partnerLastSeen = partner?.lastSeen || 0;
             }
        }

        const lastMessage = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) => q.eq("conversationId", conv._id))
          .order("desc")
          .first();

        const lastReadRecord = await ctx.db
          .query("conversation_last_read")
          .withIndex("by_user_conversation", (q) => q.eq("userId", currentUser._id).eq("conversationId", conv._id))
          .unique();
        
        const lastSeenTime = lastReadRecord?.lastSeen || 0;
        const unreadCount = lastMessage && lastMessage._creationTime > lastSeenTime ? 1 : 0; 

        return {
          ...conv,
          name,
          image,
          isOnline,
          lastSeen: partnerLastSeen,
          lastMessage,
          unreadCount
        };
      })
    );

    return enriched.sort((a, b) => (b.lastMessage?._creationTime || 0) - (a.lastMessage?._creationTime || 0));
  },
});

export const markAsRead = mutation({
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
      .query("conversation_last_read")
      .withIndex("by_user_conversation", (q) =>
        q.eq("userId", user._id).eq("conversationId", args.conversationId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { lastSeen: Date.now() });
    } else {
      await ctx.db.insert("conversation_last_read", {
        userId: user._id,
        conversationId: args.conversationId,
        lastSeen: Date.now(),
      });
    }
  },
});

export const addMember = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || !conversation.isGroup) {
      throw new Error("Cannot add members to a 1:1 chat or invalid group");
    }

    // Prevent duplicates
    if (conversation.participants?.includes(args.userId)) {
      throw new Error("User is already in this group");
    }

    const newParticipants = [...(conversation.participants || []), args.userId];
    
    await ctx.db.patch(args.conversationId, {
      participants: newParticipants
    });
  },
});

// NEW: Get full profiles of all group members
export const getGroupMembers = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) return [];

    const participantIds = conversation.participants || [];
    
    // Fetch all user documents in parallel
    const members = await Promise.all(
      participantIds.map(async (id) => await ctx.db.get(id))
    );

    return members.filter(m => m !== null);
  },
});
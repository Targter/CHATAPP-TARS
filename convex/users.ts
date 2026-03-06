// convex/users.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Stores a user in the database. 
 * Creates a new record if it doesn't exist, or updates it if it does.
 */
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this user
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (user !== null) {
      // If we've seen this user before, update their name/image if changed
      // This keeps Clerk profile changes in sync
      if (user.name !== identity.name || user.image !== identity.pictureUrl) {
        await ctx.db.patch(user._id, {
          name: identity.name!,
          image: identity.pictureUrl,
          isOnline: true, // Mark online when they interact
        });
      }
      return user._id;
    }

    // If it's a new user, create them
    return await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      name: identity.name!,
      email: identity.email!,
      image: identity.pictureUrl,
      isOnline: true,
    });
  },
});

/**
 * Get the current logged-in user's profile.
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
  },
});

export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called getUsers without authentication present");
    }

    const allUsers = await ctx.db.query("users").collect();
    
    // Filter out the current user
    return allUsers.filter(u => u.tokenIdentifier !== identity.tokenIdentifier);
  },
});
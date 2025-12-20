import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";

// Helper to get user ID from auth context
async function getUserId(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.subject; // Clerk user ID
}

export const addTestResult = mutation({
  args: {
    mode: v.union(v.literal("practice"), v.literal("algorithm")),
    wpm: v.number(),
    accuracy: v.number(),
    timeElapsed: v.number(),
    correctChars: v.number(),
    totalChars: v.number(),
    errors: v.number(),
    textPreview: v.string(),
    algorithmName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    
    const testResultId = await ctx.db.insert("testResults", {
      ...args,
      completedAt: Date.now(),
      userId: userId ?? undefined,
    });
    return testResultId;
  },
});

// Get all test results for the current user
export const getAllTestResults = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    
    if (!userId) {
      // Return empty array for unauthenticated users
      return [];
    }
    
    const results = await ctx.db
      .query("testResults")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return results;
  },
});

// Clear all statistics for the current user
export const clearAllStatistics = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    
    if (!userId) {
      throw new Error("Must be authenticated to clear statistics");
    }
    
    const allResults = await ctx.db
      .query("testResults")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
      
    for (const result of allResults) {
      await ctx.db.delete(result._id);
    }
  },
});

// ============== USER SETTINGS ==============

// Get user settings for the current user
export const getUserSettings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    
    if (!userId) {
      // Return default settings for unauthenticated users
      return {
        practiceMode: "practice" as const,
        typingMode: "input" as const,
      };
    }
    
    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
      
    return settings ?? {
      practiceMode: "practice" as const,
      typingMode: "input" as const,
    };
  },
});

// Update practice mode for the current user
export const updatePracticeMode = mutation({
  args: {
    practiceMode: v.union(v.literal("practice"), v.literal("algorithm")),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    
    if (!userId) {
      // Allow updates for unauthenticated users (won't persist across sessions)
      return "anonymous";
    }
    
    const existingSettings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    if (existingSettings) {
      await ctx.db.patch(existingSettings._id, {
        practiceMode: args.practiceMode,
      });
      return existingSettings._id;
    } else {
      const settingsId = await ctx.db.insert("userSettings", {
        practiceMode: args.practiceMode,
        typingMode: "input",
        userId: userId,
      });
      return settingsId;
    }
  },
});

// Update typing mode for the current user
export const updateTypingMode = mutation({
  args: {
    typingMode: v.union(v.literal("input"), v.literal("typing")),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    
    if (!userId) {
      // Allow updates for unauthenticated users (won't persist across sessions)
      return "anonymous";
    }
    
    const existingSettings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    if (existingSettings) {
      await ctx.db.patch(existingSettings._id, {
        typingMode: args.typingMode,
      });
      return existingSettings._id;
    } else {
      const settingsId = await ctx.db.insert("userSettings", {
        practiceMode: "practice",
        typingMode: args.typingMode,
        userId: userId,
      });
      return settingsId;
    }
  },
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";

async function getAuthUserId(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.subject;
}

async function getResolvedUserId(
  ctx: QueryCtx | MutationCtx,
  localUserId?: string,
) {
  const authUserId = await getAuthUserId(ctx);
  return authUserId ?? localUserId ?? undefined;
}

export const addTestResult = mutation({
  args: {
    localUserId: v.optional(v.string()),
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
    const userId = await getResolvedUserId(ctx, args.localUserId);

    const testResultId = await ctx.db.insert("testResults", {
      mode: args.mode,
      wpm: args.wpm,
      accuracy: args.accuracy,
      timeElapsed: args.timeElapsed,
      correctChars: args.correctChars,
      totalChars: args.totalChars,
      errors: args.errors,
      textPreview: args.textPreview,
      algorithmName: args.algorithmName,
      completedAt: Date.now(),
      userId: userId ?? undefined,
    });
    return testResultId;
  },
});

// Get all test results for the current user
export const getAllTestResults = query({
  args: {
    localUserId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getResolvedUserId(ctx, args.localUserId);

    if (!userId) {
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
  args: {
    localUserId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getResolvedUserId(ctx, args.localUserId);

    if (!userId) {
      throw new Error("No practice identity available");
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
  args: {
    localUserId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getResolvedUserId(ctx, args.localUserId);

    if (!userId) {
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
    localUserId: v.optional(v.string()),
    practiceMode: v.union(v.literal("practice"), v.literal("algorithm")),
  },
  handler: async (ctx, args) => {
    const userId = await getResolvedUserId(ctx, args.localUserId);

    if (!userId) {
      return "missing-user";
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
    localUserId: v.optional(v.string()),
    typingMode: v.union(v.literal("input"), v.literal("typing")),
  },
  handler: async (ctx, args) => {
    const userId = await getResolvedUserId(ctx, args.localUserId);

    if (!userId) {
      return "missing-user";
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

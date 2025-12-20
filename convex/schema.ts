import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  testResults: defineTable({
    userId: v.optional(v.string()), // Optional for anonymous users, can be added later for auth
    mode: v.union(v.literal("practice"), v.literal("algorithm")),
    wpm: v.number(),
    accuracy: v.number(),
    timeElapsed: v.number(), // in seconds
    correctChars: v.number(),
    totalChars: v.number(),
    errors: v.number(),
    completedAt: v.number(), // timestamp
    textPreview: v.string(), // First 50 characters of the text typed
    algorithmName: v.optional(v.string()), // Only for algorithm mode
  })
    .index("by_completed_at", ["completedAt"])
    .index("by_mode", ["mode"])
    .index("by_user", ["userId"]),

  userSettings: defineTable({
    userId: v.optional(v.string()), // Optional for anonymous users
    practiceMode: v.union(v.literal("practice"), v.literal("algorithm")),
    typingMode: v.union(v.literal("input"), v.literal("typing")),
  }).index("by_user", ["userId"]),
});


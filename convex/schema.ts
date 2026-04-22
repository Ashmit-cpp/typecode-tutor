import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const playerState = v.object({
  id: v.string(),          // Clerk User ID
  name: v.string(),        // Display Name
  wpm: v.number(),
  progress: v.number(),    // Percentage (0-100) or Char Count
  accuracy: v.number(),
  errorCount: v.number(),  // Renamed from 'errors' to be explicit
  completed: v.boolean(),  // Has finished typing?
});

const botProfile = v.object({
  name: v.string(),
  targetWpm: v.number(),
  targetAccuracy: v.number(),
  seed: v.number(),
});

export default defineSchema({
  testResults: defineTable({
    userId: v.optional(v.string()), 
    mode: v.union(v.literal("practice"), v.literal("algorithm")),
    wpm: v.number(),
    accuracy: v.number(),
    timeElapsed: v.number(),
    correctChars: v.number(),
    totalChars: v.number(),
    errors: v.number(),
    completedAt: v.number(),
    textPreview: v.string(),
    algorithmName: v.optional(v.string()),
  })
    .index("by_completed_at", ["completedAt"])
    .index("by_mode", ["mode"])
    .index("by_user", ["userId"]),

  userSettings: defineTable({
    userId: v.optional(v.string()), 
    practiceMode: v.union(v.literal("practice"), v.literal("algorithm")),
    typingMode: v.union(v.literal("input"), v.literal("typing")),
  }).index("by_user", ["userId"]),

  /**
   * The "Games" table handles Matchmaking, Room State, AND Progress.
   * * Optimization: 
   * Instead of separate 'queue', 'room', and 'progress' tables, we use one.
   * - A game with status "waiting" acts as the Queue.
   * - A game with status "active" contains live progress for both players.
   * This reduces DB reads/writes by 3x during high-frequency typing updates.
   */
  games: defineTable({
    // Game Status
    status: v.union(
      v.literal("waiting"),  // Waiting for opponent (Acts as Queue)
      v.literal("active"),   // Both players typing
      v.literal("finished")  // Game over
    ),

    // The Text content (Copied here so it never changes during game)
    text: v.string(),
    textSourceId: v.optional(v.string()), // Optional ref to 'texts' table
    source: v.optional(v.union(v.literal("human"), v.literal("bot"))),
    practiceMode: v.optional(v.union(v.literal("practice"), v.literal("algorithm"))),
    algorithmName: v.optional(v.string()),

    // Player 1 (The Host / Creator)
    player1: playerState,

    // Player 2 (The Challenger) - Optional until matched
    player2: v.optional(playerState),
    botProfile: v.optional(botProfile),

    // Metadata
    winnerId: v.optional(v.string()),
    startedAt: v.optional(v.number()), // When status became 'active'
    endedAt: v.optional(v.number()),   // When status became 'finished'
  })
    // Crucial for matchmaking: "Find me a game where status is waiting"
    .index("by_status", ["status"]) 
    // To find "My current active game"
    .index("by_player1_active", ["player1.id", "status"]) 
    .index("by_player2_active", ["player2.id", "status"]),

  /**
   * (Optional) Library of texts to choose from
   * Useful if you want curated challenges.
   */
  texts: defineTable({
    content: v.string(),
    source: v.string(), // e.g. "Harry Potter Ch.1"
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    length: v.number(),
  }).index("by_difficulty", ["difficulty"]),
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Helper for initial player state to avoid repetition
const initialPlayerState = (userId: string, userName: string) => ({
  id: userId,
  name: userName,
  wpm: 0,
  progress: 0,
  accuracy: 100,
  errorCount: 0,
  completed: false,
});

export const findOrCreateGame = mutation({
  args: {
    userId: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. SEARCH: Is there an open game waiting for a player?
    const existingGame = await ctx.db
      .query("games")
      .withIndex("by_status", (q) => q.eq("status", "waiting"))
      .first();

    // 2. JOIN: If we found a game, join it!
    if (existingGame) {
      // Edge Case: Prevent joining your own game if you clicked twice
      if (existingGame.player1.id === args.userId) {
        return { gameId: existingGame._id, status: "waiting" };
      }

      // Atomic Update: Add player 2 and start the game immediately
      await ctx.db.patch(existingGame._id, {
        player2: initialPlayerState(args.userId, args.userName),
        status: "active",
        startedAt: Date.now(),
      });

      return { gameId: existingGame._id, status: "active" };
    }

    // 3. CREATE: No games found? Create a new one.
    
    // Fetch a random text (assuming you have a 'texts' table, or use a fallback)
    const texts = await ctx.db.query("texts").collect(); // Ideally limit this query
    const randomTextRecord = texts.length > 0 
      ? texts[Math.floor(Math.random() * texts.length)]
      : null;
      
    const textToType = randomTextRecord?.content ?? "The quick brown fox jumps over the lazy dog.";

    const gameId = await ctx.db.insert("games", {
      status: "waiting",
      text: textToType,
      player1: initialPlayerState(args.userId, args.userName),
      // player2 is undefined until someone joins
    });

    return { gameId, status: "waiting" };
  },
});

// Use this query on the game page to listen for the opponent joining
export const getGame = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.gameId);
  },
});

// Call this if the user hits "Cancel" while waiting
export const leaveGame = mutation({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    
    // Only delete if it's still waiting. 
    // If it's active, leaving counts as a forfeit (logic for another day)
    if (game && game.status === "waiting") {
      await ctx.db.delete(args.gameId);
    }
  },
});
import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const updateGameProgress = mutation({
    args: {
      gameId: v.id("games"),
      userId: v.string(), // The player making the update
      
      // Performance Metrics
      currentPosition: v.number(),
      wpm: v.number(),
      accuracy: v.number(),
      errorCount: v.number(),
      completed: v.boolean(),
    },
    handler: async (ctx, args) => {
      const game = await ctx.db.get(args.gameId);
  
      // 1. Safety checks
      if (!game) throw new Error("Game not found");
      if (game.status !== "active") {
        // Ignore updates if game is not active (e.g., finished or waiting)
        return; 
      }
  
      // 2. Identify the player
      const isPlayer1 = game.player1.id === args.userId;
      const isPlayer2 = game.player2?.id === args.userId;
  
      if (!isPlayer1 && !isPlayer2) {
        throw new Error("User is not a player in this game");
      }
  
      // 3. Prepare the new player state object
      // We preserve static data (id, name) and update dynamic data
      const updatedPlayerState = {
        id: args.userId,
        name: isPlayer1 ? game.player1.name : game.player2!.name,
        wpm: args.wpm,
        progress: args.currentPosition, 
        accuracy: args.accuracy,
        errorCount: args.errorCount,
        completed: args.completed,
      };
  
      // 4. Prepare the patch object
      const patchData: any = {};
      if (isPlayer1) patchData.player1 = updatedPlayerState;
      if (isPlayer2) patchData.player2 = updatedPlayerState;
  
      // 5. WIN CONDITION LOGIC (Atomic)
      // If this player just finished, and there isn't a winner yet, THEY WIN.
      if (args.completed && !game.winnerId) {
        patchData.status = "finished";
        patchData.winnerId = args.userId;
        patchData.endedAt = Date.now();
      }
  
      // 6. Apply the update
      await ctx.db.patch(args.gameId, patchData);
    },
  });
  
  // ---------------------------------------------------------
  // 2. (Optional) SURRENDER / FORFEIT
  // ---------------------------------------------------------
  export const surrender = mutation({
    args: { gameId: v.id("games"), userId: v.string() },
    handler: async (ctx, args) => {
      const game = await ctx.db.get(args.gameId);
      if (!game || game.status !== "active") return;
  
      // The winner is the OTHER person
      const winnerId = game.player1.id === args.userId 
        ? game.player2?.id 
        : game.player1.id;
  
      if (winnerId) {
        await ctx.db.patch(args.gameId, {
          status: "finished",
          winnerId: winnerId,
          endedAt: Date.now(),
        });
      }
    }
  });
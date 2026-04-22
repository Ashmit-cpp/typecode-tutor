import { v } from "convex/values";
import { mutation } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";

function resolveGameSource(source?: "human" | "bot") {
  return source ?? "human";
}

function computeBotPlayerState(
  game: {
    text: string;
    startedAt?: number;
    player2?: {
      id: string;
      name: string;
      wpm: number;
      progress: number;
      accuracy: number;
      errorCount: number;
      completed: boolean;
    };
    botProfile?: {
      name: string;
      targetWpm: number;
      targetAccuracy: number;
      seed: number;
    };
  },
) {
  if (!game.player2 || !game.botProfile) {
    return game.player2;
  }

  const startedAt = game.startedAt ?? Date.now();
  const elapsedMinutes = Math.max(0, (Date.now() - startedAt) / 1000 / 60);
  const progress = Math.min(
    game.text.length,
    Math.round(game.botProfile.targetWpm * 5 * elapsedMinutes),
  );
  const errorCount = Math.max(
    0,
    Math.round(progress * ((100 - game.botProfile.targetAccuracy) / 100)),
  );

  return {
    id: game.player2.id,
    name: game.botProfile.name,
    wpm: progress > 0 ? game.botProfile.targetWpm : 0,
    progress,
    accuracy: game.botProfile.targetAccuracy,
    errorCount,
    completed: progress >= game.text.length,
  };
}

async function recordBotPracticeResult(
  ctx: MutationCtx,
  game: {
    player1: { id: string };
    text: string;
    practiceMode?: "practice" | "algorithm";
    algorithmName?: string;
    startedAt?: number;
  },
  playerState: {
    wpm: number;
    accuracy: number;
    errorCount: number;
    progress: number;
  },
  completedAt: number,
) {
  if (!game.practiceMode || playerState.progress <= 0) {
    return;
  }

  const correctChars = Math.max(0, playerState.progress - playerState.errorCount);
  await ctx.db.insert("testResults", {
    userId: game.player1.id,
    mode: game.practiceMode,
    wpm: playerState.wpm,
    accuracy: playerState.accuracy,
    timeElapsed: Math.max(
      0,
      (completedAt - (game.startedAt ?? completedAt)) / 1000,
    ),
    correctChars,
    totalChars: playerState.progress,
    errors: playerState.errorCount,
    completedAt,
    textPreview: game.text.slice(0, 50),
    algorithmName:
      game.practiceMode === "algorithm" ? game.algorithmName : undefined,
  });
}

export const updateGameProgress = mutation({
  args: {
    gameId: v.id("games"),
    userId: v.string(),
    currentPosition: v.number(),
    wpm: v.number(),
    accuracy: v.number(),
    errorCount: v.number(),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);

    if (!game) throw new Error("Game not found");
    if (game.status !== "active") {
      return;
    }

    const isPlayer1 = game.player1.id === args.userId;
    const isPlayer2 = game.player2?.id === args.userId;

    if (!isPlayer1 && !isPlayer2) {
      throw new Error("User is not a player in this game");
    }

    const updatedPlayerState = {
      id: args.userId,
      name: isPlayer1 ? game.player1.name : game.player2!.name,
      wpm: args.wpm,
      progress: args.currentPosition,
      accuracy: args.accuracy,
      errorCount: args.errorCount,
      completed: args.completed,
    };

    const gameSource = resolveGameSource(game.source);
    const completedAt = Date.now();

    if (gameSource === "bot") {
      if (!isPlayer1) {
        throw new Error("Only the human player can update a bot match");
      }

      const botState = computeBotPlayerState(game);
      const patchData: Record<string, unknown> = {
        player1: updatedPlayerState,
      };

      if (botState) {
        patchData.player2 = botState;
      }

      if (args.completed && !game.winnerId) {
        patchData.status = "finished";
        patchData.winnerId = args.userId;
        patchData.endedAt = completedAt;
      } else if (botState?.completed && !game.winnerId) {
        patchData.status = "finished";
        patchData.winnerId = botState.id;
        patchData.endedAt = completedAt;
      }

      await ctx.db.patch(args.gameId, patchData);

      if (patchData.status === "finished") {
        await recordBotPracticeResult(ctx, game, updatedPlayerState, completedAt);
      }

      return;
    }

    const patchData: Record<string, unknown> = {};
    if (isPlayer1) patchData.player1 = updatedPlayerState;
    if (isPlayer2) patchData.player2 = updatedPlayerState;

    if (args.completed && !game.winnerId) {
      patchData.status = "finished";
      patchData.winnerId = args.userId;
      patchData.endedAt = completedAt;
    }

    await ctx.db.patch(args.gameId, patchData);
  },
});

export const surrender = mutation({
  args: { gameId: v.id("games"), userId: v.string() },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game || game.status !== "active") return;

    const winnerId =
      game.player1.id === args.userId ? game.player2?.id : game.player1.id;

    if (winnerId) {
      await ctx.db.patch(args.gameId, {
        status: "finished",
        winnerId,
        endedAt: Date.now(),
      });
    }
  },
});

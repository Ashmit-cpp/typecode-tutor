import { v } from "convex/values";
import { query } from "./_generated/server";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

export const listFinishedGamesForUser = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(
      Math.max(1, args.limit ?? DEFAULT_LIMIT),
      MAX_LIMIT,
    );

    const asPlayer1 = await ctx.db
      .query("games")
      .withIndex("by_player1_active", (q) =>
        q.eq("player1.id", args.userId).eq("status", "finished"),
      )
      .collect();

    const asPlayer2 = await ctx.db
      .query("games")
      .withIndex("by_player2_active", (q) =>
        q.eq("player2.id", args.userId).eq("status", "finished"),
      )
      .collect();

    const seen = new Set<string>();
    const merged: typeof asPlayer1 = [];
    for (const g of [...asPlayer1, ...asPlayer2]) {
      const id = g._id;
      if (seen.has(id)) continue;
      seen.add(id);
      merged.push(g);
    }

    merged.sort((a, b) => (b.endedAt ?? 0) - (a.endedAt ?? 0));
    const slice = merged.slice(0, limit);

    const rows: {
      gameId: (typeof slice)[number]["_id"];
      endedAt: number;
      opponentName: string;
      opponentId: string;
      didWin: boolean;
      myWpm: number;
      myAccuracy: number;
      theirWpm: number;
      theirAccuracy: number;
    }[] = [];

    for (const game of slice) {
      const isPlayer1 = game.player1.id === args.userId;
      const me = isPlayer1 ? game.player1 : game.player2;
      const them = isPlayer1 ? game.player2 : game.player1;
      if (!me || !them) continue;

      rows.push({
        gameId: game._id,
        endedAt: game.endedAt ?? 0,
        opponentName: them.name,
        opponentId: them.id,
        didWin: game.winnerId === args.userId,
        myWpm: me.wpm,
        myAccuracy: me.accuracy,
        theirWpm: them.wpm,
        theirAccuracy: them.accuracy,
      });
    }

    return rows;
  },
});

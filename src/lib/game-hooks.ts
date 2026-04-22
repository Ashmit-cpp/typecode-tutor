import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

/**
 * Hook to fetch and subscribe to game state
 */
export function useGame(gameId: Id<"games"> | undefined) {
  return useQuery(
    api.matchmaking.getGame,
    gameId ? { gameId } : "skip"
  );
}

/**
 * Hook to update player progress in a game
 */
export function useUpdateGameProgress() {
  return useMutation(api.game.updateGameProgress);
}

/**
 * Hook to surrender/forfeit a game
 */
export function useSurrender() {
  return useMutation(api.game.surrender);
}

/**
 * Hook to leave a game (only works in "waiting" status)
 */
export function useLeaveGame() {
  return useMutation(api.matchmaking.leaveGame);
}

/**
 * Hook to find or create a game (matchmaking)
 */
export function useFindOrCreateGame() {
  return useMutation(api.matchmaking.findOrCreateGame);
}

export function useCreateBotPracticeGame() {
  return useMutation(api.matchmaking.createBotPracticeGame);
}

/**
 * Finished duels for the signed-in user (merge of games as player1 and player2).
 */
export function useFinishedGamesForUser(userId: string | undefined) {
  return useQuery(
    api.history.listFinishedGamesForUser,
    userId ? { userId, limit: 50 } : "skip",
  );
}

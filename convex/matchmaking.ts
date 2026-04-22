import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Fallback snippets if the database 'texts' table is empty
const CODE_SNIPPETS = [
  "const result = await ctx.db.query('users').collect();",
  "export default function App() { return <div>Hello World</div>; }",
  "const [count, setCount] = useState(0);",
  "interface User { id: string; name: string; email: string; }",
  "useEffect(() => { console.log('Component mounted'); }, []);"
];

const BOT_NAMES = [
  "typebot.exe",
  "ghost.cursor",
  "stack_runner",
  "nullsyntax",
  "byte_sprinter",
];

const initialPlayerState = (userId: string, userName: string) => ({
  id: userId,
  name: userName,
  wpm: 0,
  progress: 0,
  accuracy: 100,
  errorCount: 0,
  completed: false,
});

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createBotProfile(practiceMode: "practice" | "algorithm") {
  const seed = randomInt(100000, 999999);
  const name = BOT_NAMES[seed % BOT_NAMES.length];
  const targetWpm =
    practiceMode === "algorithm" ? randomInt(40, 80) : randomInt(55, 95);
  const targetAccuracy = randomInt(90, 98);

  return {
    name,
    targetWpm,
    targetAccuracy,
    seed,
  };
}

export const findOrCreateGame = mutation({
  args: {
    userId: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. SEARCH: Look for a waiting game
    const existingGame = await ctx.db
      .query("games")
      .withIndex("by_status", (q) => q.eq("status", "waiting"))
      .first();

    if (existingGame) {
      if (existingGame.player1.id === args.userId) {
        return { gameId: existingGame._id, status: "waiting" };
      }

      await ctx.db.patch(existingGame._id, {
        player2: initialPlayerState(args.userId, args.userName),
        status: "active",
        startedAt: Date.now(),
        source: "human",
      });

      return { gameId: existingGame._id, status: "active" };
    }

    // 2. CREATE: Fetch code snippets from the DB
    const texts = await ctx.db.query("texts").collect();
    
    let textToType: string;

    if (texts.length > 0) {
      // Pick a random snippet from your database
      textToType = texts[Math.floor(Math.random() * texts.length)].content;
    } else {
      // Pick a random hardcoded code snippet
      textToType = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
    }

    const gameId = await ctx.db.insert("games", {
      status: "waiting",
      text: textToType,
      source: "human",
      player1: initialPlayerState(args.userId, args.userName),
    });

    return { gameId, status: "waiting" };
  },
});

export const createBotPracticeGame = mutation({
  args: {
    playerId: v.string(),
    playerName: v.string(),
    text: v.string(),
    practiceMode: v.union(v.literal("practice"), v.literal("algorithm")),
    algorithmName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const trimmedText = args.text.trim();
    if (!trimmedText) {
      throw new Error("Bot practice requires reference text");
    }

    const botProfile = createBotProfile(args.practiceMode);
    const gameId = await ctx.db.insert("games", {
      status: "active",
      source: "bot",
      text: args.text,
      practiceMode: args.practiceMode,
      algorithmName: args.algorithmName,
      startedAt: Date.now(),
      player1: initialPlayerState(args.playerId, args.playerName),
      player2: initialPlayerState(`bot:${botProfile.seed}`, botProfile.name),
      botProfile,
    });

    return { gameId };
  },
});

export const getGame = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.gameId);
  },
});

export const leaveGame = mutation({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game || game.status !== "waiting") return;
    await ctx.db.delete(args.gameId);
  },
});

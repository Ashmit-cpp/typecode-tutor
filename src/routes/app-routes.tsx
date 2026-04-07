import { Suspense, lazy } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { NavigationProgress } from "@/components/navigation-progress";
import { PageShellFallback } from "@/components/page-shell-fallback";
import { useFindOrCreateGame } from "@/lib/game-hooks";
import MainLayout from "@/layouts/MainLayout";
import PracticeLayout from "@/layouts/PracticeLayout";
import { toast } from "sonner"

const PracticePage = lazy(() =>
  import("@/pages/practice-page").then((mod) => ({ default: mod.PracticePage }))
);
const DuelsPage = lazy(() =>
  import("@/pages/keyclash-page").then((mod) => ({ default: mod.default }))
);
const StatisticsPage = lazy(() =>
  import("../components/statistics-page").then((mod) => ({
    default: mod.StatisticsPage,
  }))
);
const GamePage = lazy(() =>
  import("@/pages/game-page").then((mod) => ({ default: mod.GamePage }))
);
const DuelsHistoryPage = lazy(() =>
  import("@/pages/duels-history-page").then((mod) => ({ default: mod.default }))
);


// Wrapper component for Duels page to handle hooks
function DuelsPageWrapper() {
  const navigate = useNavigate();
  const { user } = useUser();
  const findGame = useFindOrCreateGame();
  
  async function handleEnterQueue() {
    if (!user) {
      console.error("User must be signed in to enter queue");
      toast.error("Please sign in to enter queue", {
        description: "You must be signed in to enter the queue",
      });
      return;
    }

    try {
      const { gameId } = await findGame({
        userId: user.id,
        userName: user.fullName ?? user.firstName ?? "Anonymous",
      });

      // Redirect to /game/[gameId]
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error("Failed to find or create game:", error);
      // TODO: Show error toast/notification
    }
  }

  return (
    <MainLayout pageChalk="duel">
      <DuelsPage onEnterQueue={handleEnterQueue} />
    </MainLayout>
  );
}

export function AppRoutes() {
  return (
    <>
      <NavigationProgress />
      <Suspense fallback={<PageShellFallback />}>
        <Routes>
          <Route path="/" element={<DuelsPageWrapper />} />
          <Route path="/duels" element={<DuelsPageWrapper />} />
          <Route
            path="/duels/history"
            element={
              <MainLayout pageChalk="history">
                <DuelsHistoryPage />
              </MainLayout>
            }
          />
          <Route
            path="/game/:gameId"
            element={
              <MainLayout pageChalk="duel">
                <GamePage />
              </MainLayout>
            }
          />
          <Route
            path="/practice"
            element={
              <PracticeLayout pageChalk="practice">
                <PracticePage />
              </PracticeLayout>
            }
          />
          <Route
            path="/statistics"
            element={
              <PracticeLayout pageChalk="stats">
                <StatisticsPage />
              </PracticeLayout>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}

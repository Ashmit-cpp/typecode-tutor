import { Suspense, lazy } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { LoadingState } from "@/components/ui/loading-state";
import { useFindOrCreateGame } from "@/lib/game-hooks";
const MainLayout = lazy(() => import("@/layouts/MainLayout"));
const PracticeLayout = lazy(() => import("@/layouts/PracticeLayout"));
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
    <MainLayout>
      <DuelsPage onEnterQueue={handleEnterQueue} />
    </MainLayout>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<div className="bg-background text-foreground"></div>}>
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<LoadingState label="Loading..." />}>
            <DuelsPageWrapper />
          </Suspense>
        }
      />
      <Route
        path="/duels"
        element={
          <Suspense fallback={<LoadingState label="Loading duels..." />}>
            <DuelsPageWrapper />
          </Suspense>
        }
      />
      <Route
        path="/game/:gameId"
        element={
          <Suspense fallback={<LoadingState label="Loading game..." />}>
            <MainLayout>
              <GamePage />
            </MainLayout>
          </Suspense>
        }
      />
      <Route
        path="/practice"
        element={
          <Suspense fallback={<LoadingState label="Loading practice..." />}>
            <PracticeLayout>
              <PracticePage />
            </PracticeLayout>
          </Suspense>
        }
      />
      <Route
        path="/statistics"
        element={
          <Suspense fallback={<LoadingState label="Loading statistics..." />}>
            <PracticeLayout>
              <StatisticsPage />
            </PracticeLayout>
          </Suspense>
          }
        />
      </Routes>
    </Suspense>
  );
}

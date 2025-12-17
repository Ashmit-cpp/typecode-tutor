import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { LoadingState } from "@/components/ui/loading-state";
const MainLayout = lazy(() => import("@/layouts/MainLayout"));
const PracticeLayout = lazy(() => import("@/layouts/PracticeLayout"));

const LandingPage = lazy(() =>
  import("@/pages/landing-page").then((mod) => ({ default: mod.default }))
);
const PracticePage = lazy(() =>
  import("@/pages/practice-page").then((mod) => ({ default: mod.PracticePage }))
);
const AlgorithmPage = lazy(() =>
  import("@/pages/algorithm-page").then((mod) => ({
    default: mod.AlgorithmPage,
  }))
);
const DuelsPage = lazy(() =>
  import("@/pages/keyclash-page").then((mod) => ({ default: mod.default }))
);
const StatisticsPage = lazy(() =>
  import("../components/statistics-page").then((mod) => ({
    default: mod.StatisticsPage,
  }))
);

export function AppRoutes() {
  return (
    <Suspense
      fallback={
        <LoadingState label="Loading app..." className="py-10" />
      }
    >
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingState label="Loading home..." />}>
              <MainLayout>
                <LandingPage />
              </MainLayout>
            </Suspense>
          }
        />
        <Route
          path="/duels"
          element={
            <Suspense fallback={<LoadingState label="Loading duels..." />}>
              <MainLayout>
                <DuelsPage onEnterQueue={() => {}} />
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
          path="/algorithm"
          element={
            <Suspense fallback={<LoadingState label="Loading algorithms..." />}>
              <PracticeLayout>
                <AlgorithmPage />
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

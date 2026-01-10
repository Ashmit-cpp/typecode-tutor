import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AppRoutes } from "./routes/app-routes";
import { useUserSettings } from "./lib/convex-hooks";

export default function App() {
  // Load user settings globally since they're needed across practice pages
  useUserSettings();

  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />

        <AppRoutes />
      </ThemeProvider>
    </BrowserRouter>
  );
}

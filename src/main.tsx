import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import "./index.css";
import { shadcn } from "@clerk/themes";
import App from "./App.tsx";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const clerkAppearance = {
  theme: shadcn,
  elements: {
    rootBox: "mx-auto",
    modalBackdrop: "backdrop-blur-sm",
    modalContent: "w-[calc(100vw-1.5rem)] max-w-md p-3 sm:w-full sm:max-w-lg sm:p-5",
    cardBox: "w-full shadow-sm border",
    card: "overflow-hidden rounded-[calc(var(--radius)+0.25rem)] border border-white/[0.08] bg-card/95 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl",
    header: "px-6 pt-6 sm:px-7 sm:pt-7",
    main: "px-6 py-5 sm:px-7 sm:py-6",
    footer: "px-6 pb-6 sm:px-7 sm:pb-7",
    modalCloseButton:
      "rounded-[calc(var(--radius)-0.05rem)] border border-white/[0.08] bg-background/70 text-muted-foreground hover:bg-accent/60 hover:text-foreground",
  },
} as const;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={clerkAppearance}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <App />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>
);

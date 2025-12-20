// src/lib/next-compat-router-polyfill.ts
// A light polyfill for `next/compat/router` so @clerk/elements can import named hooks and
// also get a default compat router object. This is intentionally minimal for client-side use.

import { useCallback } from "react";
import { useNavigate, useSearchParams as useRouterSearchParams } from "react-router-dom";

/* ---------- Named hook: useRouter ---------- */
export function useRouter() {
  const navigate = useNavigate();

  const push = useCallback((url: string) => {
    // react-router navigate accepts path or number. We return a Promise to mimic Next.
    navigate(url);
    return Promise.resolve(true);
  }, [navigate]);

  const replace = useCallback((url: string) => {
    navigate(url, { replace: true });
    return Promise.resolve(true);
  }, [navigate]);

  return {
    push,
    replace,
    back: () => navigate(-1 as any),
    forward: () => navigate(1 as any),
    refresh: () => window.location.reload(),
    prefetch: (() => Promise.resolve()) as () => Promise<void>,
  };
}

/* ---------- Other named exports that may be imported ---------- */
export function useSearchParams() {
  const [searchParams, setSearchParams] = useRouterSearchParams();
  return [searchParams, setSearchParams] as const;
}

export function usePathname() {
  return typeof window !== "undefined" ? window.location.pathname : "/";
}

export function useParams() {
  // Minimal: react-router's useParams could be mapped here if you want to support route params.
  return {};
}

export function redirect(url: string) {
  if (typeof window !== "undefined") window.location.assign(url);
}

export function notFound() {
  // Keep minimal — some libs expect a function to exist.
  throw new Error("Not found");
}

/* ---------- Default export: compatibility object ---------- */
const compatRouter = {
  push: (url: string) => {
    if (typeof window !== "undefined") {
      window.location.assign(url);
    }
    return Promise.resolve(true);
  },
  replace: (url: string) => {
    if (typeof window !== "undefined") {
      window.location.replace(url);
    }
    return Promise.resolve(true);
  },
  prefetch: () => Promise.resolve(),
  back: () => {
    if (typeof window !== "undefined") window.history.back();
  },
  forward: () => {
    if (typeof window !== "undefined") window.history.forward();
  },
  pathname: typeof window !== "undefined" ? window.location.pathname : "/",
};

export default compatRouter;

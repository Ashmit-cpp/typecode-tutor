import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPageChalkIdFromPathname,
  pageChalkCssValue,
} from "@/lib/page-chalk";

/**
 * Thin top progress bar that tracks client-side navigations.
 * - Starts animating toward 70% when an internal link is clicked.
 * - Completes to 100% when the location actually changes (chunk loaded).
 * - Automatically resets if no navigation occurs within 10 s.
 */
export function NavigationProgress() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [completing, setCompleting] = useState(false);
  /** Destination route (set on internal link click so bar tint matches where we’re going). */
  const [pendingTargetPath, setPendingTargetPath] = useState<string | null>(
    null,
  );
  const completingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const prevPathRef = useRef(location.pathname);
  const isFirstRender = useRef(true);

  const pathForChalk = pendingTargetPath ?? location.pathname;
  const navChalk = pageChalkCssValue(
    getPageChalkIdFromPathname(pathForChalk),
  );

  // Detect internal link clicks to start the bar BEFORE route change
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("//") || href.startsWith("#")) return;

      const targetPath = new URL(href, window.location.origin).pathname;
      if (targetPath === window.location.pathname) return;

      completingRef.current = false;
      setCompleting(false);
      setPendingTargetPath(targetPath);
      setVisible(true);

      // Safety reset if navigation never completes (e.g. blocked)
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setVisible(false);
        setCompleting(false);
      }, 10_000);
    }

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  // Location changed → complete the bar
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevPathRef.current = location.pathname;
      return;
    }
    if (prevPathRef.current === location.pathname) return;
    prevPathRef.current = location.pathname;
    setPendingTargetPath(null);

    clearTimeout(timeoutRef.current);
    completingRef.current = true;
    setCompleting(true);

    // After completion animation, hide
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      setCompleting(false);
    }, 500);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="nav-progress"
          className="pointer-events-none fixed left-0 top-0 z-[9999] h-[2px]"
          style={{
            backgroundColor: navChalk,
            boxShadow: `0 0 14px color-mix(in oklch, ${navChalk} 55%, transparent)`,
          }}
          initial={{ width: "0%", opacity: 1 }}
          animate={
            completing
              ? { width: "100%", opacity: 1 }
              : { width: "65%", opacity: 1 }
          }
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={
            completing
              ? { duration: 0.25, ease: "easeOut" }
              : { duration: 0.8, ease: "easeOut" }
          }
        />
      )}
    </AnimatePresence>
  );
}

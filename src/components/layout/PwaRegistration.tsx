"use client";

import { useEffect } from "react";

export default function PwaRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let cancelled = false;

    async function register() {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch {
        if (!cancelled) {
          // Registration failures are non-blocking; the app still works normally.
        }
      }
    }

    void register();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

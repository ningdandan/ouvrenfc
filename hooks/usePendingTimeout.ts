"use client";

import { useEffect, useState } from "react";

export function usePendingTimeout(isPending: boolean, timeoutMs = 10000) {
  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    if (!isPending) {
      setIsTimedOut(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setIsTimedOut(true);
    }, timeoutMs);

    return () => window.clearTimeout(timer);
  }, [isPending, timeoutMs]);

  return isTimedOut;
}

"use client";

import { useEffect, useState } from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

export function NetworkToast() {
  const { isOnline, isSlowNetwork } = useNetworkStatus();
  const [justRestored, setJustRestored] = useState(false);
  const [hadOffline, setHadOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setHadOffline(true);
      setJustRestored(false);
      return;
    }
    if (hadOffline) {
      setJustRestored(true);
      const timer = window.setTimeout(() => setJustRestored(false), 2500);
      return () => window.clearTimeout(timer);
    }
  }, [isOnline, hadOffline]);

  let message: string | null = null;
  let colorClass = "bg-black/80";

  if (!isOnline) {
    message = "You are offline.";
    colorClass = "bg-[#7f1d1d]/90";
  } else if (justRestored) {
    message = "Back online.";
    colorClass = "bg-[#14532d]/90";
  } else if (isSlowNetwork) {
    message = "Slow network detected.";
    colorClass = "bg-black/80";
  }

  if (!message) return null;

  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 px-4">
      <div className={`rounded-full px-4 py-2 text-xs text-white shadow ${colorClass}`}>
        {message}
      </div>
    </div>
  );
}

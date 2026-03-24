"use client";

import { useEffect, useState } from "react";

type EffectiveNetworkType = "slow-2g" | "2g" | "3g" | "4g";

type NavigatorConnection = {
  effectiveType?: EffectiveNetworkType;
};

function readConnection() {
  const nav = navigator as Navigator & { connection?: NavigatorConnection };
  const effectiveType = nav.connection?.effectiveType;
  const isSlowNetwork = effectiveType === "slow-2g" || effectiveType === "2g" || effectiveType === "3g";
  return { effectiveType, isSlowNetwork };
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setIsOnline(navigator.onLine);
      const connection = readConnection();
      setIsSlowNetwork(connection.isSlowNetwork);
    };

    refresh();
    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    return () => {
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", refresh);
    };
  }, []);

  return { isOnline, isSlowNetwork };
}

"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-[100svh] flex flex-col items-center justify-center gap-4 px-6 text-center antialiased">
        <p className="text-sm text-white/60">something went wrong</p>
        <button
          type="button"
          onClick={reset}
          className="text-xs text-white/40 underline underline-offset-2 active:scale-95 transition-transform"
        >
          try again
        </button>
      </body>
    </html>
  );
}

"use client";

import type { ReactNode } from "react";
import "./backroom.css";

export function BackroomShell({ children }: { children: ReactNode }) {
  return (
    <div className="skin-backroom min-h-[100svh] min-h-dvh w-screen flex flex-col antialiased">
      <div className="w-full max-w-[420px] mx-auto flex flex-1 flex-col relative min-h-[540px]">
        {children}
      </div>
    </div>
  );
}


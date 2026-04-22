"use client";

import { BackroomShell, BackroomPanel } from "@/skins/backroom";

export default function HomePage() {
  return (
    <BackroomShell>
      <div data-home-page="true" className="hidden" />
      <BackroomPanel>
        <div className="absolute z-10 left-1/2 top-[75%] -translate-x-1/2 flex flex-col items-center">
          <a
            href="https://www.ouvre.nyc"
            className="text-2xl tracking-[0.05em] text-black active:scale-95 transition-transform"
          >
            unlock ouvre
          </a>
        </div>
      </BackroomPanel>
    </BackroomShell>
  );
}

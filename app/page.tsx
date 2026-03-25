"use client";

import { BackroomShell } from "@/skins/backroom";
import { OuvreBackroomBackground } from "@/skins/ouvre-backroom-background";

export default function HomePage() {
  return (
    <BackroomShell>
      <section className="relative flex-1 flex flex-col items-center justify-center gap-16 p-6 overflow-hidden">
        <OuvreBackroomBackground />

        <div className="absolute z-10 left-1/2 top-[75%] -translate-x-1/2 flex flex-col items-center">
          <a
            href="https://www.ouvre.nyc"
            className="text-2xl tracking-[0.2em] text-black active:scale-95 transition-transform"
          >
            unlock ouvre
          </a>
        </div>
      </section>
    </BackroomShell>
  );
}


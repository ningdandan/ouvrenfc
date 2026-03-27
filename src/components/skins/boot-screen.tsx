"use client";

import { useEffect } from "react";
import { Space_Grotesk } from "next/font/google";
import { OuvreBackroomBackground } from "./ouvre-backroom-background";
import "./boot-screen.css";
import "./backroom.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

type Props = {
  id: string;
  onComplete: () => void;
  /** How long (ms) to show the boot screen before calling onComplete. Default 1800. */
  duration?: number;
};

export function BootScreen({ id, onComplete, duration = 2800 }: Props) {
  const line1 = `ouvre#${id} is now active,`;
  const line2 = `start initializing...`;

  useEffect(() => {
    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <div className={`boot-overlay ${spaceGrotesk.className}`}>
      <OuvreBackroomBackground />
      <div className="boot-dim" />
      <div className="boot-scanlines" />
      <div className="boot-text-wrap">
        <span className="techno-beat">
          <span className="boot-text-glitch techno-tremor" data-text={line1}>
            {line1}
          </span>
        </span>
        <br />
        <span className="techno-beat">
          <span className="boot-text-glitch techno-tremor" data-text={line2}>
            {line2}
            <span className="boot-cursor" />
          </span>
        </span>
      </div>
    </div>
  );
}

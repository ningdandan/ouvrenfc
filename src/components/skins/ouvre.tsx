"use client";

import type { SkinProps } from "@/app/link/types";
import { getSocialHref } from "@/app/link/social-url";
import { Space_Grotesk } from "next/font/google";
import { trackClick } from "./track-click";
import "./ouvre.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export function OuvreSkin({ id, handle, links, onRequestEdit }: SkinProps) {
  const header = links.find((l) => l.type === "header")?.value?.trim() ?? "";
  const rows = links.filter((l) => l.type !== "header");

  return (
    <div
      className={`skin-ouvre min-h-[100svh] min-h-dvh w-full flex flex-col antialiased ${spaceGrotesk.className}`}
    >
      <div className="w-full max-w-[420px] mx-auto flex flex-1 flex-col relative min-h-[540px]">
        <div className="ouvre-bg-video-wrap">
          <img
            src="/video3.gif"
            alt=""
            aria-hidden
            className="ouvre-bg-video pointer-events-none select-none"
          />
        </div>
        <div className="ouvre-stars-overlay" />

        <div className="relative z-10 flex items-start justify-between px-6 pt-10 text-white/75 text-[14px]">
          <p className="ouvre-title leading-none">{header || "ouvre"}</p>
          <p className="ouvre-title leading-none">
            <a
              href="https://ouvre.nyc"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              ouvre
            </a>
            #{id}
          </p>
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
          <ul className="list-none p-0 m-0 flex flex-col items-center gap-4 w-full">
            {rows.length === 0 ? (
              <li className="ouvre-link text-[28px] leading-none text-white/75">No links yet.</li>
            ) : (
              rows.map((link, i) => {
                const href = getSocialHref(link.type, link.value);
                const isExternal = href.startsWith("http");
                return (
                  <li key={`${link.type}-${i}`} className="w-full flex justify-center">
                    <a
                      href={href}
                      className="ouvre-link text-[28px] leading-none text-white no-underline active:scale-95 transition-transform"
                      aria-label={link.type}
                      {...(isExternal && {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      })}
                      onClick={() => handle && trackClick(handle, link.type)}
                    >
                      {link.type}
                    </a>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {onRequestEdit ? (
          <button
            type="button"
            onClick={onRequestEdit}
            className="absolute z-10 bottom-4 right-4 text-[14px] text-white/90 active:scale-95 transition-transform"
          >
            edit
          </button>
        ) : null}
      </div>
    </div>
  );
}


"use client";

import type { SkinProps } from "@/app/link/types";
import { getSocialHref } from "@/app/link/social-url";
import { trackClick } from "./track-click";
import "./brat.css";

export function BratSkin({ id, handle, links, onRequestEdit }: SkinProps) {
  const header = links.find((l) => l.type === "header")?.value?.trim() ?? "";
  const rows = links.filter((l) => l.type !== "header");

  return (
    <div className="skin-brat min-h-[100svh] min-h-dvh w-full flex flex-col bg-[#8AD000] text-black antialiased">
      <div className="w-full max-w-[420px] mx-auto flex flex-1 flex-col relative min-h-[540px]">
        <div className="flex items-start justify-between px-6 pt-8 mt-[10px]">
          <div className="text-[24px] leading-none whitespace-nowrap">
            {header}
          </div>
          <div className="text-[24px] leading-none whitespace-nowrap">
            <a
              href="https://ouvre.nyc"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >ouvre</a>#{id}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-start justify-center px-6 pt-6 pb-[env(safe-area-inset-bottom)]">
          <ul className="list-none p-0 m-0 flex flex-col items-start justify-start gap-5 w-full">
            {rows.length === 0 ? (
              <li className="text-sm text-black/70">No links yet.</li>
            ) : (
              rows.map((link, i) => {
                const href = getSocialHref(link.type, link.value);
                return (
                  <li key={`${link.type}-${i}`} className="w-full flex flex-col items-start">
                    <a
                      href={href}
                      className="w-full flex flex-col items-start justify-center gap-1 active:scale-95 transition-transform"
                      aria-label={link.type}
                      onClick={() => handle && trackClick(handle, link.type)}
                    >
                      <div
                        className="brat-link-wordWrap text-[clamp(48px,10vw,72px)] leading-[0.85]"
                        data-text={link.type}
                      >
                        <span className="brat-link-wordText">
                          {link.type}
                        </span>
                      </div>
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
            className="absolute bottom-4 right-4 text-xs text-black/80 active:scale-95 transition-transform"
          >
            edit
          </button>
        ) : null}
      </div>
    </div>
  );
}


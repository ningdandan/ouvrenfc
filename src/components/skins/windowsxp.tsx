"use client";

import { getSocialImage } from "@/app/link/social-icons";
import { getSocialHref } from "@/app/link/social-url";
import type { SkinProps } from "@/app/link/types";
import { Pixelify_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { trackClick } from "./track-click";
import "./windowsxp.css";

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-pixelify-sans",
});

export type WindowsXPSkinProps = SkinProps;

export function WindowsXPSkinShell({ children }: { children: ReactNode }) {
  return (
    <div className={`${pixelifySans.variable} skin-windowsxp min-h-[100svh] min-h-dvh w-full flex flex-col text-black antialiased bg-[url('/bg.webp')] bg-cover bg-center`}>
      <div className="w-full max-w-[420px] mx-auto flex flex-1 flex-col relative min-h-[540px]">
        {children}
      </div>
    </div>
  );
}

export function WindowsXPSkin({ id, handle, links, onRequestEdit }: WindowsXPSkinProps) {
  const header = links.find((l) => l.type === "header")?.value?.trim() ?? "";
  const socialLinks = links.filter((l) => l.type !== "header");

  return (
    <WindowsXPSkinShell>
      <div className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
        <p className="text-sm drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">
          <a
            href="https://ouvre.nyc"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline text-inherit"
            style={{ textDecoration: "none" }}
          >ouvre</a>{" "}{id}
        </p>
        {header ? (
          <p className="text-lg drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">
            {header}
          </p>
        ) : null}
        {socialLinks.length === 0 && onRequestEdit ? (
          <button
            type="button"
            onClick={onRequestEdit}
            className="text-sm text-black/70 border border-black/25 px-5 py-2.5 rounded-sm active:scale-95 transition-transform drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
          >
            start customize
          </button>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-6">
              {socialLinks.length === 0 ? (
                <p className="text-xs text-black/70 drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">
                  No links yet.
                </p>
              ) : (
                socialLinks.map((link, i) => {
                  const imgSrc = getSocialImage(link.type);
                  const href = getSocialHref(link.type, link.value);
                  const isExternal = href.startsWith("http");
                  return (
                    <a
                      key={`${link.type}-${i}`}
                      href={href}
                      {...(isExternal && {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      })}
                      className="flex flex-col items-center justify-center active:scale-95 transition-transform"
                      aria-label={link.value}
                      onClick={() => handle && trackClick(handle, link.type)}
                    >
                      <img
                        src={imgSrc}
                        alt=""
                        className="w-24 h-24 md:w-28 md:h-28 object-contain"
                      />
                    </a>
                  );
                })
              )}
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
          </>
        )}
      </div>
    </WindowsXPSkinShell>
  );
}

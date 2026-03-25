"use client";

import { getSocialImage } from "@/app/link/social-icons";
import { getSocialHref } from "@/app/link/social-url";
import type { SkinProps } from "@/app/link/types";
import type { ReactNode } from "react";
import "./windowsxp.css";

export type WindowsXPSkinProps = SkinProps & {
  onRequestEdit?: () => void;
};

export function WindowsXPSkinShell({ children }: { children: ReactNode }) {
  return (
    <div className="skin-windowsxp min-h-[100svh] min-h-dvh w-full flex flex-col text-black antialiased bg-[url('/bg.webp')] bg-cover bg-center">
      <div className="w-full max-w-[420px] mx-auto flex flex-1 flex-col relative min-h-[540px]">
        {children}
      </div>
    </div>
  );
}

export function WindowsXPSkin({ id, links, onRequestEdit }: WindowsXPSkinProps) {
  const header = links.find((l) => l.type === "header")?.value?.trim() ?? "";
  const socialLinks = links.filter((l) => l.type !== "header");

  return (
    <WindowsXPSkinShell>
      <div className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
        <p className="text-sm drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">
          ouvre {id}
        </p>
        {header ? (
          <p className="text-lg drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">
            {header}
          </p>
        ) : null}
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
      </div>
    </WindowsXPSkinShell>
  );
}

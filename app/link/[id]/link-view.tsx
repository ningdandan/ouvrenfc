"use client";

import { useState } from "react";
import { OwnerAccess } from "./owner-access";
import { getSocialImage } from "../social-icons";
import { getSocialHref } from "../social-url";
import type { SocialLink } from "../types";

type Props = {
  id: string;
  links: SocialLink[];
};

type Mode = "public" | "owner";

export function LinkView({ id, links }: Props) {
  const [mode, setMode] = useState<Mode>("public");

  const header = links.find((l) => l.type === "header")?.value?.trim() ?? "";
  const socialLinks = links.filter((l) => l.type !== "header");

  if (mode === "owner") {
    // 覆盖整个视窗：只显示拨号/管理界面
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 pt-4">
          <span className="text-xs text-black drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">
            CHIP {id}
          </span>
          <button
            type="button"
            onClick={() => setMode("public")}
            className="text-xs text-black/80 active:scale-95 transition-transform"
          >
            close
          </button>
        </div>
        <OwnerAccess
          id={id}
          initialLinks={links}
          onDone={() => setMode("public")}
        />
      </div>
    );
  }

  // Public view：只显示社交 icon + 右下角 edit
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 p-6 relative">
      <p className="text-sm text-black drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">
        CHIP {id}
      </p>
      {header && (
        <p className="text-lg text-black drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">
          {header}
        </p>
      )}
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

      <button
        type="button"
        onClick={() => setMode("owner")}
        className="absolute bottom-4 right-4 text-xs text-black/80 active:scale-95 transition-transform"
      >
        edit
      </button>
    </div>
  );
}


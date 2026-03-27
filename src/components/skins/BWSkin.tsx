"use client";

import { getSocialHref } from "@/app/link/social-url";
import type { SkinProps } from "@/app/link/types";
import { trackClick } from "./track-click";

export function BWSkin({ id, handle, links }: SkinProps) {
  const header = links.find((l) => l.type === "header")?.value?.trim() ?? "";
  const rows = links.filter((l) => l.type !== "header");

  return (
    <div className="min-h-[100svh] min-h-dvh bg-white text-black font-sans p-6 flex flex-col gap-4">
      <p className="text-sm font-sans">
        <a
          href="https://ouvre.nyc"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit" }}
        >ouvre</a>{" "}{id}
      </p>
      {header ? <p className="text-base font-sans">{header}</p> : null}
      <ul className="list-none p-0 m-0 flex flex-col gap-2 font-sans">
        {rows.length === 0 ? (
          <li className="text-sm">No links yet.</li>
        ) : (
          rows.map((link, i) => {
            const href = getSocialHref(link.type, link.value);
            const label = `${link.type}: ${link.value}`;
            const isExternal = href.startsWith("http");
            return (
              <li key={`${link.type}-${i}`} className="text-sm">
                {href === "#" ? (
                  <span>{label}</span>
                ) : (
                  <a
                    href={href}
                    className="underline text-inherit"
                    {...(isExternal && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                    onClick={() => handle && trackClick(handle, link.type)}
                  >
                    {label}
                  </a>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

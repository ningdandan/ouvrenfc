"use client";

import type { SkinProps } from "@/app/link/types";
import { getSocialHref } from "@/app/link/social-url";

const linkStyle: React.CSSProperties = {
  textAlign: "center",
  WebkitTextStrokeWidth: "2px",
  WebkitTextStrokeColor: "#000",
  fontFamily: "Impact",
  fontSize: "48px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "normal",
  textTransform: "uppercase",
  color: "#fff",
  display: "block",
  textDecoration: "none",
};

export function DuckSkin({ id, links, onRequestEdit }: SkinProps) {
  const header = links.find((l) => l.type === "header")?.value?.trim() ?? "";
  const rows = links.filter((l) => l.type !== "header");

  return (
    <div className="w-full flex justify-center" style={{ minHeight: "100dvh" }}>
      <div
        className="w-full max-w-[420px] relative overflow-hidden"
        style={{
          height: "100dvh",
          backgroundImage: "url(/duck.webp)",
          backgroundSize: "auto 100%",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* single wrapper — OUVRE at top, links below, whole block shifted down together */}
        <div
          style={{
            position: "absolute",
            top: "12%",
            bottom: "4%",
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Impact",
              fontSize: "20px",
              fontWeight: 400,
              textTransform: "uppercase",
              color: "#fff",
              WebkitTextStrokeWidth: "1px",
              WebkitTextStrokeColor: "#000",
              letterSpacing: "0.05em",
              textAlign: "center",
            }}
          >
            OUVRE#{id}
            {header ? <div style={{ marginTop: "4px" }}>{header}</div> : null}
          </div>

          <div style={{ flex: 1 }} />

          <ul className="list-none p-0 m-0 flex flex-col items-center" style={{ gap: "0px" }}>
            {rows.length === 0 ? (
              <li style={{ ...linkStyle, fontSize: "24px" }}>No links yet.</li>
            ) : (
              rows.map((link, i) => {
                const href = getSocialHref(link.type, link.value);
                return (
                  <li key={`${link.type}-${i}`}>
                    <a
                      href={href}
                      style={linkStyle}
                      className="active:scale-95 transition-transform"
                      aria-label={link.type}
                    >
                      {link.type}
                    </a>
                  </li>
                );
              })
            )}
          </ul>

          <div style={{ flex: "0 0 8%" }} />
        </div>

        {onRequestEdit ? (
          <button
            type="button"
            onClick={onRequestEdit}
            style={{
              position: "absolute",
              bottom: "16px",
              right: "16px",
              fontSize: "12px",
              color: "rgba(255,255,255,0.8)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            className="active:scale-95 transition-transform"
          >
            edit
          </button>
        ) : null}
      </div>
    </div>
  );
}

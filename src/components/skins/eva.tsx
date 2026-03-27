"use client";

import type { SkinProps } from "@/app/link/types";
import { getSocialHref } from "@/app/link/social-url";
import "./eva.css";

const HEX_POSITIONS = [
  "eva-hex-pos-1",
  "eva-hex-pos-2",
  "eva-hex-pos-3",
  "eva-hex-pos-4",
  "eva-hex-pos-5",
  "eva-hex-pos-6",
] as const;

export function EvaSkin({ id, links, onRequestEdit }: SkinProps) {
  const header = links.find((l) => l.type === "header")?.value?.trim() ?? "";
  const rows = links.filter((l) => l.type !== "header").slice(0, 6);

  return (
    <div className="skin-eva h-[100svh] h-dvh w-full flex flex-col antialiased overflow-hidden">
      <div className="w-full max-w-[420px] mx-auto flex flex-1 flex-col relative overflow-hidden">

        {/* TV static noise layers */}
        <div className="eva-tv-static-overlay" />
        <div className="eva-tv-static-burst" />

        {/* Scanlines */}
        <div className="eva-scanlines" />

        {/* Vignette */}
        <div className="eva-vignette" />

        {/* Perspective map grid */}
        <div className="eva-map-grid" />

        {/* Map contour SVG — full set of contour paths, coordinate marks, shockwaves */}
        <svg
          className="eva-map-contour"
          viewBox="0 0 375 812"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path className="contour-main" d="M-20 120 C50 95, 120 140, 182 118 C240 98, 305 105, 396 142" />
          <path className="contour-sub" d="M-30 156 C36 130, 122 176, 188 158 C248 142, 314 144, 404 176" />
          <path className="contour-main" d="M-25 240 C52 212, 132 258, 202 236 C276 212, 332 220, 402 250" />
          <path className="contour-sub" d="M-20 274 C58 244, 145 291, 218 268 C286 245, 338 255, 398 286" />
          <path className="contour-main" d="M-35 360 C40 332, 118 382, 182 360 C246 338, 304 348, 396 382" />
          <path className="contour-sub" d="M-22 404 C54 372, 136 426, 208 402 C274 380, 334 389, 404 418" />
          <path className="contour-main" d="M-28 520 C44 488, 120 546, 190 520 C258 495, 320 500, 404 544" />
          <path className="contour-sub" d="M-20 558 C60 524, 148 582, 224 554 C290 530, 344 536, 406 570" />
          <path className="contour-main" d="M-40 672 C35 642, 114 700, 184 674 C252 648, 314 656, 402 694" />
          <path className="contour-sub" d="M-30 712 C48 678, 134 740, 210 712 C282 686, 338 694, 408 730" />
          <path className="contour-sub" d="M24 40 L86 96 L148 84 L210 138 L272 120 L348 170" />
          <path className="contour-sub" d="M40 304 L96 336 L142 326 L192 354 L254 338 L320 372" />
          <path className="contour-sub" d="M66 606 L120 630 L176 622 L228 650 L290 638 L342 668" />

          {/* Coordinate B-12 with shockwaves */}
          <g>
            <circle className="shockwave" cx="286" cy="292" r="10" />
            <circle className="shockwave shockwave-delayed" cx="286" cy="292" r="10" />
            <circle className="coord-dot" cx="286" cy="292" r="2.2" />
            <line className="coord-mark" x1="270" y1="292" x2="278" y2="292" />
            <line className="coord-mark" x1="294" y1="292" x2="302" y2="292" />
            <line className="coord-mark" x1="286" y1="276" x2="286" y2="284" />
            <line className="coord-mark" x1="286" y1="300" x2="286" y2="308" />
            <text className="coord-label" x="306" y="287">B-12</text>
          </g>

          {/* Coordinate QX-77 */}
          <g>
            <circle className="coord-dot" cx="112" cy="226" r="1.8" />
            <path className="coord-mark" d="M92 226 L104 226 M120 226 L132 226 M112 206 L112 218 M112 234 L112 246" />
            <text className="coord-label" x="136" y="223">QX-77</text>
          </g>

          {/* Coordinate SE-04 */}
          <g>
            <circle className="coord-dot" cx="236" cy="468" r="1.9" />
            <path className="coord-mark" d="M220 458 L232 466 L240 452 M240 484 L250 490 L258 478" />
            <text className="coord-label" x="261" y="474">SE-04</text>
          </g>

          {/* Coordinate RK-19 */}
          <g>
            <circle className="coord-dot" cx="72" cy="566" r="1.9" />
            <path className="coord-mark" d="M54 558 L66 566 L74 552 M74 580 L86 588 L95 574" />
            <text className="coord-label" x="98" y="573">RK-19</text>
          </g>

          {/* Coordinate N2 */}
          <g>
            <circle className="coord-dot" cx="308" cy="640" r="1.9" />
            <path className="coord-mark" d="M292 640 L302 640 M314 640 L324 640 M308 624 L308 634 M308 646 L308 656" />
            <text className="coord-label" x="328" y="637">N2</text>
          </g>

          {/* Impact IMP-31 */}
          <g>
            <circle className="shockwave shockwave-fast" cx="134" cy="352" r="8" />
            <circle className="shockwave shockwave-fast shockwave-late" cx="134" cy="352" r="8" />
            <circle className="blast-ring-static" cx="134" cy="352" r="23" />
            <path className="impact-spoke" d="M110 352 L121 352 M147 352 L158 352 M134 328 L134 339 M134 365 L134 376" />
            <path className="impact-spoke" d="M118 336 L126 344 M142 360 L150 368 M118 368 L126 360 M142 344 L150 336" />
            <circle className="coord-dot" cx="134" cy="352" r="1.9" />
            <text className="coord-label" x="162" y="347">IMP-31</text>
          </g>

          {/* Impact CR-08 */}
          <g>
            <circle className="shockwave shockwave-slow" cx="248" cy="196" r="9" />
            <circle className="shockwave shockwave-delayed shockwave-slow" cx="248" cy="196" r="9" />
            <circle className="blast-ring-static" cx="248" cy="196" r="20" />
            <path className="impact-spoke" d="M228 186 L239 192 L246 180 M268 206 L258 201 L252 212" />
            <path className="impact-spoke" d="M232 210 L242 204 L250 216 M262 176 L254 183 L268 184" />
            <circle className="coord-dot" cx="248" cy="196" r="2" />
            <text className="coord-label" x="272" y="190">CR-08</text>
          </g>

          {/* Impact VX-2 */}
          <g>
            <circle className="shockwave" cx="322" cy="470" r="7" />
            <circle className="shockwave shockwave-delayed" cx="322" cy="470" r="7" />
            <circle className="blast-ring-static" cx="322" cy="470" r="17" />
            <path className="impact-spoke" d="M304 470 L314 470 M330 470 L340 470 M322 452 L322 462 M322 478 L322 488" />
            <circle className="coord-dot" cx="322" cy="470" r="1.7" />
            <text className="coord-label" x="344" y="466">VX-2</text>
          </g>

          {/* Impact BL-4 (static rings only) */}
          <g>
            <circle className="blast-ring-static" cx="74" cy="462" r="15" />
            <circle className="blast-ring-static" cx="74" cy="462" r="25" />
            <path className="impact-spoke" d="M52 450 L62 456 L70 446 M92 474 L82 468 L78 478 M52 474 L62 468 L68 478 M88 448 L80 454 L92 456" />
            <circle className="coord-dot" cx="74" cy="462" r="1.6" />
            <text className="coord-label" x="96" y="458">BL-4</text>
          </g>

          {/* Impact NERV-Δ */}
          <g>
            <circle className="shockwave shockwave-fast" cx="190" cy="620" r="8" />
            <circle className="shockwave shockwave-fast shockwave-delayed" cx="190" cy="620" r="8" />
            <circle className="blast-ring-static" cx="190" cy="620" r="19" />
            <path className="impact-spoke" d="M170 620 L180 620 M198 620 L208 620 M190 600 L190 610 M190 628 L190 638" />
            <path className="impact-spoke" d="M176 606 L182 612 M198 628 L204 634 M176 634 L182 628 M198 612 L204 606" />
            <circle className="coord-dot" cx="190" cy="620" r="1.9" />
            <text className="coord-label" x="212" y="616">NERV-Δ</text>
          </g>
        </svg>

        {/* Vertical center line */}
        <div className="eva-center-line" />

        {/* Japanese map text labels */}
        <div className="eva-map-text eva-map-text-social">
          ソシアル・ウェルフェア・ホール<br />
          X : 459.22
        </div>
        <div className="eva-map-text eva-map-text-yokohama">
          ヨコハマ・リージョン<br />
          アドミニストレーション・コーナー
        </div>

        {/* ── Main content ── */}
        <div className="relative z-10 w-full h-full p-4 flex flex-col pt-24 pb-28 overflow-hidden"
          style={{ transform: "translateY(10%)" }}
        >

          {/* Top status bar */}
          <div className="absolute top-8 left-4 right-4 z-20 flex justify-between items-start text-[10px] tracking-wider pointer-events-none">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#39ff14] block eva-animate-pulse-fast" />
                <span className="eva-crt-glow">システム・オン</span>
              </div>
              <span className="text-[#1d7a0a]">エル・シー・エル: ノミナル</span>
              <span className="text-[#1d7a0a]">エイ・ティー・フィールド: ステイブル</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-[#ff3333] eva-crt-glow-red">パワー: インターナル</span>
              <span className="text-[#ff6600]">タイム・リメイニング: 04:59</span>
              <span className="text-[#1d7a0a] border border-[#1d7a0a] px-1 mt-1 inline-block w-max ml-auto text-[8px]">
                トップ・シークレット
              </span>
            </div>
          </div>

          {/* Bottom-right tactical text */}
          <div className="absolute bottom-24 right-4 z-20 pointer-events-none">
            <div className="border border-white px-2 py-2 relative bg-transparent w-max">
              <div className="text-right">
                <div className="eva-ops-title eva-ops-main-title">
                  作戦行動<br />予定図
                </div>
              </div>
            </div>
            <div className="eva-ops-subtitle">オペレーティング・スケマティック</div>
          </div>

          {/* Header: spinning logo + user name box */}
          <div className="flex flex-col items-center mb-8 relative">
            <div className="eva-title-logo-wrap">
              <svg
                className="eva-title-logo-svg"
                viewBox="0 0 389 229"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="NERV Logo"
              >
                <path
                  className="eva-map-logo-path"
                  d="M206.863 1.70117C215.029 19.6161 225.034 32.9693 238.691 43.0605C252.343 53.1475 269.61 59.9507 292.259 64.8223H292.26C293.825 65.1587 295.273 65.4773 296.406 65.7324C295.962 65.7924 295.476 65.8567 294.965 65.9199C265.207 69.6043 235.913 82.7876 216.823 97.8057C207.283 105.311 200.249 113.308 197.004 120.85C195.379 124.625 194.696 128.308 195.146 131.764C195.596 135.227 197.181 138.427 200.028 141.234C203.06 144.223 207.505 146.461 213.052 147.974C218.602 149.488 225.288 150.285 232.834 150.371C247.927 150.543 266.517 147.871 286.479 142.341C323.818 131.996 355.394 114.281 384.125 87.5586V87.5576L385.912 85.8945L384.349 88.4961C358.656 131.242 315.52 162.856 262.572 177.778L260.044 178.477C238.035 184.424 232.431 186.272 224.338 190.281C209.621 197.571 199.207 209.193 193.561 224.624L193.295 225.361L192.584 227.37L190.696 224.226C174.517 197.286 148.352 180.952 107.871 172.396C104.247 171.631 99.1208 170.707 94.6357 169.976C92.3929 169.61 90.3068 169.292 88.6465 169.064C87.6416 168.927 86.7777 168.823 86.127 168.762C86.185 168.755 86.2444 168.747 86.3047 168.74C116.31 165.353 147.033 151.685 167.482 136.115C177.703 128.334 185.401 120.045 189.141 112.284C191.013 108.4 191.904 104.622 191.6 101.096C191.294 97.559 189.787 94.3118 186.929 91.499C182.801 87.438 176.166 84.7341 167.842 83.2676C159.506 81.799 149.416 81.5605 138.314 82.4814C116.111 84.3234 89.7988 90.8081 65.249 101.445C42.7591 111.19 22.1384 124.755 2.5918 142.658C2.14047 143.071 1.74115 143.433 1.39648 143.742C1.48127 143.605 1.5711 143.459 1.66797 143.305C2.39033 142.155 3.43812 140.551 4.83594 138.418C24.6515 108.181 57.1454 81.6438 92.9863 66.4424C94.8129 65.6672 97.7167 64.4269 99.4385 63.6865C106.25 60.7575 119.364 56.4684 136.278 51.6445C159.943 44.8958 166.542 42.4174 176.641 36.4336C190.232 28.3813 201.72 15.1532 206.411 2.10938L206.692 1.3252L206.863 1.70117Z"
                />
              </svg>
            </div>

            <div className="eva-tactical-box px-6 py-2 mb-2 text-center">
              <div className="text-[9px] text-[#ff6600] mb-1">
                ウーヴル_{id.padStart(5, "0")} // OUVRE_{id.padStart(5, "0")}
              </div>
              <h1 className="text-2xl font-bold text-[#ff3333] tracking-widest eva-crt-glow-red m-0">
                {header || id}
              </h1>
            </div>
          </div>

          {/* Hex nav links */}
          <div className="flex-1 w-full pl-2 pr-8 mt-2">
            <nav className="relative w-full h-[420px] mt-2">
              {rows.length === 0 ? (
                <p className="text-[10px] text-[#1d7a0a] pl-2">// NO LINKS DEPLOYED</p>
              ) : (
                rows.map((link, i) => {
                  const href = getSocialHref(link.type, link.value);
                  const isExternal = href.startsWith("http");
                  return (
                    <a
                      key={`${link.type}-${i}`}
                      href={href}
                      className={`eva-hex-shape eva-hex-link eva-hex-nav-link ${HEX_POSITIONS[i]}`}
                      aria-label={link.value}
                      {...(isExternal && {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      })}
                    >
                      <div className="eva-hex-arrow-top" />
                      <span className="eva-hex-label eva-hex-link-label">
                        {link.type.toUpperCase()}
                      </span>
                      <div className="eva-hex-arrow-bottom" />
                    </a>
                  );
                })
              )}
            </nav>
          </div>

          {/* Hazard stripe bar */}
          <div className="w-full h-1 mt-4 opacity-50" style={{ backgroundColor: "var(--eva-orange)" }}>
            <div className="eva-hazard-stripe" />
          </div>
        </div>

        {/* Edit button */}
        {onRequestEdit ? (
          <button
            type="button"
            onClick={onRequestEdit}
            className="absolute bottom-4 right-4 z-[70] text-xs text-[#39ff14] eva-crt-glow active:scale-95 transition-transform"
          >
            edit
          </button>
        ) : null}
      </div>
    </div>
  );
}

import type { SocialLink } from "@/app/link/types";
import { BWSkin, BratSkin, WindowsXPSkin } from "@/skins/index";

const MOCK_ID = "00001";

const MOCK_LINKS: SocialLink[] = [
  { type: "header", value: "Demo profile" },
  { type: "instagram", value: "@demo" },
  { type: "website", value: "example.com" },
  { type: "phone", value: "+1 555 0100" },
];

export default function TestSkinPage() {
  return (
    <div className="flex flex-col">
      <section className="min-h-dvh border-b border-neutral-300">
        <p className="px-4 py-2 text-xs font-sans text-neutral-600 bg-neutral-100">
          Skin: windowsxp (expect Pixelify + bg.webp + icons)
        </p>
        <WindowsXPSkin id={MOCK_ID} links={MOCK_LINKS} />
      </section>
      <section className="min-h-dvh">
        <p className="px-4 py-2 text-xs font-sans text-neutral-600 bg-neutral-100">
          Skin: bw-test (expect system sans, white bg, text only — no pixel font or
          background image)
        </p>
        <BWSkin id={MOCK_ID} links={MOCK_LINKS} />
      </section>
      <section className="min-h-dvh">
        <p className="px-4 py-2 text-xs font-sans text-neutral-600 bg-neutral-100">
          Skin: brat (expect #8AD000 bg + centered window + eyebrow)
        </p>
        <BratSkin id={MOCK_ID} links={MOCK_LINKS} />
      </section>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "./actions";
import { buildSocialHrefOrNull } from "../link/social-url";
import { SOCIAL_TYPES, type SocialLink, type SkinId, type UserRecord } from "../link/types";
import { usePendingTimeout } from "@/hooks/usePendingTimeout";
import { BackroomPanelSection, BackroomPageTitle, BackroomSubmitButton } from "@/skins/backroom";

type Props = {
  handle: string;
  user: UserRecord;
  onSaved: (updated: UserRecord) => void;
  onCancel: () => void;
};

const SKIN_OPTIONS: { id: SkinId; label: string }[] = [
  { id: "windowsxp", label: "Windows XP" },
  { id: "brat", label: "Brat" },
  { id: "eva", label: "EVA" },
  { id: "duck", label: "Duck" },
  { id: "bw-test", label: "B&W" },
];

const getTypeLabel = (type: string) => {
  switch (type) {
    case "arena": return "are.na";
    default: return type;
  }
};

const normalizeValue = (type: string, value: string) => {
  const v = value.trim();
  switch (type.toLowerCase().trim()) {
    case "instagram":
    case "snapchat":
    case "soundcloud":
    case "arena":
    case "onlyfans":
      return v.replace(/^@/, "");
    default:
      return v;
  }
};

export function EditPanel({ handle, user, onSaved, onCancel }: Props) {
  const cardId = user.id;
  const [spaceName, setSpaceName] = useState(user.spaceName);
  const [theme, setTheme] = useState<SkinId>(user.theme);
  const [links, setLinks] = useState<SocialLink[]>(user.socialLinks);
  const [error, setError] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);
  const [isSaving, startSave] = useTransition();
  const isTimedOut = usePendingTimeout(isSaving, 10000);

  const handleSave = () => {
    setError(null);
    const trimmedLinks = links.map((l) => ({ ...l, value: l.value.trim() }));

    const typeCounts: Record<string, number> = {};
    for (const l of trimmedLinks) {
      typeCounts[l.type] = (typeCounts[l.type] ?? 0) + 1;
    }
    if (Object.values(typeCounts).some((c) => c > 1)) {
      setError("Each social type can only be used once.");
      return;
    }

    for (const l of trimmedLinks) {
      if (buildSocialHrefOrNull(l.type, l.value) == null) {
        setError(`${getTypeLabel(l.type)} link value is invalid.`);
        return;
      }
    }

    const normalizedLinks = trimmedLinks.map((l) => ({
      ...l,
      value: normalizeValue(l.type, l.value),
    }));

    startSave(async () => {
      const result = await updateProfile(handle, {
        spaceName,
        socialLinks: normalizedLinks,
        theme,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 800);
      onSaved({ ...user, spaceName, socialLinks: normalizedLinks, theme });
    });
  };

  const isReady = spaceName.trim() !== "" && !(isSaving && !isTimedOut);

  return (
    <BackroomPanelSection>

      {/* Scrollable content on top of background */}
      <div className="relative z-10 flex flex-col flex-1 overflow-y-auto">

        {/* Header — pinned to top */}
        <div className="flex items-center justify-between px-6 pt-6">
          <p className="text-[10px] tracking-[0.1em] text-white/50">
            ouvre #{cardId}
          </p>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-white/60 active:scale-95 transition-transform"
          >
            close
          </button>
        </div>

        {/* Vertically centered main content */}
        <div className="flex flex-col flex-1 justify-center gap-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">

        <BackroomPageTitle>edit</BackroomPageTitle>

        {/* Fields at 80% width */}
        <div className="w-[80%] mx-auto flex flex-col gap-3">
          {/* Space name */}
          <div className="w-full rounded-[2px] bg-black/50 backdrop-blur-sm border border-white/15 px-5 py-3 flex flex-col gap-1">
            <span className="text-[10px] text-white/50">header</span>
            <input
              type="text"
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
              placeholder="Your name or title"
              className="bg-transparent border-none outline-none text-base text-white placeholder:text-white/30"
            />
          </div>

          {/* Theme */}
          <div className="w-full rounded-[2px] bg-black/50 backdrop-blur-sm border border-white/15 px-5 py-3 flex items-center gap-3">
            <span className="text-[10px] text-white/50 shrink-0">skin</span>
            <div className="br-select-wrap flex-1">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as SkinId)}
                className="br-select w-full text-sm text-white"
              >
                {SKIN_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Social links */}
          {links.map((link, i) => (
            <div
              key={`${link.type}-${i}`}
              className="w-full rounded-[2px] bg-black/50 backdrop-blur-sm border border-white/15 px-5 py-3 flex items-center gap-3"
            >
              <div className="br-select-wrap shrink-0">
                <select
                  value={link.type}
                  onChange={(e) => {
                    const nextType = e.target.value;
                    setLinks((prev) =>
                      prev.map((l, idx) => (idx === i ? { ...l, type: nextType } : l))
                    );
                  }}
                  className="br-select text-xs text-white/50"
                >
                  {SOCIAL_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {getTypeLabel(t)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-px h-3 bg-white/20 shrink-0" />
              <input
                type="text"
                value={link.value}
                onChange={(e) => {
                  const value = e.target.value;
                  setLinks((prev) =>
                    prev.map((l, idx) => (idx === i ? { ...l, value } : l))
                  );
                }}
                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/40"
              />
              <button
                type="button"
                onClick={() => setLinks((prev) => prev.filter((_, idx) => idx !== i))}
                className="shrink-0 text-xs text-white/40 active:scale-90 transition-transform"
                aria-label={`Remove ${link.type}`}
              >
                ×
              </button>
            </div>
          ))}

          {/* Add link — hidden once 6 links reached */}
          {links.length < 6 && (
            <button
              type="button"
              onClick={() => {
                const usedTypes = new Set(links.map((l) => l.type));
                const available = SOCIAL_TYPES.find((t) => !usedTypes.has(t));
                if (!available) {
                  setError("All social types are already used.");
                  return;
                }
                setLinks((prev) => [...prev, { type: available, value: "" }]);
              }}
              className="w-full rounded-[2px] bg-black/40 backdrop-blur-sm border border-white/15 px-5 py-2.5 flex items-center justify-center active:scale-95 transition-transform"
            >
              <span className="br-icon">+ add social</span>
            </button>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 text-center px-6" role="alert">
            {error}
          </p>
        )}
        {isTimedOut && (
          <p className="text-xs text-red-600 text-center px-6">
            Save is taking too long. You can retry now.
          </p>
        )}

        {/* Save button */}
        <BackroomSubmitButton
          isReady={isReady}
          type="button"
          onClick={handleSave}
        >
          {isSaving && !isTimedOut ? "saving…" : saveToast ? "saved" : "save"}
        </BackroomSubmitButton>

        </div>{/* end centered content */}
      </div>
    </BackroomPanelSection>
  );
}

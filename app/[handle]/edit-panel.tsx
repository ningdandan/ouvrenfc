"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "./actions";
import { buildSocialHrefOrNull } from "../link/social-url";
import { SOCIAL_TYPES, type SocialLink, type SkinId, type UserRecord, type ActionErrorCode } from "../link/types";
import { getErrorMessage, isRetryableError } from "../link/error-map";
import { usePendingTimeout } from "@/hooks/usePendingTimeout";
import { BackroomPanelSection, BackroomPageTitle, BackroomSubmitButton } from "@/skins/backroom";

type Props = {
  handle: string;
  user: UserRecord;
  onSaved: (updated: UserRecord) => void;
  onCancel: () => void;
};

const SKIN_OPTIONS: { id: SkinId; label: string; image: string }[] = [
  { id: "windowsxp", label: "Windows XP", image: "/skinpicker/winxp.webp" },
  { id: "brat",      label: "Brat",       image: "/skinpicker/brat.webp" },
  { id: "eva",       label: "EVA",        image: "/skinpicker/eva.webp" },
  { id: "duck",      label: "Duck",       image: "/skinpicker/duffy.webp" },
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
  const [links, setLinks] = useState<SocialLink[]>(
    user.socialLinks.length > 0
      ? user.socialLinks
      : [
          { type: "instagram", value: "" },
          { type: "website", value: "" },
        ]
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverErrorCode, setServerErrorCode] = useState<ActionErrorCode | undefined>();
  const [saveToast, setSaveToast] = useState(false);
  const [isSaving, startSave] = useTransition();
  const isTimedOut = usePendingTimeout(isSaving, 10000);

  // field ids: "spaceName" | "link-{i}"
  const [errorFields, setErrorFields] = useState<Set<string>>(new Set());
  const [shakeKeys, setShakeKeys] = useState<Record<string, number>>({});

  const markErrors = (fields: string[]) => {
    setErrorFields(new Set(fields));
    setShakeKeys((prev) => {
      const next = { ...prev };
      for (const f of fields) next[f] = (next[f] ?? 0) + 1;
      return next;
    });
  };

  const clearError = (field: string) => {
    setErrorFields((prev) => {
      if (!prev.has(field)) return prev;
      const next = new Set(prev);
      next.delete(field);
      return next;
    });
  };

  const handleSave = () => {
    setServerError(null);
    setServerErrorCode(undefined);
    const trimmedLinks = links.map((l) => ({ ...l, value: l.value.trim() }));
    const badFields: string[] = [];

    if (!spaceName.trim()) badFields.push("spaceName");

    const typeSeen: Record<string, number[]> = {};
    for (let i = 0; i < trimmedLinks.length; i++) {
      const t = trimmedLinks[i].type;
      if (!typeSeen[t]) typeSeen[t] = [];
      typeSeen[t].push(i);
    }
    for (const indices of Object.values(typeSeen)) {
      if (indices.length > 1) {
        for (const i of indices) {
          if (!badFields.includes(`link-${i}`)) badFields.push(`link-${i}`);
        }
      }
    }

    for (let i = 0; i < trimmedLinks.length; i++) {
      if (badFields.includes(`link-${i}`)) continue;
      if (buildSocialHrefOrNull(trimmedLinks[i].type, trimmedLinks[i].value) == null) {
        badFields.push(`link-${i}`);
      }
    }

    if (badFields.length > 0) {
      markErrors(badFields);
      return;
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
        setServerError(getErrorMessage(result.code, result.error));
        setServerErrorCode(result.code);
        return;
      }

      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 800);
      onSaved({ ...user, spaceName, socialLinks: normalizedLinks, theme });
    });
  };

  const isReady = !(isSaving && !isTimedOut);

  return (
    <BackroomPanelSection>
      <div
        className="fixed inset-0 z-50 bg-black pointer-events-none"
        style={{ animation: "fadeOut 0.6s ease-out 0.05s forwards" }}
      />

      {/* Scrollable content on top of background */}
      <div className="relative z-10 flex flex-col flex-1 overflow-y-auto">

        {/* Header — pinned to top */}
        <div className="flex items-center justify-between px-6 pt-6">
          <p className="text-[10px] tracking-[0.1em] text-white/50">
            <a
              href="https://ouvre.nyc"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >ouvre</a>{" "}#{cardId}
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
          <div
            key={`spaceName-${shakeKeys.spaceName ?? 0}`}
            className={`w-full rounded-[2px] bg-black/50 backdrop-blur-sm border px-5 py-3 flex flex-col gap-1 ${errorFields.has("spaceName") ? "br-field-error br-shake" : "border-white/15"}`}
          >
            <span className="text-[10px] text-white/50">header</span>
            <input
              type="text"
              value={spaceName}
              onChange={(e) => { setSpaceName(e.target.value); clearError("spaceName"); }}
              placeholder="Your name or title"
              className="bg-transparent border-none outline-none text-base text-white placeholder:text-white/30"
            />
          </div>

          {/* Theme */}
          <div className="w-full rounded-[2px] bg-black/50 backdrop-blur-sm border border-white/15 px-5 py-3 flex flex-col gap-3">
            <span className="text-[10px] text-white/50">skin</span>
            <div className="w-full grid grid-cols-5 gap-3">
              {SKIN_OPTIONS.map((s) => {
                const selected = theme === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setTheme(s.id)}
                    className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
                  >
                    <div
                      className={`relative w-full aspect-square rounded-full overflow-hidden border-2 transition-all duration-150 ${
                        selected ? "border-white" : "border-white/15"
                      }`}
                    >
                      <img
                        src={s.image}
                        alt={s.label}
                        className="w-full h-full object-cover"
                      />
                      {!selected && (
                        <div className="absolute inset-0 bg-black/60" />
                      )}
                    </div>
                    <span
                      className={`text-[9px] leading-tight text-center transition-colors duration-150 ${
                        selected ? "text-white" : "text-white/40"
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Social links */}
          {links.map((link, i) => (
            <div
              key={`link-${i}-${shakeKeys[`link-${i}`] ?? 0}`}
              className={`w-full rounded-[2px] bg-black/50 backdrop-blur-sm border px-5 py-3 flex items-center gap-3 ${errorFields.has(`link-${i}`) ? "br-field-error br-shake" : "border-white/15"}`}
            >
              <div className="br-select-wrap shrink-0">
                <select
                  value={link.type}
                  onChange={(e) => {
                    const nextType = e.target.value;
                    setLinks((prev) =>
                      prev.map((l, idx) => (idx === i ? { ...l, type: nextType } : l))
                    );
                    clearError(`link-${i}`);
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
                  clearError(`link-${i}`);
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
                if (!available) return;
                setLinks((prev) => [...prev, { type: available, value: "" }]);
              }}
              className="w-full rounded-[2px] bg-black/40 backdrop-blur-sm border border-white/15 px-5 py-2.5 flex items-center justify-center active:scale-95 transition-transform"
            >
              <span className="br-icon">+ add social</span>
            </button>
          )}
        </div>

        {serverError && (
          <div className="flex flex-col items-center gap-1 px-6">
            <p className="text-xs text-white/40 text-center" role="alert">
              {serverError}
            </p>
            {isRetryableError(serverErrorCode) && (
              <button
                type="button"
                onClick={handleSave}
                className="text-xs text-white/40 underline underline-offset-2 active:scale-95 transition-transform"
              >
                try again
              </button>
            )}
          </div>
        )}
        {isTimedOut && !serverError && (
          <div className="flex flex-col items-center gap-1 px-6">
            <p className="text-xs text-white/40 text-center">
              save is taking too long
            </p>
            <button
              type="button"
              onClick={handleSave}
              className="text-xs text-white/40 underline underline-offset-2 active:scale-95 transition-transform"
            >
              try again
            </button>
          </div>
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

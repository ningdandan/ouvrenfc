"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSocialLinks } from "../actions";
import { buildSocialHrefOrNull } from "../social-url";
import { SOCIAL_TYPES, type SocialLink } from "../types";
import { getErrorMessage, isRetryableError } from "../error-map";
import { usePendingTimeout } from "@/hooks/usePendingTimeout";

type Props = {
  id: string;
  pin: string;
  initialLinks: SocialLink[];
  onSaved?: () => void;
  firstInitMode?: boolean;
};

export function AdminPanel({
  id,
  pin,
  initialLinks,
  onSaved,
  firstInitMode = false,
}: Props) {
  const router = useRouter();
  const headerLink = initialLinks.find((l) => l.type === "header");
  const initialSocialLinks = initialLinks.filter((l) => l.type !== "header");
  const defaultFirstInitLinks: SocialLink[] = [
    { type: "instagram", value: "" },
    { type: "phone", value: "" },
    { type: "website", value: "" },
  ];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "arena":
        return "are.na";
      case "phone":
        return "phonebumber";
      default:
        return type;
    }
  };

  const normalizeValueForStorage = (type: string, value: string) => {
    const v = value.trim();
    switch (type.toLowerCase().trim()) {
      // Handle-based platforms: remove leading '@' before saving
      case "instagram":
      case "snapchat":
      case "soundcloud":
      case "arena":
      case "onlyfans": {
        return v.replace(/^@/, "");
      }
      default:
        return v;
    }
  };

  const getHrefOrNullForLink = (link: SocialLink) => {
    return buildSocialHrefOrNull(link.type, link.value);
  };

  const [header, setHeader] = useState<string>(headerLink?.value ?? "");
  const [links, setLinks] = useState<SocialLink[]>(
    firstInitMode && initialSocialLinks.length === 0
      ? defaultFirstInitLinks
      : initialSocialLinks,
  );
  const [saveToast, setSaveToast] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSave] = useTransition();
  const isTimedOut = usePendingTimeout(isSaving, 10000);

  const handleRemove = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const headerValue = header.trim();
    const trimmedSocial = links.map((l) => ({
      ...l,
      value: l.value.trim(),
    }));

    // 校验：类型不重复（header 允许为空）
    const typeCounts: Record<string, number> = {};
    for (const l of trimmedSocial) {
      typeCounts[l.type] = (typeCounts[l.type] ?? 0) + 1;
    }
    const hasDuplicateType = Object.values(typeCounts).some((c) => c > 1);
    if (hasDuplicateType) {
      setError("Each social type can only be used once.");
      return;
    }

    // 校验：每个 type 都必须能构建出可靠公开链接（否则报错，不猜测）
    for (const l of trimmedSocial) {
      const hrefOrNull = getHrefOrNullForLink(l);
      if (hrefOrNull == null) {
        setError(`${getTypeLabel(l.type)} link value is invalid.`);
        return;
      }
    }

    // 保存：按规则做最小归一化（例如 handle-based 去掉前导 '@'）
    const payload: SocialLink[] = [
      ...(headerValue ? [{ type: "header", value: headerValue }] : []),
      ...trimmedSocial.map((l) => ({
        ...l,
        value: normalizeValueForStorage(l.type, l.value),
      })),
    ];

    setError(null);
    startSave(async () => {
      const result = await updateSocialLinks(id, pin, payload);
      if (!result.success) {
        const message = getErrorMessage(result.code, result.error);
        const nextError = isRetryableError(result.code)
          ? `${message} Please retry.`
          : message;
        setError(nextError);
        return;
      }

      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 800);
      router.refresh();
      if (onSaved) onSaved();
    });
  };

  return (
    <section className="flex-1 flex flex-col px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 gap-6">
      {/* 顶部 edit 文案 */}
      <p className="text-center text-sm text-white/90">
        edit
      </p>

      {/* 链接列表 */}
      <div className="flex flex-col gap-3">
        {/* 列表中的 header 行（存到 type === 'header'） */}
        <div className="w-full rounded-full bg-white/5 border border-white/10 px-5 py-3 flex flex-col gap-1">
          <span className="text-[10px] text-white/60">header</span>
          <input
            type="text"
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            placeholder="Lila's place"
            className="bg-transparent border-none outline-none text-base text-white placeholder:text-white/50"
          />
        </div>

        {links.map((link, i) => {
          return (
            <div
              key={`${link.type}-${i}`}
              className="w-full rounded-full bg-white/5 border border-white/10 px-5 py-3 flex items-center gap-3"
            >
              <select
                value={link.type}
                onChange={(e) => {
                  const nextType = e.target.value;
                  setLinks((prev) =>
                    prev.map((l, idx) =>
                      idx === i ? { ...l, type: nextType } : l,
                    ),
                  );
                }}
                className="h-8 rounded-full bg-white/5 border border-white/10 px-3 text-[10px] text-white/80"
              >
                {SOCIAL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {getTypeLabel(t)}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={link.value}
                onChange={(e) => {
                  const value = e.target.value;
                  setLinks((prev) =>
                    prev.map((l, idx) =>
                      idx === i ? { ...l, value } : l,
                    ),
                  );
                }}
                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/50"
              />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="px-2 text-xs text-white/50 active:scale-90 transition-transform"
                aria-label={`Remove ${link.type}`}
              >
                ×
              </button>
            </div>
          );
        })}

        {/* Add 行 */}
        <button
          type="button"
          onClick={() => {
            // 只允许还没使用过的类型添加
            const usedTypes = new Set(links.map((l) => l.type));
            const available = SOCIAL_TYPES.find((t) => !usedTypes.has(t));
            if (!available) {
              setError("All social types are already used.");
              return;
            }
            setLinks((prev) => [...prev, { type: available, value: "" }]);
          }}
          className="w-full rounded-full bg-white/5 border border-white/10 px-5 py-3 flex items-center justify-center font-mono text-lg text-white active:scale-95 transition-transform"
        >
          +
        </button>
      </div>

      {error && (
        <p className="text-sm text-[#ff4d4d] text-center" role="alert">
          {error}
        </p>
      )}
      {isTimedOut && (
        <p className="text-xs text-[#ff4d4d] text-center">
          Save is taking too long. You can retry now.
        </p>
      )}

      {/* Save 按钮 */}
      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving && !isTimedOut}
        className="mt-auto w-full min-h-[56px] flex items-center justify-center text-lg text-white tracking-widest active:scale-95 transition-transform disabled:opacity-60"
      >
        {isSaving && !isTimedOut ? "Saving…" : saveToast ? "Saved" : "Save"}
      </button>
    </section>
  );
}

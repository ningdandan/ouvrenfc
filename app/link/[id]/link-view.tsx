"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SkinRenderer } from "@/skins/index";
import { BackroomShell } from "@/skins/backroom";
import { OwnerAccess } from "./owner-access";
import type { SkinId, SocialLink } from "../types";

function skinFromSearchParam(raw: string | null): SkinId {
  switch (raw) {
    case "bw-test":
      return "bw-test";
    case "brat":
      return "brat";
    case "eva":
      return "eva";
    default:
      return "windowsxp";
  }
}

type Props = {
  id: string;
  links: SocialLink[];
  firstInit?: boolean;
};

type Mode = "public" | "owner";

export function LinkView({ id, links, firstInit = false }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("public");
  const [firstInitPin, setFirstInitPin] = useState<string | null>(null);

  useEffect(() => {
    if (!firstInit || typeof window === "undefined") return;
    const key = `first-init-pin:${id}`;
    const savedPin = window.sessionStorage.getItem(key);
    window.sessionStorage.removeItem(key);
    if (savedPin && /^\d{3}$/.test(savedPin)) {
      setFirstInitPin(savedPin);
      setMode("owner");
    }
  }, [firstInit, id]);

  if (mode === "owner") {
    // 覆盖整个视窗：只显示拨号/管理界面
    return (
      <BackroomShell>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-4 pt-4">
            <span className="text-xs text-white/90">
              ouvre {id}
            </span>
            <button
              type="button"
              onClick={() => setMode("public")}
              className="text-xs text-white/80 active:scale-95 transition-transform"
            >
              close
            </button>
          </div>
          <OwnerAccess
            id={id}
            initialLinks={links}
            initialVerifiedPin={firstInitPin ?? undefined}
            firstInitMode={firstInit || Boolean(firstInitPin)}
            onDone={() => {
              if (firstInit) {
                setFirstInitPin(null);
                setMode("public");
                router.replace(`/link/${id}`);
                return;
              }
              setMode("public");
            }}
          />
        </div>
      </BackroomShell>
    );
  }

  const skinId = skinFromSearchParam(searchParams.get("skin"));

  return (
    <SkinRenderer
      skinId={skinId}
      id={id}
      links={links}
      onRequestEdit={() => setMode("owner")}
    />
  );
}


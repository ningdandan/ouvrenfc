"use client";

import type { ComponentType } from "react";
import type { SkinId, SkinProps } from "@/app/link/types";
import { BWSkin } from "./BWSkin";
import { BratSkin } from "./brat";
import { DuckSkin } from "./duck";
import { EvaSkin } from "./eva";
import { WindowsXPSkin } from "./windowsxp";

function WindowsXPSkinAdapter(props: SkinProps) {
  return <WindowsXPSkin {...props} />;
}

export const SKINS: Record<SkinId, ComponentType<SkinProps>> = {
  windowsxp: WindowsXPSkinAdapter,
  "bw-test": BWSkin,
  brat: BratSkin,
  eva: EvaSkin,
  duck: DuckSkin,
};

export type SkinRendererProps = SkinProps & { skinId: SkinId };

export function SkinRenderer({
  skinId,
  links,
  id,
  onRequestEdit,
}: SkinRendererProps) {
  if (skinId === "windowsxp") {
    return (
      <WindowsXPSkin id={id} links={links} onRequestEdit={onRequestEdit} />
    );
  }
  const Skin = SKINS[skinId];
  return <Skin id={id} links={links} onRequestEdit={onRequestEdit} />;
}

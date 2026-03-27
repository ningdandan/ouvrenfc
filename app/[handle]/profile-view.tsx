"use client";

import { SkinRenderer } from "@/skins/index";
import type { UserRecord } from "../link/types";

type Props = {
  handle: string;
  user: UserRecord;
  onRequestEdit: () => void;
};

export function ProfileView({ handle, user, onRequestEdit }: Props) {
  return (
    <SkinRenderer
      skinId={user.theme}
      id={user.id}
      handle={handle}
      links={[
        ...(user.spaceName ? [{ type: "header", value: user.spaceName }] : []),
        ...user.socialLinks,
      ]}
      onRequestEdit={onRequestEdit}
    />
  );
}

"use client";

import { useState } from "react";
import type { UserRecord } from "../link/types";
import { ProfileView } from "./profile-view";
import { EditPanel } from "./edit-panel";
import { LoginWithKey } from "./login-with-key";

type Mode = "public" | "edit" | "login";

type Props = {
  handle: string;
  user: UserRecord;
  isOwner: boolean;
  openEdit?: boolean;
};

export function ProfileShell({ handle, user, isOwner, openEdit = false }: Props) {
  const [mode, setMode] = useState<Mode>(() => {
    if (openEdit && isOwner) return "edit";
    return "public";
  });
  const [currentUser, setCurrentUser] = useState<UserRecord>(user);

  const handleEditClick = () => {
    if (isOwner) {
      setMode("edit");
    } else {
      setMode("login");
    }
  };

  if (mode === "login") {
    return (
      <LoginWithKey
        handle={handle}
        onSuccess={() => {
          // After re-login the cookie is set; reload to get isOwner=true from server
          window.location.reload();
        }}
        onCancel={() => setMode("public")}
      />
    );
  }

  if (mode === "edit") {
    return (
      <EditPanel
        handle={handle}
        user={currentUser}
        onSaved={(updated) => {
          setCurrentUser(updated);
          setMode("public");
        }}
        onCancel={() => setMode("public")}
      />
    );
  }

  return (
    <ProfileView
      handle={handle}
      user={currentUser}
      onRequestEdit={handleEditClick}
    />
  );
}

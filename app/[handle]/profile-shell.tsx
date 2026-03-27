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
  fromBoot?: boolean;
};

export function ProfileShell({ handle, user, isOwner, openEdit = false, fromBoot = false }: Props) {
  const [canEdit, setCanEdit] = useState(isOwner);
  const [mode, setMode] = useState<Mode>(() => {
    if (openEdit && isOwner) return "edit";
    return "public";
  });
  const [currentUser, setCurrentUser] = useState<UserRecord>(user);

  const handleEditClick = () => {
    if (canEdit) {
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
          setCanEdit(true);
          setMode("edit");
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
    <>
      {fromBoot && (
        <div
          className="fixed inset-0 z-50 bg-black pointer-events-none"
          style={{ animation: "fadeOut 0.7s ease-out 0.05s forwards" }}
        />
      )}
      <ProfileView
        handle={handle}
        user={currentUser}
        onRequestEdit={handleEditClick}
      />
    </>
  );
}

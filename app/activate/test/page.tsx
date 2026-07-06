"use client";

import { useMemo, useState } from "react";
import { BootScreen } from "@/skins/boot-screen";
import {
  BackroomShell,
  BackroomPanel,
  BackroomFormContent,
  BackroomPageTitle,
  BackroomField,
  BackroomTextInput,
  BackroomHandleInput,
  BackroomSubmitButton,
} from "@/skins/backroom";
import type { UserRecord } from "../../link/types";
import { ProfileView } from "../../[handle]/profile-view";
import { TestEditPanel } from "./test-edit-panel";

type Step = "welcome" | "form" | "boot" | "profile";
type Mode = "public" | "edit";

const TEST_KEY_REGEX = /^OVR-[A-Z0-9]{4}$/;
const HANDLE_REGEX = /^[a-z0-9_]{1,30}$/;
const TEST_ID = "test";

export default function ActivateTestPage() {
  const [step, setStep] = useState<Step>("welcome");
  const [mode, setMode] = useState<Mode>("public");
  const [profileHandle, setProfileHandle] = useState("test");
  const [profile, setProfile] = useState<UserRecord | null>(null);
  const [fromBoot, setFromBoot] = useState(false);
  const [cardKey, setCardKey] = useState("");
  const [handle, setHandle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const normalizedKey = useMemo(() => cardKey.trim().toUpperCase(), [cardKey]);
  const normalizedHandle = useMemo(() => handle.trim().toLowerCase(), [handle]);
  const canSubmit = normalizedKey !== "" && normalizedHandle !== "";

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();

    if (!TEST_KEY_REGEX.test(normalizedKey)) {
      setError("Invalid card key. Use format OVR-XXXX.");
      return;
    }

    if (!HANDLE_REGEX.test(normalizedHandle)) {
      setError("Handle must be 1–30 lowercase letters, numbers, or underscores.");
      return;
    }

    setError(null);
    setProfileHandle(normalizedHandle);
    setProfile({
      id: TEST_ID,
      spaceName: normalizedHandle,
      socialLinks: [],
      theme: "windowsxp",
    });
    setMode("public");
    setStep("boot");
  }

  if (step === "welcome") {
    return (
      <BackroomShell>
        <BackroomPanel>
          <div data-activate-page="true" className="hidden" />
          <div className="absolute z-10 left-1/2 top-[75%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <span className="techno-beat">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="techno-tremor tracking-[0.05em] text-[var(--tw-ring-offset-color)] active:scale-95"
              >
                unlock wet market
              </button>
            </span>
          </div>
        </BackroomPanel>
      </BackroomShell>
    );
  }

  if (step === "boot") {
    return (
      <>
        <div data-activate-page="true" className="hidden" />
        <BootScreen
          id={TEST_ID}
          onComplete={() => {
            setFromBoot(true);
            setStep("profile");
            window.setTimeout(() => setFromBoot(false), 900);
          }}
        />
      </>
    );
  }

  if (step === "profile" && profile) {
    if (mode === "edit") {
      return (
        <>
          <div data-activate-page="true" className="hidden" />
          <main className="min-h-[100svh] flex flex-col">
            <TestEditPanel
              handle={profileHandle}
              user={profile}
              onSaved={(updated) => {
                setProfile(updated);
                setMode("public");
              }}
              onCancel={() => setMode("public")}
            />
          </main>
        </>
      );
    }

    return (
      <>
        <div data-activate-page="true" className="hidden" />
        {fromBoot && (
          <div
            className="fixed inset-0 z-50 bg-black pointer-events-none"
            style={{ animation: "fadeOut 0.7s ease-out 0.05s forwards" }}
          />
        )}
        <main className="min-h-[100svh] flex flex-col">
          <ProfileView
            handle={profileHandle}
            user={profile}
            onRequestEdit={() => setMode("edit")}
          />
        </main>
      </>
    );
  }

  return (
    <BackroomShell>
      <BackroomPanel>
        <div data-activate-page="true" className="hidden" />
        <BackroomFormContent>
          <div className="w-[80%] flex flex-col gap-6">
            <BackroomPageTitle>wet market#test</BackroomPageTitle>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <BackroomField label="card key">
                <BackroomTextInput
                  type="text"
                  value={cardKey}
                  onChange={(e) => setCardKey(e.target.value.toUpperCase())}
                  placeholder="OVR-XXXX"
                  autoComplete="off"
                  spellCheck={false}
                />
              </BackroomField>

              <BackroomField
                label="choose your handle"
                hint="letters, numbers, underscores — cannot be changed later"
              >
                <BackroomHandleInput
                  type="text"
                  value={handle}
                  onChange={(e) =>
                    setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                  }
                  placeholder="yourname"
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={30}
                />
              </BackroomField>

              {error && (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm text-red-600 text-center" role="alert">
                    {error}
                  </p>
                </div>
              )}

              <BackroomSubmitButton isReady={canSubmit} type="submit">
                unlock
              </BackroomSubmitButton>
            </form>
          </div>
        </BackroomFormContent>
      </BackroomPanel>
    </BackroomShell>
  );
}

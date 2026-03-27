"use client";

import { useState, useTransition } from "react";
import { activateCard } from "../actions";
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

type Step = "welcome" | "form";
type Props = { id: string };

export function ActivateForm({ id }: Props) {
  const [step, setStep] = useState<Step>("welcome");
  const [cardKey, setCardKey] = useState("");
  const [handle, setHandle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await activateCard(id, cardKey, handle);
      if (!result.success) {
        setError(result.error);
      }
    });
  };

  if (step === "welcome") {
    return (
      <BackroomShell>
        <BackroomPanel>
          <div className="absolute z-10 left-1/2 top-[75%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <span className="techno-beat">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="techno-tremor tracking-[0.05em] text-black active:scale-95"
              >
                unlock ouvre
              </button>
            </span>
          </div>
        </BackroomPanel>
      </BackroomShell>
    );
  }

  return (
    <BackroomShell>
      <BackroomPanel>
        <BackroomFormContent>
          <div className="w-[80%] flex flex-col gap-6">
            <BackroomPageTitle>ouvre#{id}</BackroomPageTitle>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <BackroomField label="card key">
                <BackroomTextInput
                  type="text"
                  value={cardKey}
                  onChange={(e) => setCardKey(e.target.value.toUpperCase())}
                  placeholder="ART-XXXX"
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
                <p className="text-sm text-red-600 text-center" role="alert">
                  {error}
                </p>
              )}

              <BackroomSubmitButton
                isReady={cardKey.trim() !== "" && handle.trim() !== "" && !isPending}
                type="submit"
              >
                {isPending ? "activating…" : "unlock"}
              </BackroomSubmitButton>
            </form>
          </div>
        </BackroomFormContent>
      </BackroomPanel>
    </BackroomShell>
  );
}

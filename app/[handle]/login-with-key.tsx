"use client";

import { useState, useTransition } from "react";
import { loginWithKey } from "./actions";
import {
  BackroomPanelSection,
  BackroomFormContent,
  BackroomPageTitle,
  BackroomField,
  BackroomTextInput,
  BackroomSubmitButton,
} from "@/skins/backroom";

type Props = {
  handle: string;
  onSuccess: () => void;
  onCancel: () => void;
};

export function LoginWithKey({ handle, onSuccess, onCancel }: Props) {
  const [cardKey, setCardKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await loginWithKey(handle, cardKey);
      if (result.success) {
        onSuccess();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <BackroomPanelSection>
      <BackroomFormContent>
        <div className="w-[80%] flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] tracking-[0.1em] text-white/50">@{handle}</p>
            <BackroomPageTitle>unlock to edit</BackroomPageTitle>
          </div>

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

            {error && (
              <p className="text-sm text-red-600 text-center" role="alert">
                {error}
              </p>
            )}

            <BackroomSubmitButton
              isReady={cardKey.trim() !== "" && !isPending}
              type="submit"
            >
              {isPending ? "verifying…" : "unlock"}
            </BackroomSubmitButton>
          </form>

          <div className="flex flex-col gap-2 items-center">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-white/40 active:scale-95 transition-transform"
            >
              cancel
            </button>
            <p className="text-[10px] text-white/40">
              lost your key? contact us on instagram
            </p>
          </div>
        </div>
      </BackroomFormContent>
    </BackroomPanelSection>
  );
}

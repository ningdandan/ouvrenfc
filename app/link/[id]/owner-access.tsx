"use client";

import { useState, useTransition } from "react";
import { verifyOwner } from "../actions";
import { AdminPanel } from "./admin-panel";
import type { SocialLink } from "../types";
import { getErrorMessage, isRetryableError } from "../error-map";
import { usePendingTimeout } from "@/hooks/usePendingTimeout";
import { OuvreBackroomBackground } from "@/skins/ouvre-backroom-background";

type Props = {
  id: string;
  initialLinks: SocialLink[];
  onDone?: () => void;
  initialVerifiedPin?: string;
  firstInitMode?: boolean;
};

export function OwnerAccess({
  id,
  initialLinks,
  onDone,
  initialVerifiedPin,
  firstInitMode = false,
}: Props) {
  const [pin, setPin] = useState("");
  const [verifiedPin, setVerifiedPin] = useState<string | null>(
    initialVerifiedPin ?? null,
  );
  const [isAdmin, setIsAdmin] = useState(Boolean(initialVerifiedPin));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isTimedOut = usePendingTimeout(isPending, 10000);

  const handleVerify = () => {
    if (pin.length !== 3 || (isPending && !isTimedOut)) return;
    setError(null);
    const pinToVerify = pin;
    startTransition(async () => {
      const result = await verifyOwner(id, pinToVerify);
      if (result.success) {
        setVerifiedPin(pinToVerify);
        setIsAdmin(true);
        setPin("");
        setError(null);
      } else {
        const message = getErrorMessage(result.code, result.error);
        const nextError = isRetryableError(result.code)
          ? `${message} Please retry.`
          : message;
        setError(nextError);
      }
    });
  };

  if (isAdmin && verifiedPin) {
    return (
      <AdminPanel
        id={id}
        pin={verifiedPin}
        initialLinks={initialLinks}
        firstInitMode={firstInitMode}
        onSaved={onDone}
      />
    );
  }

  return (
    <section className="relative flex-1 flex flex-col items-center justify-center gap-8 p-6 overflow-hidden text-black">
      <OuvreBackroomBackground />
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs uppercase text-black/80">
            press 3 digit code
          </p>
          <p className="text-2xl tracking-[0.4em] text-black/90">
            {pin.padEnd(3, "X")}
          </p>
          {error && (
            <p className="text-sm text-black">
              {error}
            </p>
          )}
          {isTimedOut && (
            <p className="text-xs text-black">
              Request is taking too long. You can retry now.
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1 mt-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                if (pin.length >= 3 || (isPending && !isTimedOut)) return;
                const next = (pin + String(n)).slice(0, 3);
                setPin(next);
                setError(null);
              }}
              disabled={(isPending && !isTimedOut) || pin.length === 3}
              className="w-16 h-16 bg-[url('/button_round.png')] bg-contain bg-center bg-no-repeat flex items-center justify-center text-lg text-black active:scale-95 transition-transform disabled:opacity-60"
            >
              {n}
            </button>
          ))}
          <span />
          <button
            type="button"
            onClick={() => {
              if (pin.length >= 3 || (isPending && !isTimedOut)) return;
              const next = (pin + "0").slice(0, 3);
              setPin(next);
              setError(null);
            }}
            disabled={(isPending && !isTimedOut) || pin.length === 3}
              className="w-16 h-16 bg-[url('/button_round.png')] bg-contain bg-center bg-no-repeat flex items-center justify-center text-lg text-black active:scale-95 transition-transform disabled:opacity-60"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => {
              if (isPending && !isTimedOut) return;
              setPin((prev) => prev.slice(0, -1));
              setError(null);
            }}
            disabled={(isPending && !isTimedOut) || pin.length === 0}
              className="w-16 h-16 flex items-center justify-center text-sm text-black active:scale-95 transition-transform disabled:opacity-40"
          >
            DEL
          </button>
        </div>

        <button
          type="button"
          onClick={handleVerify}
          disabled={pin.length !== 3 || (isPending && !isTimedOut)}
            className="mt-6 min-h-[48px] px-8 text-sm uppercase tracking-wider text-black active:scale-95 transition-transform"
        >
          {isPending && !isTimedOut ? "Checking…" : "Next"}
        </button>
      </div>
    </section>
  );
}

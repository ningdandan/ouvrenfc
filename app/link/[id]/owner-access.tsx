"use client";

import { useState, useTransition } from "react";
import { verifyOwner } from "../actions";
import { AdminPanel } from "./admin-panel";
import type { SocialLink } from "../types";

type Props = {
  id: string;
  initialLinks: SocialLink[];
  onDone?: () => void;
};

export function OwnerAccess({ id, initialLinks, onDone }: Props) {
  const [pin, setPin] = useState("");
  const [verifiedPin, setVerifiedPin] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleVerify = () => {
    if (pin.length !== 3 || isPending) return;
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
        setError(result.error ?? "Invalid PIN.");
      }
    });
  };

  if (isAdmin && verifiedPin) {
    return (
      <AdminPanel
        id={id}
        pin={verifiedPin}
        initialLinks={initialLinks}
        onSaved={onDone}
      />
    );
  }

  return (
    <section className="p-6">
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs uppercase text-black drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">
            press 3 digit code
          </p>
          <p className="text-2xl tracking-[0.4em] text-black drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">
            {pin.padEnd(3, "X")}
          </p>
          {error && (
            <p className="text-sm text-[#ff4d4d] drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">
              {error}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1 mt-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                if (pin.length >= 3 || isPending) return;
                const next = (pin + String(n)).slice(0, 3);
                setPin(next);
                setError(null);
              }}
              disabled={isPending || pin.length === 3}
              className="w-16 h-16 bg-[url('/button_round.png')] bg-contain bg-center bg-no-repeat flex items-center justify-center text-lg text-black active:scale-95 transition-transform disabled:opacity-60"
            >
              {n}
            </button>
          ))}
          <span />
          <button
            type="button"
            onClick={() => {
              if (pin.length >= 3 || isPending) return;
              const next = (pin + "0").slice(0, 3);
              setPin(next);
              setError(null);
            }}
            disabled={isPending || pin.length === 3}
            className="w-16 h-16 bg-[url('/button_round.png')] bg-contain bg-center bg-no-repeat flex items-center justify-center text-lg text-black active:scale-95 transition-transform disabled:opacity-60"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => {
              if (isPending) return;
              setPin((prev) => prev.slice(0, -1));
              setError(null);
            }}
            disabled={isPending || pin.length === 0}
            className="w-16 h-16 flex items-center justify-center text-sm text-black active:scale-95 transition-transform disabled:opacity-40"
          >
            DEL
          </button>
        </div>

        <button
          type="button"
          onClick={handleVerify}
          disabled={pin.length !== 3 || isPending}
          className="mt-4 min-h-[48px] px-8 text-sm uppercase tracking-wider text-black active:scale-95 transition-transform"
        >
          {isPending ? "Checking…" : "Next"}
        </button>
      </div>
    </section>
  );
}

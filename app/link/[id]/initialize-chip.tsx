"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { activateChip } from "../actions";
import { getErrorMessage, isRetryableError } from "../error-map";
import { usePendingTimeout } from "@/hooks/usePendingTimeout";

type Props = { id: string };

export function InitializeChip({ id }: Props) {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<"welcome" | "pin">("welcome");
  const isTimedOut = usePendingTimeout(isPending, 10000);

  const handleSubmit = () => {
    if (pin.length !== 3 || (isPending && !isTimedOut)) return;
    setError(null);
    startTransition(async () => {
      const result = await activateChip(id, pin);
      if (result.success) {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(`first-init-pin:${id}`, pin);
        }
        router.push(`/link/${id}?firstInit=1`);
        return;
      }
      const message = getErrorMessage(result.code, result.error);
      const nextError = isRetryableError(result.code)
        ? `${message} Please retry.`
        : message;
      setError(nextError);
    });
  };

  const handleDigit = (digit: string) => {
    if (isPending && !isTimedOut) return;
    // 始终只保留最近 3 位数字
    setPin((prev) => (prev + digit).slice(-3));
    setError(null);
  };

  const handleBackspace = () => {
    if (isPending && !isTimedOut) return;
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  if (step === "welcome") {
    return (
      <section className="flex-1 flex flex-col items-center justify-center gap-16">
        <img
          src="/logo.png"
          alt="logo"
          className="w-72 h-auto]"
        />
        <button
          type="button"
          onClick={() => setStep("pin")}
          className="text-3xl tracking-[0.2em] text-black drop-shadow-[0_0_6px_rgba(255,255,255,0.9)] active:scale-95 transition-transform"
        >
          start
        </button>
      </section>
    );
  }

  return (
    <section className="flex-1 flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs uppercase text-black drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">
          initial 3 digit code
        </p>
        <p className="text-2xl tracking-[0.4em] text-black drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">
          {pin.length === 0 ? "XXX" : pin.padEnd(3, "X")}
        </p>
        {error && (
          <p className="text-sm text-[#ff4d4d] drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">
            {error}
          </p>
        )}
        {isTimedOut && (
          <p className="text-xs text-[#ff4d4d] drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">
            Request is taking too long. You can retry now.
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-1 mt-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => handleDigit(String(n))}
            disabled={isPending && !isTimedOut}
            className="w-16 h-16 bg-[url('/button_round.png')] bg-contain bg-center bg-no-repeat flex items-center justify-center text-lg text-black active:scale-95 transition-transform disabled:opacity-60"
          >
            {n}
          </button>
        ))}
        <span />
        <button
          type="button"
          onClick={() => handleDigit("0")}
          disabled={isPending && !isTimedOut}
          className="w-16 h-16 bg-[url('/button_round.png')] bg-contain bg-center bg-no-repeat flex items-center justify-center text-lg text-black active:scale-95 transition-transform disabled:opacity-60"
        >
          0
        </button>
        <button
          type="button"
          onClick={handleBackspace}
          disabled={isPending && !isTimedOut}
          className="w-16 h-16 flex items-center justify-center text-sm text-white active:scale-95 transition-transform disabled:opacity-40"
        >
          DEL
        </button>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={pin.length !== 3 || (isPending && !isTimedOut)}
        className="mt-6 min-h-[48px] px-8 text-sm uppercase tracking-wider text-white active:scale-95 transition-transform"
      >
        {isPending && !isTimedOut ? "INITIALIZING…" : "Next"}
      </button>
    </section>
  );
}

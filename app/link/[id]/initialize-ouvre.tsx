"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { activateOuvre } from "../actions";
import { getErrorMessage, isRetryableError } from "../error-map";
import { usePendingTimeout } from "@/hooks/usePendingTimeout";
import { BackroomShell } from "@/skins/backroom";
import { OuvreBackroomBackground } from "@/skins/ouvre-backroom-background";

type Props = { id: string };

export function InitializeOuvre({ id }: Props) {
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
      const result = await activateOuvre(id, pin);
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
      <BackroomShell>
        <section className="relative flex-1 flex flex-col items-center justify-center gap-16 p-6 overflow-hidden">
          <OuvreBackroomBackground />

          {/* Content on top */}
          <div className="absolute z-10 left-1/2 top-[75%] -translate-x-1/2 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setStep("pin")}
              className="text-2xl tracking-[0.2em] text-black active:scale-95 transition-transform"
            >
              start ouvre
            </button>
          </div>
        </section>
      </BackroomShell>
    );
  }

  return (
    <BackroomShell>
      <section className="relative flex-1 flex flex-col items-center justify-center gap-8 p-6 overflow-hidden text-black">
        <OuvreBackroomBackground />

        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs uppercase text-black/80">
              initial 3 digit code
            </p>
            <p className="text-2xl tracking-[0.4em] text-black/90">
              {pin.length === 0 ? "XXX" : pin.padEnd(3, "X")}
            </p>
            {error && <p className="text-sm text-black">{error}</p>}
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
              className="w-16 h-16 flex items-center justify-center text-sm text-black active:scale-95 transition-transform disabled:opacity-40"
            >
              DEL
            </button>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={pin.length !== 3 || (isPending && !isTimedOut)}
            className="mt-6 min-h-[48px] px-8 text-sm uppercase tracking-wider text-black active:scale-95 transition-transform"
          >
            {isPending && !isTimedOut ? "INITIALIZING…" : "Next"}
          </button>
        </div>
      </section>
    </BackroomShell>
  );
}

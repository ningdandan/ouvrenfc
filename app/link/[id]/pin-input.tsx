"use client";

import { useState } from "react";

export function PinInput() {
  const [pin, setPin] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="pin" className="text-xs text-[#888] uppercase">
        Enter 3-digit PIN
      </label>
      <input
        id="pin"
        type="password"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={3}
        value={pin}
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, "").slice(0, 3);
          setPin(v);
        }}
        placeholder="•••"
        className="w-24 px-3 py-2 bg-black border border-[#666] text-[#c0c0c0] font-mono text-center focus:border-[#c0c0c0] focus:outline-none min-h-[48px]"
        aria-label="3-digit PIN"
      />
    </div>
  );
}

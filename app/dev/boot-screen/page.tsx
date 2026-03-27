"use client";

import { useState, useCallback } from "react";
import { BootScreen } from "@/skins/boot-screen";

const DEMO_IDS = ["00001", "00002", "00099"];

export default function BootScreenSandbox() {
  const [key, setKey] = useState(0);
  const [running, setRunning] = useState(true);
  const [selectedId, setSelectedId] = useState("00002");
  const [duration, setDuration] = useState(1800);

  const replay = useCallback(() => {
    setRunning(false);
    setTimeout(() => {
      setKey((k) => k + 1);
      setRunning(true);
    }, 300);
  }, []);

  const handleComplete = useCallback(() => {
    setRunning(false);
  }, []);

  return (
    <div style={{ background: "#111", minHeight: "100svh", fontFamily: "monospace" }}>
      {/* Controls — always on top */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          background: "rgba(0,0,0,0.85)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 8,
          padding: "14px 20px",
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <label style={{ color: "#fff", fontSize: 11, opacity: 0.6 }}>id</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            style={{
              background: "#000",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 4,
              padding: "2px 6px",
              fontSize: 12,
            }}
          >
            {DEMO_IDS.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>

          <label style={{ color: "#fff", fontSize: 11, opacity: 0.6 }}>duration ms</label>
          <input
            type="number"
            value={duration}
            step={100}
            min={500}
            max={5000}
            onChange={(e) => setDuration(Number(e.target.value))}
            style={{
              width: 72,
              background: "#000",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 4,
              padding: "2px 6px",
              fontSize: 12,
            }}
          />
        </div>

        <button
          onClick={replay}
          style={{
            background: "#fff",
            color: "#000",
            border: "none",
            borderRadius: 4,
            padding: "6px 20px",
            fontSize: 12,
            letterSpacing: "0.1em",
            cursor: "pointer",
            fontFamily: "monospace",
          }}
        >
          {running ? "restart" : "▶ replay"}
        </button>
      </div>

      {/* Boot screen */}
      {running && (
        <BootScreen
          key={key}
          id={selectedId}
          duration={duration}
          onComplete={handleComplete}
        />
      )}

      {!running && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.2)",
            fontSize: 12,
            letterSpacing: "0.1em",
            fontFamily: "monospace",
          }}
        >
          animation complete — press replay
        </div>
      )}
    </div>
  );
}

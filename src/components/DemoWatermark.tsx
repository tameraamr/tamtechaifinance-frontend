/**
 * @component DemoWatermark
 * @description Floating badge indicating the site is in Portfolio Demo mode.
 * Positioned fixed at the bottom-left corner with a subtle glassmorphism effect.
 * Automatically respects the active theme via CSS custom properties.
 *
 * @author Tamer — TamtechAI Finance
 */
"use client";

import React, { useState } from "react";
import { Info, X } from "lucide-react";

export default function DemoWatermark() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="fixed bottom-4 left-4 z-[9999] flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-md shadow-lg border transition-all duration-300 hover:scale-[1.02] group"
      style={{
        background: "rgba(var(--bg-secondary-rgb, 15, 23, 42), 0.85)",
        borderColor: "var(--border-primary, rgba(148, 163, 184, 0.15))",
        color: "var(--text-secondary, #94a3b8)",
      }}
    >
      <div
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ backgroundColor: "var(--accent-primary, #3b82f6)" }}
      />
      <Info className="w-3.5 h-3.5 opacity-60" />
      <span className="text-xs font-semibold tracking-wide">
        Portfolio Demo Mode
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-white/10"
        aria-label="Dismiss demo badge"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

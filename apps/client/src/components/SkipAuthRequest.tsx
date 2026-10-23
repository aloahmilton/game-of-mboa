import React from 'react';

/**
 * Dev helper: skip login and enter the world immediately.
 * Not a product offline mode — just faster access while building.
 */
interface SkipAuthRequestProps {
  onSkip: () => void;
  disabled?: boolean;
}

export function SkipAuthRequest({ onSkip, disabled }: SkipAuthRequestProps) {
  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <button
        type="button"
        onClick={onSkip}
        disabled={disabled}
        className="w-full py-2.5 rounded-lg border border-dashed border-white/30 text-white/80 text-sm font-medium hover:bg-white/10 hover:border-mboa-yellow/50 hover:text-white transition disabled:opacity-40"
      >
        Skip auth
      </button>
      <p className="text-center text-[11px] text-white/40 mt-2">
        Enter without login (for testing)
      </p>
    </div>
  );
}

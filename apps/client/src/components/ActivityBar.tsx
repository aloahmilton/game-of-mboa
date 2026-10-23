import React from 'react';

/** Activity dock — solid icon tiles (game HUD style, not thin emoji-only) */
const ACTIVITIES = [
  {
    id: 'eat',
    label: 'Manger',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
        <path fill="currentColor" d="M7 3v8a2 2 0 002 2h1v8h2V3H7zm8 0c-1.1 0-2 .9-2 2v6h2v10h2V5c0-1.1-.9-2-2-2z" />
      </svg>
    ),
  },
  {
    id: 'drink',
    label: 'Boire',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
        <path fill="currentColor" d="M6 3h12l-1 3H7L6 3zm1.2 5h9.6L18 21H6L7.2 8z" />
      </svg>
    ),
  },
  {
    id: 'maquis',
    label: 'Maquis',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
        <path fill="currentColor" d="M12 2c2 3 6 5 6 10a6 6 0 11-12 0c0-5 4-7 6-10z" />
      </svg>
    ),
  },
  {
    id: 'dance',
    label: 'Danser',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
        <circle cx="12" cy="5" r="2.5" fill="currentColor" />
        <path fill="currentColor" d="M10 9h4l1 5-2 2v6h-2v-6l-2-2 1-5z" />
      </svg>
    ),
  },
  {
    id: 'rest',
    label: 'Repos',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
        <path fill="currentColor" d="M4 12h10a4 4 0 014 4v2H4v-6zm12-6a2.5 2.5 0 110 5 2.5 2.5 0 010-5z" />
      </svg>
    ),
  },
  {
    id: 'shower',
    label: 'Douche',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
        <path fill="currentColor" d="M7 3h10v2H7V3zm2 4h6v2H9V7zm-1 4h8l1 10H7l1-10z" />
      </svg>
    ),
  },
];

interface Props {
  onActivity: (activityId: string) => void;
  disabled?: boolean;
}

export function ActivityBar({ onActivity, disabled }: Props) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <div className="flex gap-1.5 bg-black/70 backdrop-blur-md rounded-2xl px-2.5 py-2 border border-white/15 shadow-xl">
        {ACTIVITIES.map((a) => (
          <button
            key={a.id}
            type="button"
            disabled={disabled}
            onClick={() => onActivity(a.id)}
            className="flex flex-col items-center min-w-[54px] py-2 px-1.5 rounded-xl text-white/90 hover:bg-white/15 hover:text-white active:bg-white/25 disabled:opacity-40 transition"
          >
            <span className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-mboa-yellow">
              {a.icon}
            </span>
            <span className="text-[10px] mt-1 font-medium opacity-90">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

import React from 'react';

const ACTIVITIES = [
  { id: 'eat', label: 'Manger', emoji: '\uD83C\uDF72' },
  { id: 'drink', label: 'Boire', emoji: '\uD83C\uDF7A' },
  { id: 'maquis', label: 'Maquis', emoji: '\uD83D\uDD25' },
  { id: 'dance', label: 'Danser', emoji: '\uD83D\uDC83' },
  { id: 'rest', label: 'Repos', emoji: '\uD83D\uDE34' },
  { id: 'shower', label: 'Douche', emoji: '\uD83D\uDEBF' },
];

interface Props {
  onActivity: (activityId: string) => void;
  disabled?: boolean;
}

export function ActivityBar({ onActivity, disabled }: Props) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <div className="flex gap-2 bg-black/60 backdrop-blur-md rounded-2xl px-3 py-2 border border-white/10">
        {ACTIVITIES.map((a) => (
          <button
            key={a.id}
            disabled={disabled}
            onClick={() => onActivity(a.id)}
            className="flex flex-col items-center min-w-[52px] py-1.5 px-2 rounded-xl hover:bg-white/15 active:bg-white/25 disabled:opacity-40 transition text-white"
          >
            <span className="text-xl leading-none">{a.emoji}</span>
            <span className="text-[10px] mt-1 opacity-90">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

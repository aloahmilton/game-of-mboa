import React from 'react';

interface Needs {
  hunger: number;
  energy: number;
  fun: number;
  social: number;
  hygiene: number;
}

/** Thick need bar — game HUD pattern (track + fill + label, readable at a glance) */
function NeedBar({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-2">
      <span className="w-5 h-5 flex items-center justify-center shrink-0" title={label}>
        {icon}
      </span>
      <div className="flex-1 h-3.5 bg-black/55 rounded-md border border-white/10 overflow-hidden">
        <div
          className="h-full rounded-sm transition-all duration-300"
          style={{ width: `${v}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-7 text-right text-[10px] tabular-nums text-white/70">{Math.round(v)}</span>
    </div>
  );
}

const IconHunger = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-red-400" aria-hidden>
    <path d="M12 3c-1.5 3-4 5-4 9a4 4 0 008 0c0-4-2.5-6-4-9z" />
  </svg>
);
const IconEnergy = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-amber-400" aria-hidden>
    <path d="M13 2L4 14h6l-1 8 10-14h-6l1-6z" />
  </svg>
);
const IconFun = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-purple-400" aria-hidden>
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" className="stroke-purple-400" />
    <circle cx="9" cy="10" r="1.2" className="fill-purple-300" />
    <circle cx="15" cy="10" r="1.2" className="fill-purple-300" />
    <path d="M8 14c1.5 2 6.5 2 8 0" fill="none" stroke="currentColor" strokeWidth="1.5" className="stroke-purple-300" />
  </svg>
);
const IconSocial = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-sky-400" aria-hidden>
    <circle cx="9" cy="9" r="3.5" />
    <circle cx="16" cy="10" r="2.8" opacity="0.85" />
    <path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" />
    <path d="M14 19c.3-2 2-3.5 4.5-3.5 2 0 3.5 1 3.5 3.5" opacity="0.85" />
  </svg>
);
const IconHygiene = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-teal-400" aria-hidden>
    <path d="M12 3v4M8 5c0 4 1.5 7 4 9 2.5-2 4-5 4-9" fill="none" stroke="currentColor" strokeWidth="2" className="stroke-teal-400" />
    <path d="M7 18h10v2H7z" className="fill-teal-500" />
  </svg>
);

export function HUD({
  money = 0,
  district = 'Akwa',
  needs,
}: {
  money?: number;
  district?: string;
  needs?: Needs;
}) {
  const n: Needs = needs || {
    hunger: 80,
    energy: 90,
    fun: 70,
    social: 60,
    hygiene: 85,
  };

  return (
    <div className="absolute top-0 left-0 right-0 p-3 pointer-events-none z-50">
      <div className="flex justify-between items-start gap-3">
        <div className="bg-black/65 backdrop-blur-md rounded-xl px-3.5 py-2.5 border border-white/15 shadow-lg min-w-[120px]">
          <div className="text-[10px] uppercase tracking-wide text-white/50">District</div>
          <div className="font-semibold text-white text-sm leading-tight">{district}</div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-mboa-yellow" aria-hidden>
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" className="stroke-yellow-400" />
              <text x="12" y="16" textAnchor="middle" fontSize="10" className="fill-yellow-300" fontWeight="bold">
                ₣
              </text>
            </svg>
            <span className="text-mboa-yellow font-semibold text-sm tabular-nums">
              {money.toLocaleString()} CFA
            </span>
          </div>
        </div>

        <div className="bg-black/65 backdrop-blur-md rounded-xl px-3 py-2.5 w-[200px] space-y-1.5 border border-white/15 shadow-lg">
          <NeedBar label="Hunger" value={n.hunger} color="#e74c3c" icon={<IconHunger />} />
          <NeedBar label="Energy" value={n.energy} color="#f39c12" icon={<IconEnergy />} />
          <NeedBar label="Fun" value={n.fun} color="#9b59b6" icon={<IconFun />} />
          <NeedBar label="Social" value={n.social} color="#3498db" icon={<IconSocial />} />
          <NeedBar label="Hygiene" value={n.hygiene} color="#1abc9c" icon={<IconHygiene />} />
        </div>
      </div>
    </div>
  );
}

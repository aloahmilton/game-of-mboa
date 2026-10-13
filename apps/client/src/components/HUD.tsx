import React from 'react';

interface Needs {
  hunger: number;
  energy: number;
  fun: number;
  social: number;
  hygiene: number;
}

const NeedBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="flex items-center gap-2 text-xs">
    <span className="w-14 text-right opacity-80">{label}</span>
    <div className="flex-1 h-2 bg-black/40 rounded overflow-hidden">
      <div
        className="h-full rounded transition-all duration-300"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

export function HUD({ money = 0, district = 'Akwa', needs }: { money?: number; district?: string; needs?: Needs }) {
  const defaultNeeds: Needs = needs || {
    hunger: 80,
    energy: 90,
    fun: 70,
    social: 60,
    hygiene: 85,
  };

  return (
    <div className="absolute top-0 left-0 right-0 p-3 pointer-events-none z-50">
      <div className="flex justify-between items-start">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
          <div className="font-semibold">{district}</div>
          <div className="text-mboa-yellow">{money.toLocaleString()} CFA</div>
        </div>
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 w-48 space-y-1">
          <NeedBar label="Hunger" value={defaultNeeds.hunger} color="#e74c3c" />
          <NeedBar label="Energy" value={defaultNeeds.energy} color="#f39c12" />
          <NeedBar label="Fun" value={defaultNeeds.fun} color="#9b59b6" />
          <NeedBar label="Social" value={defaultNeeds.social} color="#3498db" />
          <NeedBar label="Hygiene" value={defaultNeeds.hygiene} color="#1abc9c" />
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';

interface Props {
  newCount?: number;
  returningCount?: number;
}

export const NewVsReturningChart: React.FC<Props> = ({ newCount = 8, returningCount = 24 }) => {
  const total = newCount + returningCount;
  const newPercent = Math.round((newCount / total) * 100);
  const returningPercent = 100 - newPercent;

  // SVG Donut calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const returningOffset = 0;
  const returningLength = (returningPercent / 100) * circumference;
  const newLength = (newPercent / 100) * circumference;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
      {/* Donut graphic */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {/* Background Track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#1A2335"
            strokeWidth="12"
          />
          {/* Returning Customers (Gold) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#D4AF37"
            strokeWidth="12"
            strokeDasharray={`${returningLength} ${circumference}`}
            strokeDashoffset={returningOffset}
            strokeLinecap="round"
          />
          {/* New Customers (Slate / Amber) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#F59E0B"
            strokeWidth="12"
            strokeDasharray={`${newLength} ${circumference}`}
            strokeDashoffset={-returningLength}
            strokeLinecap="round"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-bold text-white">{total}</span>
          <span className="text-[10px] text-slate-400 font-medium">Pelanggan</span>
        </div>
      </div>

      {/* Legend & Stats */}
      <div className="space-y-3 flex-1 w-full">
        <div className="bg-dark-800/80 p-2.5 rounded-xl border border-slate-700/40">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-400 shadow-sm shadow-gold-500/50" />
              Pelanggan Lama (Repeat)
            </span>
            <span className="font-bold text-gold-300">{returningPercent}%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 ml-4.5">{returningCount} orang kembali rutin</p>
        </div>

        <div className="bg-dark-800/80 p-2.5 rounded-xl border border-slate-700/40">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Pelanggan Baru
            </span>
            <span className="font-bold text-amber-400">{newPercent}%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 ml-4.5">{newCount} pendaftaran baru</p>
        </div>
      </div>
    </div>
  );
};

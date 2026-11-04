'use client';

import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle2 } from 'lucide-react';

interface VisitsDataPoint {
  label: string;
  completedVisits: number;
  waitingVisits: number;
}

interface Props {
  data?: VisitsDataPoint[];
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export const VisitsTrendChart: React.FC<Props> = ({ data, period = 'monthly' }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const defaultMonthlyData: VisitsDataPoint[] = [
    { label: 'Mei', completedVisits: 78, waitingVisits: 10 },
    { label: 'Jun', completedVisits: 92, waitingVisits: 12 },
    { label: 'Jul', completedVisits: 104, waitingVisits: 14 },
    { label: 'Agu', completedVisits: 98, waitingVisits: 14 },
    { label: 'Sep', completedVisits: 118, waitingVisits: 16 },
    { label: 'Okt', completedVisits: 135, waitingVisits: 17 },
    { label: 'Nov (Bln ini)', completedVisits: 148, waitingVisits: 22 },
  ];

  const defaultWeeklyData: VisitsDataPoint[] = [
    { label: 'Sen', completedVisits: 14, waitingVisits: 2 },
    { label: 'Sel', completedVisits: 18, waitingVisits: 3 },
    { label: 'Rab', completedVisits: 16, waitingVisits: 4 },
    { label: 'Kam', completedVisits: 20, waitingVisits: 2 },
    { label: 'Jum', completedVisits: 28, waitingVisits: 5 },
    { label: 'Sab', completedVisits: 34, waitingVisits: 6 },
    { label: 'Min', completedVisits: 30, waitingVisits: 4 },
  ];

  const defaultDailyData: VisitsDataPoint[] = [
    { label: '10:00', completedVisits: 2, waitingVisits: 0 },
    { label: '12:00', completedVisits: 4, waitingVisits: 1 },
    { label: '14:00', completedVisits: 3, waitingVisits: 2 },
    { label: '16:00', completedVisits: 5, waitingVisits: 3 },
    { label: '18:00', completedVisits: 6, waitingVisits: 4 },
    { label: '20:00', completedVisits: 4, waitingVisits: 2 },
  ];

  const defaultYearlyData: VisitsDataPoint[] = [
    { label: '2023', completedVisits: 620, waitingVisits: 80 },
    { label: '2024', completedVisits: 940, waitingVisits: 110 },
    { label: '2025', completedVisits: 1380, waitingVisits: 150 },
    { label: '2026 (YTD)', completedVisits: 1690, waitingVisits: 180 },
  ];

  const chartData = data && data.length > 0 
    ? data 
    : period === 'daily'
    ? defaultDailyData
    : period === 'weekly'
    ? defaultWeeklyData
    : period === 'yearly'
    ? defaultYearlyData
    : defaultMonthlyData;

  const totalCompleted = chartData.reduce((acc, c) => acc + c.completedVisits, 0);
  const totalWaiting = chartData.reduce((acc, c) => acc + c.waitingVisits, 0);
  const maxVisits = Math.max(...chartData.map(d => d.completedVisits + d.waitingVisits)) * 1.2 || 1;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>Grafik Jumlah Kunjungan ({period.toUpperCase()})</span>
          </div>
          <p className="text-lg font-bold text-white">
            {totalCompleted} Kunjungan Selesai
            <span className="text-xs font-normal text-slate-400 ml-2">
              (+{totalWaiting} reservasi & antrean)
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-purple-700 to-purple-400" />
            <span className="text-slate-300">Selesai</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-gold-400" />
            <span className="text-slate-300">Antrean / Booking</span>
          </div>
        </div>
      </div>

      <div className="h-56 w-full flex items-end gap-2 sm:gap-3 pt-6 pb-2 px-2 border-b border-slate-800">
        {chartData.map((item, idx) => {
          const totalVal = item.completedVisits + item.waitingVisits;
          const completedPercent = (item.completedVisits / maxVisits) * 100;
          const waitingPercent = (item.waitingVisits / maxVisits) * 100;
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-16 z-20 bg-dark-900 border border-purple-400/50 px-3 py-1.5 rounded-xl shadow-2xl text-center pointer-events-none whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <p className="text-xs font-bold text-white">{item.label}</p>
                  <p className="text-[11px] text-purple-300">
                    Selesai: <strong className="text-white">{item.completedVisits}</strong> orang
                  </p>
                  <p className="text-[10px] text-gold-300">
                    Antrean: <strong className="text-white">{item.waitingVisits}</strong> slot
                  </p>
                </div>
              )}

              {/* Stacked Bar */}
              <div className="w-full max-w-[36px] bg-dark-800 rounded-t-lg overflow-hidden h-full flex flex-col justify-end">
                {/* Waiting portion */}
                <div
                  style={{ height: `${waitingPercent}%` }}
                  className={`w-full transition-all duration-200 ${
                    isHovered ? 'bg-amber-300' : 'bg-gold-500/80'
                  }`}
                />
                {/* Completed portion */}
                <div
                  style={{ height: `${completedPercent}%` }}
                  className={`w-full rounded-t-sm transition-all duration-300 ${
                    isHovered
                      ? 'bg-gradient-to-t from-purple-600 to-purple-400 shadow-md shadow-purple-500/30'
                      : 'bg-gradient-to-t from-purple-800 via-purple-600 to-purple-500'
                  }`}
                />
              </div>

              {/* Label */}
              <span
                className={`text-[10px] mt-2 font-medium transition-colors ${
                  isHovered ? 'text-purple-300 font-bold' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

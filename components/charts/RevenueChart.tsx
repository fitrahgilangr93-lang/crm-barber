'use client';

import React, { useState } from 'react';
import { formatRupiah } from '@/lib/utils';

interface RevenueChartProps {
  data?: { label: string; amount: number; transactions: number }[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const defaultData = [
    { label: 'Mei', amount: 9850000, transactions: 88 },
    { label: 'Jun', amount: 12400000, transactions: 104 },
    { label: 'Jul', amount: 14200000, transactions: 118 },
    { label: 'Agu', amount: 13900000, transactions: 112 },
    { label: 'Sep', amount: 16800000, transactions: 134 },
    { label: 'Okt', amount: 19500000, transactions: 152 },
    { label: 'Nov (Est)', amount: 22100000, transactions: 170 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;
  const maxAmount = Math.max(...chartData.map(d => d.amount)) * 1.15;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-slate-400 font-medium">Tren Pendapatan Bulanan</p>
          <p className="text-lg font-bold text-white">
            {formatRupiah(chartData.reduce((acc, curr) => acc + curr.amount, 0))}
            <span className="text-xs font-normal text-slate-400 ml-2">(Total Periode)</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-block w-3 h-3 rounded-sm bg-gradient-to-t from-gold-600 to-gold-400" />
          <span className="text-slate-300">Pendapatan (IDR)</span>
        </div>
      </div>

      <div className="h-60 w-full flex items-end gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-slate-800">
        {chartData.map((item, idx) => {
          const heightPercent = Math.max(8, (item.amount / maxAmount) * 100);
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
                <div className="absolute -top-14 z-20 bg-dark-900 border border-gold-400/40 px-3 py-1.5 rounded-lg shadow-xl text-center pointer-events-none whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <p className="text-xs font-bold text-gold-300">{formatRupiah(item.amount)}</p>
                  <p className="text-[10px] text-slate-400">{item.transactions} transaksi</p>
                </div>
              )}

              {/* Bar */}
              <div className="w-full max-w-[42px] bg-dark-800 rounded-t-lg overflow-hidden h-full flex items-end">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-md transition-all duration-300 ${
                    isHovered
                      ? 'bg-gradient-to-t from-amber-600 via-yellow-500 to-amber-300 shadow-lg shadow-amber-500/30'
                      : 'bg-gradient-to-t from-gold-700 via-gold-500 to-gold-400'
                  }`}
                />
              </div>

              {/* Label */}
              <span className={`text-[11px] mt-2 font-medium transition-colors ${
                isHovered ? 'text-gold-300 font-bold' : 'text-slate-400'
              }`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

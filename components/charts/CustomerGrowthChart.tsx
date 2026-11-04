'use client';

import React, { useState } from 'react';

interface GrowthPoint {
  month: string;
  customers: number;
}

export const CustomerGrowthChart: React.FC<{ data?: GrowthPoint[] }> = ({ data }) => {
  const [activePoint, setActivePoint] = useState<GrowthPoint | null>(null);

  const defaultData: GrowthPoint[] = [
    { month: 'Mei', customers: 45 },
    { month: 'Jun', customers: 68 },
    { month: 'Jul', customers: 92 },
    { month: 'Agu', customers: 124 },
    { month: 'Sep', customers: 165 },
    { month: 'Okt', customers: 210 },
    { month: 'Nov', customers: 248 },
  ];

  const points = data && data.length > 0 ? data : defaultData;
  const maxVal = Math.max(...points.map(p => p.customers)) * 1.15;
  const minVal = 0;

  // Chart coordinates
  const width = 500;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;

  const getX = (idx: number) => paddingX + (idx / (points.length - 1)) * (width - 2 * paddingX);
  const getY = (val: number) => height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - 2 * paddingY);

  const pathCoordinates = points.map((p, i) => `${getX(i)},${getY(p.customers)}`).join(' L ');
  const areaPath = `M ${getX(0)},${getY(points[0].customers)} L ${pathCoordinates} L ${getX(points.length - 1)},${height - paddingY} L ${getX(0)},${height - paddingY} Z`;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-slate-400 font-medium">Pertumbuhan Total Pelanggan</p>
          <p className="text-lg font-bold text-white">
            +{points[points.length - 1].customers - points[0].customers} Pelanggan Baru
          </p>
        </div>
        {activePoint && (
          <div className="text-xs font-semibold text-gold-300 bg-gold-500/10 border border-gold-500/20 px-2.5 py-1 rounded-lg">
            {activePoint.month}: {activePoint.customers} Pelanggan
          </div>
        )}
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 overflow-visible">
          <defs>
            <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#AA7C11" />
              <stop offset="50%" stopColor="#F5D036" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#1E293B" strokeWidth="1" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />

          {/* Fill Area */}
          <path d={areaPath} fill="url(#growthGradient)" />

          {/* Stroke Line */}
          <path
            d={`M ${pathCoordinates}`}
            fill="none"
            stroke="url(#strokeGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map((p, idx) => {
            const cx = getX(idx);
            const cy = getY(p.customers);
            const isHovered = activePoint?.month === p.month;

            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setActivePoint(p)}
                onMouseLeave={() => setActivePoint(null)}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : 4}
                  className="fill-dark-900 stroke-gold-400 stroke-2 transition-all duration-200"
                />
                {isHovered && (
                  <circle cx={cx} cy={cy} r={10} className="fill-gold-400/20 animate-ping" />
                )}
                <text
                  x={cx}
                  y={height - 6}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-400 select-none font-medium"
                >
                  {p.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { formatRupiah } from '@/lib/utils';

interface ServiceStat {
  name: string;
  count: number;
  revenue: number;
  category: string;
}

export const ServicePopularityChart: React.FC<{ data?: ServiceStat[] }> = ({ data }) => {
  const defaultServices: ServiceStat[] = [
    { name: 'Signature Gentleman Haircut', count: 184, revenue: 13800000, category: 'Haircut' },
    { name: 'Executive Cut + Wash + Massage', count: 122, revenue: 13420000, category: 'Combo' },
    { name: 'The Royal All-Star Combo VIP', count: 68, revenue: 11900000, category: 'Combo' },
    { name: 'Classic Grey Blending & Color', count: 42, revenue: 7560000, category: 'Coloring' },
    { name: 'Hot Towel Shave & Beard Trim', count: 58, revenue: 3480000, category: 'Shaving' },
  ];

  const services = data && data.length > 0 ? data : defaultServices;
  const maxCount = Math.max(...services.map(s => s.count));

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400 font-medium">Layanan Paling Banyak Dipesan</p>
        <span className="text-xs text-gold-400 font-medium">Omset Kontribusi</span>
      </div>

      <div className="space-y-3.5">
        {services.map((item, idx) => {
          const widthPercent = (item.count / maxCount) * 100;

          return (
            <div key={idx} className="group">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-medium text-slate-200 group-hover:text-gold-300 transition-colors flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-dark-750 text-[10px] text-slate-400 flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  {item.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-normal">{item.count} order</span>
                  <span className="font-semibold text-gold-400">{formatRupiah(item.revenue)}</span>
                </div>
              </div>

              <div className="h-2 w-full bg-dark-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${widthPercent}%` }}
                  className="h-full bg-gradient-to-r from-gold-600 via-amber-400 to-yellow-300 rounded-full transition-all duration-500 group-hover:brightness-125"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

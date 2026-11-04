'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '@/types';

export const RatingDistributionChart: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1|2|3|4|5;
    counts[star] = (counts[star] || 0) + 1;
  });

  const total = reviews.length || 1;
  const avg = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '5.0';

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Average Score */}
      <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-dark-800 border border-slate-700/50 text-center min-w-[130px]">
        <span className="text-4xl font-extrabold text-gold-400">{avg}</span>
        <div className="flex items-center gap-1 my-1.5 text-amber-400">
          {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} className="w-4 h-4 fill-amber-400" />
          ))}
        </div>
        <span className="text-xs text-slate-400 font-medium">Berdasarkan {reviews.length} Ulasan</span>
      </div>

      {/* Distribution Bars */}
      <div className="flex-1 w-full space-y-2">
        {[5, 4, 3, 2, 1].map(star => {
          const count = counts[star as 1|2|3|4|5] || 0;
          const percent = Math.round((count / total) * 100);

          return (
            <div key={star} className="flex items-center gap-2.5 text-xs">
              <span className="w-12 text-slate-300 font-medium flex items-center gap-1">
                {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </span>
              <div className="flex-1 h-2 bg-dark-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${percent}%` }}
                  className="h-full bg-gradient-to-r from-gold-600 to-yellow-400 rounded-full"
                />
              </div>
              <span className="w-8 text-right text-slate-400 text-[11px] font-medium">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

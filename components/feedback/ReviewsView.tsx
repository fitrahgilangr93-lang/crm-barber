'use client';

import React, { useState } from 'react';
import { Star, Plus, ThumbsUp, MessageSquare } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RatingDistributionChart } from '@/components/charts/RatingDistributionChart';
import { ReviewFormModal } from '@/components/feedback/ReviewFormModal';
import { formatDate } from '@/lib/utils';

export const ReviewsView: React.FC = () => {
  const { reviews, barbers } = useAppStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBarberFilter, setSelectedBarberFilter] = useState('ALL');

  const filteredReviews = reviews.filter(r =>
    selectedBarberFilter === 'ALL' || r.barberId === selectedBarberFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Ulasan & Feedback Pelanggan
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 font-semibold">
              {reviews.length} Ulasan
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pantau tingkat kepuasan pelanggan, testimoni hasil potongan rambut, dan evaluasi performa barber.
          </p>
        </div>

        <Button variant="gold" size="md" onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Tambah Ulasan Baru</span>
        </Button>
      </div>

      {/* Top Section: Overall Satisfaction & Rating Distribution */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
          Ringkasan Kepuasan Pelanggan Barbershop
        </h4>
        <RatingDistributionChart reviews={reviews} />
      </div>

      {/* Barber Rating Ranking Cards */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Rating Rata-rata Masing-masing Barber
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {barbers.map(b => (
            <div
              key={b.id}
              onClick={() => setSelectedBarberFilter(b.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                selectedBarberFilter === b.id
                  ? 'bg-gold-500/15 border-gold-400 shadow-md shadow-gold-500/10'
                  : 'bg-dark-850/80 border-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.avatarUrl} alt={b.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                <div className="min-w-0">
                  <p className="font-bold text-xs text-white truncate">{b.name}</p>
                  <p className="text-[10px] text-amber-400 flex items-center font-semibold mt-0.5">
                    <Star className="w-3 h-3 fill-amber-400 mr-1" />
                    {b.averageRating} / 5.0
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Feed */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Testimoni & Feedback Terbaru ({filteredReviews.length})
          </h4>
          {selectedBarberFilter !== 'ALL' && (
            <button
              onClick={() => setSelectedBarberFilter('ALL')}
              className="text-xs text-gold-400 hover:underline cursor-pointer"
            >
              Lihat Semua Barber
            </button>
          )}
        </div>

        <div className="space-y-3">
          {filteredReviews.map(r => (
            <div
              key={r.id}
              className="p-4 rounded-xl bg-dark-850/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{r.customerName}</span>
                    <span className="text-[10px] text-slate-500">• {formatDate(r.reviewDate)}</span>
                  </div>
                  <div className="flex items-center gap-1 my-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          r.rating >= s ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-amber-300 ml-1.5">{r.rating}.0</span>
                  </div>
                </div>

                <Badge variant="neutral" size="sm">
                  Barber: {r.barberName}
                </Badge>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic bg-dark-900/50 p-2.5 rounded-lg border border-slate-800/80">
                &quot;{r.comment}&quot;
              </p>

              {r.serviceName && (
                <div className="text-[11px] text-gold-400/90 font-medium pt-1">
                  Layanan: {r.serviceName}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Review Form Modal */}
      <ReviewFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
};

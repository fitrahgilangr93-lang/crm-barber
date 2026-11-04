'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle, 
  Send, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  RotateCcw,
  Sliders,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { RFMSegment, RFMScore } from '@/types';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { computeRFMScores, formatRupiah, formatDate } from '@/lib/utils';

export const RFMAnalyticsView: React.FC = () => {
  const { customers, transactions } = useAppStore();
  const [selectedSegment, setSelectedSegment] = useState<RFMSegment | 'ALL'>('ALL');
  const [showRules, setShowRules] = useState(false);

  const rfmScores = computeRFMScores(customers, transactions);

  const segmentDefinitions: {
    segment: RFMSegment;
    description: string;
    strategy: string;
    color: string;
    badgeVariant: 'platinum' | 'gold' | 'silver' | 'warning' | 'danger' | 'info' | 'success';
  }[] = [
    {
      segment: 'Champions',
      description: 'Pelanggan terbaik: baru saja berkunjung, sangat sering datang, dan spending tertinggi.',
      strategy: 'Berikan perlakuan VIP, prioritas reservasi weekend, dan hadiah merchandise eksklusif.',
      color: 'text-amber-300',
      badgeVariant: 'platinum',
    },
    {
      segment: 'Loyal Customers',
      description: 'Pelanggan setia dengan frekuensi dan pengeluaran stabil di atas rata-rata.',
      strategy: 'Tawarkan upgrade ke Royal Platinum VIP dan program referral teman berhadiah poin.',
      color: 'text-gold-400',
      badgeVariant: 'gold',
    },
    {
      segment: 'Potential Loyalists',
      description: 'Pelanggan yang baru berkunjung beberapa kali namun memiliki potensi menjadi member tetap.',
      strategy: 'Tawarkan membership challenge dengan voucher diskon 15% untuk kunjungan berikutnya.',
      color: 'text-cyan-400',
      badgeVariant: 'info',
    },
    {
      segment: 'New Customers',
      description: 'Pelanggan yang baru pertama kali mencoba potong rambut di barbershop.',
      strategy: 'Kirim WhatsApp follow-up kepuasan dan panduan styling model rambut baru.',
      color: 'text-emerald-400',
      badgeVariant: 'success',
    },
    {
      segment: 'Promising',
      description: 'Pelanggan yang berkunjung cukup baru namun frekuensi dan belanjanya masih moderat.',
      strategy: 'Tawarkan paket bundling potong rambut + cuci rambut + head massage dengan harga promo.',
      color: 'text-blue-400',
      badgeVariant: 'info',
    },
    {
      segment: 'At Risk',
      description: 'Dulu sering berkunjung dan berbelanja, namun sudah lebih dari 30-60 hari belum kembali.',
      strategy: 'Kirimkan pesan personal WhatsApp: "Rambut sudah mulai panjang Bro? Ada diskon Rp 25.000 buat kamu."',
      color: 'text-yellow-400',
      badgeVariant: 'warning',
    },
    {
      segment: 'Hibernating',
      description: 'Sudah sangat lama tidak berkunjung (> 60 hari) dengan riwayat belanja sebelumnya rendah.',
      strategy: 'Kampanye reaktivasi agresif dengan penawaran free hair wash / hair tonic.',
      color: 'text-orange-400',
      badgeVariant: 'warning',
    },
    {
      segment: 'Lost Customers',
      description: 'Skor terendah pada recency, frekuensi, dan nilai transaksi. Berpotensi pindah ke barbershop lain.',
      strategy: 'Kirim survei singkat alasan tidak kembali dan tawarkan voucher diskon 30%.',
      color: 'text-rose-400',
      badgeVariant: 'danger',
    },
  ];

  const filteredScores = selectedSegment === 'ALL'
    ? rfmScores
    : rfmScores.filter(s => s.segment === selectedSegment);

  // Calculate segment counts
  const segmentCounts = segmentDefinitions.map(def => ({
    ...def,
    count: rfmScores.filter(s => s.segment === def.segment).length,
  }));

  // Retention metrics
  const returningCount = customers.filter(c => c.totalVisits > 1).length;
  const repeatRate = Math.round((returningCount / (customers.length || 1)) * 100);
  const atRiskCount = rfmScores.filter(s => s.segment === 'At Risk' || s.segment === 'Hibernating' || s.segment === 'Lost Customers').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Customer Analytics & RFM Segmentation
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 font-semibold">
              Kuantitatif 1-5 Skor
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Analisis pelanggan berdasarkan Recency (Kebaruan Kunjungan), Frequency (Frekuensi Datang), dan Monetary (Total Belanja).
          </p>
        </div>
      </div>

      {/* Retention & Churn Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Tingkat Retensi Pelanggan (Repeat Rate)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">{repeatRate}%</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {returningCount} dari {customers.length} pelanggan berkunjung lebih dari satu kali
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Rata-rata Jarak Antar Kunjungan</span>
            <RotateCcw className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-cyan-400">22 Hari</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Siklus potong rambut pelanggan reguler: 3 - 4 minggu sekali
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Pelanggan Berisiko Churn</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400">{atRiskCount} Orang</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Perlu kampanye WhatsApp reaktivasi agar tidak beralih
          </p>
        </div>
      </div>

      {/* 8 Segments Interactive Filter Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Distribusi 8 Segmen Pelanggan RFM
          </h4>
          {selectedSegment !== 'ALL' && (
            <button
              onClick={() => setSelectedSegment('ALL')}
              className="text-xs text-gold-400 hover:underline cursor-pointer"
            >
              Tampilkan Semua Segmen
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {segmentCounts.map(item => {
            const isSelected = selectedSegment === item.segment;

            return (
              <div
                key={item.segment}
                onClick={() => setSelectedSegment(item.segment)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gold-500/20 border-gold-400 shadow-md shadow-gold-500/20 scale-[1.02]'
                    : 'bg-dark-850/80 border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${item.color}`}>{item.segment}</span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-dark-750 text-white border border-slate-700">
                    {item.count}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 line-clamp-2">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grafik Segmentasi Pelanggan (Visual Distribution Chart) */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-gold-400" />
              Grafik Komposisi Distribusi Segmen Pelanggan
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Proporsi jumlah pelanggan di setiap segmen RFM terhadap total {customers.length} pelanggan
            </p>
          </div>

          <button
            onClick={() => setShowRules(!showRules)}
            className="flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 font-semibold cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showRules ? 'Tutup Parameter RFM' : 'Transparansi Bobot & Parameter RFM'}</span>
            {showRules ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Visual Multi-segment Bar */}
        <div className="space-y-3">
          <div className="h-6 w-full rounded-xl overflow-hidden flex bg-dark-800 p-0.5 border border-slate-700/60 shadow-inner">
            {segmentCounts.map(item => {
              const pct = (item.count / (customers.length || 1)) * 100;
              if (pct === 0) return null;

              const bgClass =
                item.segment === 'Champions'
                  ? 'bg-amber-400'
                  : item.segment === 'Loyal Customers'
                  ? 'bg-gold-500'
                  : item.segment === 'Potential Loyalists'
                  ? 'bg-cyan-400'
                  : item.segment === 'New Customers'
                  ? 'bg-emerald-400'
                  : item.segment === 'Promising'
                  ? 'bg-blue-500'
                  : item.segment === 'At Risk'
                  ? 'bg-yellow-500'
                  : item.segment === 'Hibernating'
                  ? 'bg-orange-500'
                  : 'bg-rose-500';

              return (
                <div
                  key={item.segment}
                  style={{ width: `${pct}%` }}
                  title={`${item.segment}: ${item.count} orang (${Math.round(pct)}%)`}
                  onClick={() => setSelectedSegment(item.segment)}
                  className={`h-full ${bgClass} hover:opacity-90 transition-all cursor-pointer first:rounded-l-lg last:rounded-r-lg`}
                />
              );
            })}
          </div>

          {/* Segment breakdown legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            {segmentCounts.map(item => {
              const pct = Math.round((item.count / (customers.length || 1)) * 100);
              return (
                <div
                  key={item.segment}
                  onClick={() => setSelectedSegment(item.segment)}
                  className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                    selectedSegment === item.segment ? 'bg-gold-500/20 border border-gold-400/50' : 'hover:bg-dark-800'
                  }`}
                >
                  <span className={`font-medium ${item.color}`}>{item.segment}</span>
                  <span className="font-bold text-slate-300">
                    {item.count} <span className="text-slate-500 font-normal">({pct}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Collapsible Transparent Parameter Details */}
        {showRules && (
          <div className="p-4 rounded-xl bg-dark-850 border border-gold-500/30 text-xs space-y-3 animate-in fade-in">
            <div className="flex items-center gap-1.5 font-bold text-gold-300">
              <HelpCircle className="w-4 h-4 text-gold-400" />
              <span>Transparansi Rumus & Konfigurasi Skor 1 - 5 (Admin Configurable)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-slate-300">
              <div className="p-3 rounded-lg bg-dark-800 border border-slate-700/60 space-y-1">
                <p className="font-bold text-white">1. Recency (R) - Hari Sejak Kunjungan</p>
                <ul className="space-y-0.5 text-slate-400">
                  <li>• Skor 5: ≤ 14 hari (Sangat baru)</li>
                  <li>• Skor 4: 15 - 30 hari (Baru)</li>
                  <li>• Skor 3: 31 - 60 hari (Moderat)</li>
                  <li>• Skor 2: 61 - 90 hari (Lama)</li>
                  <li>• Skor 1: &gt; 90 hari (Sangat lama / churn)</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-dark-800 border border-slate-700/60 space-y-1">
                <p className="font-bold text-white">2. Frequency (F) - Frekuensi Kunjungan</p>
                <ul className="space-y-0.5 text-slate-400">
                  <li>• Skor 5: ≥ 8 kunjungan (Pelanggan tetap)</li>
                  <li>• Skor 4: 5 - 7 kunjungan</li>
                  <li>• Skor 3: 3 - 4 kunjungan</li>
                  <li>• Skor 2: 2 kunjungan (Kunjungan kedua)</li>
                  <li>• Skor 1: 1 kunjungan (Pelanggan perdana)</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-dark-800 border border-slate-700/60 space-y-1">
                <p className="font-bold text-white">3. Monetary (M) - Akumulasi Belanja</p>
                <ul className="space-y-0.5 text-slate-400">
                  <li>• Skor 5: ≥ Rp 1.500.000 (VIP High-spender)</li>
                  <li>• Skor 4: Rp 800.000 - Rp 1.499.999</li>
                  <li>• Skor 3: Rp 400.000 - Rp 799.999</li>
                  <li>• Skor 2: Rp 150.000 - Rp 399.999</li>
                  <li>• Skor 1: &lt; Rp 150.000</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Recommendation Banner for Selected Segment */}
      {selectedSegment !== 'ALL' && (
        <div className="p-4 rounded-2xl bg-dark-800 border border-gold-500/40 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gold-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-gold-400" />
              Rekomendasi Strategi Pemasaran: {selectedSegment}
            </span>
            <Button
              size="sm"
              variant="gold"
              onClick={() => alert(`Membuka wizard kampanye broadcast WhatsApp khusus untuk segmen ${selectedSegment}!`)}
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Kirim Promo ke Segmen Ini
            </Button>
          </div>
          <p className="text-xs text-slate-200">
            {segmentDefinitions.find(d => d.segment === selectedSegment)?.strategy}
          </p>
        </div>
      )}

      {/* Customer RFM Scores Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Detail Skor RFM Pelanggan ({filteredScores.length})
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-dark-800/90 text-slate-400 border-b border-slate-700/80 uppercase text-[10px] font-semibold">
              <tr>
                <th className="p-3">Pelanggan</th>
                <th className="p-3">Segmen RFM</th>
                <th className="p-3 text-center">Recency (R)</th>
                <th className="p-3 text-center">Frequency (F)</th>
                <th className="p-3 text-right">Monetary (M)</th>
                <th className="p-3 text-center">Skor RFM</th>
                <th className="p-3">Rekomendasi Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredScores.map(s => (
                <tr key={s.customerId} className="hover:bg-dark-750/50">
                  <td className="p-3">
                    <p className="font-bold text-white">{s.customerName}</p>
                    <p className="text-[10px] text-slate-400">{s.whatsapp}</p>
                  </td>
                  <td className="p-3">
                    <Badge variant="gold" size="sm">
                      {s.segment}
                    </Badge>
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-bold text-slate-200">{s.recencyDays} hari lalu</span>
                    <span className="text-[10px] text-gold-400 block font-semibold">(Skor {s.recencyScore})</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-bold text-slate-200">{s.frequencyCount} kali</span>
                    <span className="text-[10px] text-gold-400 block font-semibold">(Skor {s.frequencyScore})</span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="font-bold text-white">{formatRupiah(s.monetaryAmount)}</span>
                    <span className="text-[10px] text-gold-400 block font-semibold">(Skor {s.monetaryScore})</span>
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-gold-300">
                    {s.overallScore}
                  </td>
                  <td className="p-3 text-slate-300 text-[11px] max-w-xs">
                    {s.actionRecommendation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { 
  Award, 
  Crown, 
  Gift, 
  Sparkles, 
  Cake, 
  CheckCircle2, 
  ArrowRight,
  User,
  Tag,
  Clock
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatRupiah, formatDate } from '@/lib/utils';
import { DigitalMembershipCard } from '@/components/customer/DigitalMembershipCard';
import { INITIAL_MEMBERSHIPS } from '@/lib/seed-data';

export const LoyaltyProgramView: React.FC = () => {
  const { customers, vouchers, redeemVoucher, settings, transactions } = useAppStore();
  const [selectedCustForRedeem, setSelectedCustForRedeem] = useState<string>(customers[0]?.id || '');
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState<string | null>(null);
  const [previewCustomer, setPreviewCustomer] = useState(customers[0]);

  // Birthday customers this month (e.g. November)
  const currentMonthStr = '-11-'; // Month 11
  const birthdayCustomers = customers.filter(c => c.birthDate && c.birthDate.includes(currentMonthStr));

  const handleRedeem = (voucherId: string, title: string, pts: number) => {
    if (!selectedCustForRedeem) {
      alert('Pilih pelanggan terlebih dahulu untuk menukarkan voucher.');
      return;
    }
    const success = redeemVoucher(selectedCustForRedeem, voucherId);
    if (success) {
      setRedeemSuccessMsg(`Berhasil menukarkan voucher "${title}" (${pts} Pts)!`);
      setTimeout(() => setRedeemSuccessMsg(null), 4000);
    } else {
      alert('Poin loyalty pelanggan tidak mencukupi untuk voucher ini.');
    }
  };

  const currentRedeemCust = customers.find(c => c.id === selectedCustForRedeem);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Membership & Customer Loyalty
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 font-semibold">
              VIP Club
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tingkatan membership, perolehan poin transaksi otomatis (1 pt / {formatRupiah(settings.loyaltyRules.spendPerPoint)}), reward voucher, dan promo ulang tahun.
          </p>
        </div>
      </div>

      {/* Birthday Promo Notification Banner */}
      {birthdayCustomers.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-amber-950/60 via-dark-850 to-dark-900 border border-amber-500/30 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Cake className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase">Spesial Ulang Tahun Bulan Ini</span>
              <h4 className="text-sm font-bold text-white mt-0.5">
                Ada {birthdayCustomers.length} Pelanggan yang Berulang Tahun!
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {birthdayCustomers.map(c => c.fullName).join(', ')}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="gold"
            onClick={() => {
              alert(`Mengirimkan voucher promo ultah otomatis ke ${birthdayCustomers.length} pelanggan!`);
            }}
          >
            <Gift className="w-4 h-4 mr-1.5" />
            Kirimkan Voucher Ulang Tahun
          </Button>
        </div>
      )}

      {/* Membership Tiers 3-Column Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {INITIAL_MEMBERSHIPS.map(tier => {
          const isPlatinum = tier.id === 'Platinum';
          const isGold = tier.id === 'Gold';

          return (
            <div
              key={tier.id}
              className={`rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 ${
                isPlatinum
                  ? 'bg-gradient-to-b from-dark-800 to-dark-900 border-cyan-400/40 shadow-xl shadow-cyan-950/30'
                  : isGold
                  ? 'bg-gradient-to-b from-dark-800 to-dark-900 border-gold-400/50 shadow-xl shadow-amber-950/30'
                  : 'bg-dark-850 border-slate-700/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Crown className={`w-5 h-5 ${isPlatinum ? 'text-cyan-400' : isGold ? 'text-gold-400' : 'text-slate-400'}`} />
                    <h3 className="font-extrabold text-base text-white">{tier.name}</h3>
                  </div>
                  <Badge variant={isPlatinum ? 'platinum' : isGold ? 'gold' : 'silver'}>
                    {tier.discountPercent > 0 ? `Diskon ${tier.discountPercent}%` : 'Tier Dasar'}
                  </Badge>
                </div>

                <div className="my-4">
                  <span className="text-[11px] text-slate-400 block">Syarat Minimal Akumulasi Belanja</span>
                  <span className="text-xl font-black text-white">{formatRupiah(tier.minSpend)}</span>
                  <p className="text-[11px] text-gold-400 mt-1 font-semibold">
                    Bonus {tier.pointsMultiplier}x Perolehan Poin
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Keuntungan Eksklusif:</p>
                  {tier.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Voucher Redemption Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Voucher Catalog (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-gold-400" /> Katalog Reward & Voucher Penukaran
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Tukarkan poin loyalty pelanggan dengan diskon spesial</p>
              </div>

              {/* Customer Selector for Redemption */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Pilih Pelanggan:</span>
                <select
                  value={selectedCustForRedeem}
                  onChange={e => {
                    setSelectedCustForRedeem(e.target.value);
                    const found = customers.find(c => c.id === e.target.value);
                    if (found) setPreviewCustomer(found);
                  }}
                  className="bg-dark-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-gold-400 cursor-pointer"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.loyaltyPoints} Pts)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {redeemSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{redeemSuccessMsg}</span>
              </div>
            )}

            {/* Voucher Cards */}
            <div className="space-y-3">
              {vouchers.map(v => {
                const canAfford = currentRedeemCust ? currentRedeemCust.loyaltyPoints >= v.pointsRequired : false;

                return (
                  <div
                    key={v.id}
                    className="p-4 rounded-xl bg-dark-800/80 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-gold-500/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-gold-400" />
                        <span className="font-mono font-bold text-xs text-gold-300 uppercase tracking-wider">{v.code}</span>
                        <Badge variant="gold" size="sm">
                          {v.pointsRequired > 0 ? `${v.pointsRequired} Poin` : 'Promo Spesial'}
                        </Badge>
                      </div>
                      <h5 className="font-bold text-white text-xs mt-1">{v.title}</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">{v.description}</p>
                    </div>

                    <Button
                      size="sm"
                      variant={canAfford ? 'gold' : 'secondary'}
                      disabled={!canAfford}
                      onClick={() => handleRedeem(v.id, v.title, v.pointsRequired)}
                      className="shrink-0 text-xs"
                    >
                      {canAfford ? 'Tukarkan Poin' : 'Poin Kurang'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Digital Member Card Live Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-gold-400" /> Kartu Membership Digital Pelanggan
            </h4>

            {previewCustomer && (
              <DigitalMembershipCard customer={previewCustomer} />
            )}

            <div className="p-3 rounded-xl bg-dark-800/60 border border-slate-700/40 text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-200">Tentang Kartu Digital:</p>
              <p>Kartu dapat ditunjukkan pelanggan langsung dari ponsel mereka ke kasir untuk verifikasi tier dan diskon otomatis.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Riwayat Poin Pelanggan Table (Audit Log) */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-dark-850">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gold-400" />
              Riwayat Perolehan Poin & Akumulasi Transaksi
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Catatan perolehan poin per invoice transaksi dan penukaran voucher loyalty
            </p>
          </div>
          <span className="text-xs text-gold-400 font-semibold">
            {transactions.length} Aktivitas Poin
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-dark-800/80 text-slate-400 border-b border-slate-700/80 uppercase text-[10px] font-semibold">
              <tr>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Nomor Invoice</th>
                <th className="p-3">Pelanggan</th>
                <th className="p-3">Tier</th>
                <th className="p-3 text-right">Nilai Belanja</th>
                <th className="p-3 text-center">Poin Didapat</th>
                <th className="p-3 text-center">Metode Pembayaran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {transactions.slice(0, 10).map(t => (
                <tr key={t.id} className="hover:bg-dark-750/50">
                  <td className="p-3 text-slate-400 whitespace-nowrap text-[11px]">
                    {formatDate(t.createdAt)}
                  </td>
                  <td className="p-3 font-mono font-bold text-gold-300">
                    {t.invoiceNumber}
                  </td>
                  <td className="p-3 font-semibold text-white">
                    {t.customerName}
                  </td>
                  <td className="p-3">
                    <Badge variant={t.customerTier === 'Platinum' ? 'platinum' : t.customerTier === 'Gold' ? 'gold' : 'silver'} size="sm">
                      {t.customerTier}
                    </Badge>
                  </td>
                  <td className="p-3 text-right font-medium text-slate-200">
                    {formatRupiah(t.totalAmount)}
                  </td>
                  <td className="p-3 text-center font-bold text-gold-400">
                    +{t.pointsEarned} Pts
                  </td>
                  <td className="p-3 text-center text-slate-400 text-[11px]">
                    {t.paymentMethod}
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

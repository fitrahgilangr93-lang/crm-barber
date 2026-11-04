import React from 'react';
import { Crown, Sparkles, QrCode } from 'lucide-react';
import { Customer } from '@/types';
import { cn, formatRupiah } from '@/lib/utils';

interface Props {
  customer: Customer;
  className?: string;
}

export const DigitalMembershipCard: React.FC<Props> = ({ customer, className }) => {
  const isPlatinum = customer.membershipTier === 'Platinum';
  const isGold = customer.membershipTier === 'Gold';

  return (
    <div
      className={cn(
        'relative rounded-2xl p-6 text-white overflow-hidden shadow-2xl transition-all duration-300 border',
        isPlatinum
          ? 'bg-gradient-to-br from-slate-900 via-neutral-900 to-cyan-950 border-cyan-400/50 shadow-cyan-950/40'
          : isGold
          ? 'bg-gradient-to-br from-[#261E08] via-[#1A1405] to-[#3B2F0C] border-gold-400/60 shadow-amber-950/40'
          : 'bg-gradient-to-br from-slate-800 via-slate-900 to-zinc-950 border-slate-500/40 shadow-slate-950/40',
        className
      )}
    >
      {/* Background Metallic Shimmer Patterns */}
      <div className="absolute -right-16 -top-16 w-52 h-52 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-4 bottom-4 opacity-10 pointer-events-none">
        <Crown className="w-36 h-36" />
      </div>

      {/* Top Header */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <Crown className={cn('w-5 h-5', isPlatinum ? 'text-cyan-300' : isGold ? 'text-gold-400' : 'text-slate-300')} />
            <h4 className="text-sm font-black tracking-widest uppercase">THE ROYAL CUT</h4>
          </div>
          <p className="text-[10px] text-slate-300 tracking-wider">EXCLUSIVE VIP CLUB</p>
        </div>

        <div className={cn(
          'px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border flex items-center gap-1.5 shadow-sm',
          isPlatinum
            ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50'
            : isGold
            ? 'bg-gold-500/20 text-gold-300 border-gold-400/50'
            : 'bg-slate-500/20 text-slate-200 border-slate-400/50'
        )}>
          <Sparkles className="w-3 h-3" />
          {customer.membershipTier} Member
        </div>
      </div>

      {/* Center Details */}
      <div className="my-6 relative z-10">
        <p className="text-[11px] text-slate-400 uppercase tracking-wider">Nama Anggota</p>
        <p className="text-xl font-bold tracking-wide text-white truncate drop-shadow-md">
          {customer.fullName}
        </p>
        <div className="flex items-center gap-4 mt-2 text-xs text-slate-300">
          <div>
            <span className="text-[10px] text-slate-400 block">ID Pelanggan</span>
            <span className="font-mono font-bold text-gold-300">{customer.id}</span>
          </div>
          <div className="border-l border-slate-700 pl-4">
            <span className="text-[10px] text-slate-400 block">Loyalty Points</span>
            <span className="font-bold text-amber-300">{customer.loyaltyPoints} Pts</span>
          </div>
          <div className="border-l border-slate-700 pl-4">
            <span className="text-[10px] text-slate-400 block">Total Belanja</span>
            <span className="font-semibold">{formatRupiah(customer.totalSpend)}</span>
          </div>
        </div>
      </div>

      {/* Footer & QR Code representation */}
      <div className="flex items-end justify-between pt-4 border-t border-white/10 relative z-10">
        <div>
          <p className="text-[10px] text-slate-400">STATUS KEANGGOTAAN</p>
          <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Aktif (Garansi Seumur Hidup)
          </p>
        </div>
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-2.5 py-1.5 rounded-xl border border-white/10">
          <QrCode className="w-6 h-6 text-gold-300" />
          <span className="text-[9px] font-mono text-slate-300">SCAN DI KASIR</span>
        </div>
      </div>
    </div>
  );
};

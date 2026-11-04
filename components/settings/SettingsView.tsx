'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Store, 
  Award, 
  Send, 
  Database, 
  ShieldCheck, 
  RotateCcw, 
  Save, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { isSupabaseConfigured } from '@/lib/supabase';
import { formatRupiah } from '@/lib/utils';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetDemoData } = useAppStore();

  const [shopName, setShopName] = useState(settings.shopProfile.name);
  const [shopPhone, setShopPhone] = useState(settings.shopProfile.phone);
  const [shopAddress, setShopAddress] = useState(settings.shopProfile.address);
  const [openingHour, setOpeningHour] = useState(settings.shopProfile.openingHour);
  const [closingHour, setClosingHour] = useState(settings.shopProfile.closingHour);

  const [spendPerPoint, setSpendPerPoint] = useState(settings.loyaltyRules.spendPerPoint);
  const [pointValueRupiah, setPointValueRupiah] = useState(settings.loyaltyRules.pointValueRupiah);

  const [recencyActive, setRecencyActive] = useState(settings.rfmThresholds.recencyDaysActive);
  const [recencyAtRisk, setRecencyAtRisk] = useState(settings.rfmThresholds.recencyDaysAtRisk);

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      shopProfile: {
        ...settings.shopProfile,
        name: shopName,
        phone: shopPhone,
        address: shopAddress,
        openingHour,
        closingHour,
      },
      loyaltyRules: {
        ...settings.loyaltyRules,
        spendPerPoint,
        pointValueRupiah,
      },
      rfmThresholds: {
        ...settings.rfmThresholds,
        recencyDaysActive: recencyActive,
        recencyDaysAtRisk: recencyAtRisk,
      },
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Pengaturan Sistem & Konfigurasi
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 font-semibold">
              Super Admin
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Konfigurasi profil barbershop, aturan perolehan poin loyalitas, parameter ambang RFM, dan status database.
          </p>
        </div>

        {isSaved && (
          <div className="p-2 px-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-1.5 font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Pengaturan Berhasil Disimpan!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Profil Barbershop */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-800">
            <Store className="w-4 h-4 text-gold-400" /> Profil & Jam Operasional Barbershop
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nama Barbershop</label>
              <input
                type="text"
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nomor WhatsApp / CS</label>
              <input
                type="text"
                value={shopPhone}
                onChange={e => setShopPhone(e.target.value)}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Alamat Lengkap</label>
              <input
                type="text"
                value={shopAddress}
                onChange={e => setShopAddress(e.target.value)}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Jam Buka Operasional</label>
              <input
                type="time"
                value={openingHour}
                onChange={e => setOpeningHour(e.target.value)}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Jam Tutup Operasional</label>
              <input
                type="time"
                value={closingHour}
                onChange={e => setClosingHour(e.target.value)}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Loyalty Rules */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-800">
            <Award className="w-4 h-4 text-gold-400" /> Aturan Perolehan & Penukaran Loyalty Points
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nominal Belanja per 1 Poin (Rp)
              </label>
              <input
                type="number"
                step="1000"
                value={spendPerPoint}
                onChange={e => setSpendPerPoint(Number(e.target.value))}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400 font-bold"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Contoh: Setiap belanja {formatRupiah(spendPerPoint)} mendapatkan 1 poin.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nilai Tukar 1 Poin (Rp)
              </label>
              <input
                type="number"
                step="50"
                value={pointValueRupiah}
                onChange={e => setPointValueRupiah(Number(e.target.value))}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400 font-bold"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                100 poin bernilai diskon {formatRupiah(100 * pointValueRupiah)}.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: RFM & Churn Thresholds */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-800">
            <ShieldCheck className="w-4 h-4 text-gold-400" /> Parameter Ambang Batas RFM & Churn
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Batas Hari Pelanggan Aktif (Hari)
              </label>
              <input
                type="number"
                value={recencyActive}
                onChange={e => setRecencyActive(Number(e.target.value))}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Batas Hari Pelanggan Berisiko Churn (Hari)
              </label>
              <input
                type="number"
                value={recencyAtRisk}
                onChange={e => setRecencyAtRisk(Number(e.target.value))}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Database & Cloud Status */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-800">
            <Database className="w-4 h-4 text-gold-400" /> Database & Cloud Supabase
          </h4>

          <div className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-700/60 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Status Koneksi Supabase:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Hybrid Store Active (Siap Cloud & Demo Lokal)
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Skema SQL 20 tabel lengkap tersedia di folder <code className="text-gold-300">supabase/schema.sql</code>. Anda dapat menyalin file tersebut ke SQL Editor Supabase kapanpun ingin menghubungkan PostgreSQL cloud secara live.
            </p>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset seluruh data demo ke awal?')) {
                resetDemoData();
                alert('Data demo berhasil direset!');
              }
            }}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Reset ke Data Awal Pabrik
          </button>

          <Button type="submit" variant="gold" size="md">
            <Save className="w-4 h-4 mr-1.5" />
            Simpan Konfigurasi
          </Button>
        </div>
      </form>
    </div>
  );
};

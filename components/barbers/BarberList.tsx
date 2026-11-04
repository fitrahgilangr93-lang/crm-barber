'use client';

import React, { useState } from 'react';
import { UserCheck, Plus, Star, Phone, DollarSign, Award, Edit, Trash2 } from 'lucide-react';
import { Barber, BarberStatus } from '@/types';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BarberFormModal } from '@/components/barbers/BarberFormModal';
import { formatRupiah } from '@/lib/utils';

export const BarberList: React.FC = () => {
  const { barbers, deleteBarber, updateBarber } = useAppStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus data barber "${name}"?`)) {
      deleteBarber(id);
    }
  };

  const handleStatusChange = (id: string, newStatus: BarberStatus) => {
    updateBarber(id, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Manajemen Tim Barber
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 font-semibold">
              {barbers.length} Master Barber
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pantau status kehadiran realtime, pembagian komisi pengerjaan, total pelanggan dilayani, dan reputasi rating.
          </p>
        </div>

        <Button
          variant="gold"
          size="md"
          onClick={() => {
            setEditingBarber(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Tambah Barber Baru</span>
        </Button>
      </div>

      {/* Barbers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {barbers.map(barber => {
          const statusVariant =
            barber.status === 'Hadir'
              ? 'success'
              : barber.status === 'Istirahat'
              ? 'warning'
              : 'danger';

          return (
            <div
              key={barber.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-gold-400/40 transition-all shadow-xl"
            >
              <div>
                {/* Avatar & Header */}
                <div className="flex items-start gap-3.5 pb-4 border-b border-slate-800">
                  <div className="w-14 h-14 rounded-2xl bg-gold-gradient p-[1px] shadow-lg shadow-gold-500/20 shrink-0">
                    <div className="w-full h-full rounded-[15px] overflow-hidden bg-dark-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={barber.avatarUrl}
                        alt={barber.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white truncate">{barber.name}</h4>
                    </div>
                    <p className="text-[11px] text-gold-400 mt-0.5 truncate">{barber.specialization}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant={statusVariant} size="sm">
                        {barber.status}
                      </Badge>
                      <span className="text-xs text-amber-400 flex items-center font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                        {barber.averageRating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2.5 my-4">
                  <div className="p-2.5 rounded-xl bg-dark-800/80 border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">Pelanggan Dilayani</span>
                    <span className="text-sm font-bold text-white">{barber.totalCustomersServed} Orang</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-dark-800/80 border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">Total Omset</span>
                    <span className="text-sm font-bold text-gold-400">{formatRupiah(barber.totalRevenueGenerated)}</span>
                  </div>
                </div>

                {/* Status Switcher & Contact */}
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Komisi Pengerjaan:</span>
                    <strong className="text-emerald-400 font-bold">{barber.commissionRate}% per transaksi</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Jadwal Kerja:</span>
                    <span className="text-gold-300 font-medium">{barber.workingDays || 'Senin - Sabtu'} ({barber.workingHours || '10:00 - 21:00'})</span>
                  </div>
                  {barber.address && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Alamat:</span>
                      <span className="truncate max-w-[180px] text-slate-300">{barber.address}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Kontak WA:</span>
                    <span>{barber.phone}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400">Ganti Kehadiran:</span>
                    <select
                      value={barber.status}
                      onChange={e => handleStatusChange(barber.id, e.target.value as BarberStatus)}
                      className="bg-dark-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-gold-400 cursor-pointer"
                    >
                      <option value="Hadir">Hadir</option>
                      <option value="Istirahat">Istirahat</option>
                      <option value="Libur">Libur</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-end gap-2 text-xs">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setEditingBarber(barber);
                    setIsFormOpen(true);
                  }}
                >
                  <Edit className="w-3.5 h-3.5 mr-1" />
                  Edit Profil
                </Button>
                <button
                  onClick={() => handleDelete(barber.id, barber.name)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors"
                  title="Hapus Barber"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form Modal */}
      <BarberFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBarber(null);
        }}
        barberToEdit={editingBarber}
      />
    </div>
  );
};

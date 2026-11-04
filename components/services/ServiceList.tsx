'use client';

import React, { useState } from 'react';
import { Scissors, Plus, Edit, Trash2, Clock, Tag } from 'lucide-react';
import { Service } from '@/types';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ServiceFormModal } from '@/components/services/ServiceFormModal';
import { formatRupiah } from '@/lib/utils';

export const ServiceList: React.FC = () => {
  const { services, deleteService } = useAppStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredServices = services.filter(s =>
    categoryFilter === 'ALL' || s.category === categoryFilter
  );

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus layanan "${name}"?`)) {
      deleteService(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Katalog Layanan & Tarif
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 font-semibold">
              {filteredServices.length} Layanan
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Kelola daftar menu potong rambut, cukur jenggot, pewarnaan, paket combo, dan estimasi waktu pengerjaan.
          </p>
        </div>

        <Button
          variant="gold"
          size="md"
          onClick={() => {
            setEditingService(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Tambah Layanan Baru</span>
        </Button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        {['ALL', 'Haircut', 'Shaving', 'Coloring', 'Treatment', 'Combo'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer ${
              categoryFilter === cat
                ? 'bg-gold-gradient text-dark-950 font-bold shadow-md shadow-gold-500/20'
                : 'bg-dark-800 text-slate-300 hover:bg-dark-750 border border-slate-700/60'
            }`}
          >
            {cat === 'ALL' ? 'Semua Kategori' : cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map(srv => (
          <div
            key={srv.id}
            className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-gold-400/40 transition-all shadow-lg"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-gold-400 uppercase tracking-wider font-bold">
                    {srv.id} • {srv.category}
                  </span>
                  <h4 className="text-base font-bold text-white mt-0.5">{srv.name}</h4>
                </div>
                <Badge variant={srv.isActive ? 'success' : 'neutral'}>
                  {srv.isActive ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </div>

              <p className="text-xs text-slate-400 my-3 leading-relaxed min-h-[40px]">
                {srv.description}
              </p>

              <div className="p-3 rounded-xl bg-dark-800/80 border border-slate-700/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-4 h-4 text-gold-400" />
                  <span>{srv.durationMinutes} Menit</span>
                </div>
                <span className="text-base font-extrabold text-gold-300">
                  {formatRupiah(srv.price)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-end gap-2 text-xs">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setEditingService(srv);
                  setIsFormOpen(true);
                }}
              >
                <Edit className="w-3.5 h-3.5 mr-1" />
                Edit
              </Button>
              <button
                onClick={() => handleDelete(srv.id, srv.name)}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors"
                title="Hapus Layanan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      <ServiceFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingService(null);
        }}
        serviceToEdit={editingService}
      />
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { Service } from '@/types';
import { useAppStore } from '@/lib/store';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  serviceToEdit?: Service | null;
}

export const ServiceFormModal: React.FC<Props> = ({ isOpen, onClose, serviceToEdit }) => {
  const { addService, updateService } = useAppStore();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Haircut' | 'Shaving' | 'Coloring' | 'Treatment' | 'Combo'>('Haircut');
  const [price, setPrice] = useState<number>(75000);
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    if (serviceToEdit) {
      setName(serviceToEdit.name);
      setCategory(serviceToEdit.category);
      setPrice(serviceToEdit.price);
      setDurationMinutes(serviceToEdit.durationMinutes);
      setDescription(serviceToEdit.description);
      setIsActive(serviceToEdit.isActive);
    } else {
      setName('');
      setCategory('Haircut');
      setPrice(75000);
      setDurationMinutes(45);
      setDescription('');
      setIsActive(true);
    }
  }, [serviceToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Nama layanan wajib diisi.');
      return;
    }

    if (serviceToEdit) {
      updateService(serviceToEdit.id, {
        name,
        category,
        price,
        durationMinutes,
        description,
        isActive,
      });
    } else {
      addService({
        name,
        category,
        price,
        durationMinutes,
        description,
        isActive,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={serviceToEdit ? 'Edit Layanan' : 'Tambah Layanan Baru'}
      subtitle="Atur nama, kategori, harga, dan durasi pengerjaan layanan barbershop"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Nama Layanan <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            placeholder="e.g. Signature Gentleman Haircut"
            onChange={e => setName(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Kategori Layanan
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            >
              <option value="Haircut">Haircut</option>
              <option value="Shaving">Shaving</option>
              <option value="Coloring">Coloring</option>
              <option value="Treatment">Treatment</option>
              <option value="Combo">Combo Paket</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Harga (Rp) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="5000"
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400 font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Durasi Pengerjaan (Menit) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              required
              min="10"
              max="240"
              step="5"
              value={durationMinutes}
              onChange={e => setDurationMinutes(Number(e.target.value))}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Status Layanan
            </label>
            <select
              value={isActive ? 'true' : 'false'}
              onChange={e => setIsActive(e.target.value === 'true')}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            >
              <option value="true">Aktif (Tersedia)</option>
              <option value="false">Nonaktif (Tidak Tersedia)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Deskripsi Layanan
          </label>
          <textarea
            rows={2}
            value={description}
            placeholder="Jelaskan proses atau produk yang digunakan..."
            onChange={e => setDescription(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="gold" size="sm">
            {serviceToEdit ? 'Simpan Perubahan' : 'Tambahkan Layanan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

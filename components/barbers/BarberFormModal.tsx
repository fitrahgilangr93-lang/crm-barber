'use client';

import React, { useState, useEffect } from 'react';
import { Barber, BarberStatus } from '@/types';
import { useAppStore } from '@/lib/store';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  barberToEdit?: Barber | null;
}

export const BarberFormModal: React.FC<Props> = ({ isOpen, onClose, barberToEdit }) => {
  const { addBarber, updateBarber } = useAppStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('Fade Specialist & Styling');
  const [status, setStatus] = useState<BarberStatus>('Hadir');
  const [commissionRate, setCommissionRate] = useState<number>(25);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [address, setAddress] = useState('');
  const [workingDays, setWorkingDays] = useState('Senin - Sabtu');
  const [workingHours, setWorkingHours] = useState('10:00 - 21:00');

  useEffect(() => {
    if (barberToEdit) {
      setName(barberToEdit.name);
      setPhone(barberToEdit.phone);
      setSpecialization(barberToEdit.specialization);
      setStatus(barberToEdit.status);
      setCommissionRate(barberToEdit.commissionRate);
      setAvatarUrl(barberToEdit.avatarUrl);
      setAddress(barberToEdit.address || '');
      setWorkingDays(barberToEdit.workingDays || 'Senin - Sabtu');
      setWorkingHours(barberToEdit.workingHours || '10:00 - 21:00');
    } else {
      setName('');
      setPhone('');
      setSpecialization('Master Barber & Styling');
      setStatus('Hadir');
      setCommissionRate(25);
      setAvatarUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200');
      setAddress('');
      setWorkingDays('Senin - Sabtu');
      setWorkingHours('10:00 - 21:00');
    }
  }, [barberToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Nama dan nomor telepon barber wajib diisi.');
      return;
    }

    if (barberToEdit) {
      updateBarber(barberToEdit.id, {
        name,
        phone,
        specialization,
        status,
        commissionRate,
        avatarUrl,
        address: address || undefined,
        workingDays,
        workingHours,
      });
    } else {
      addBarber({
        name,
        phone,
        specialization,
        status,
        commissionRate,
        avatarUrl,
        isActive: true,
        address: address || undefined,
        workingDays,
        workingHours,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={barberToEdit ? 'Edit Data Barber' : 'Tambah Barber Baru'}
      subtitle="Kelola profil kapster, spesialisasi, jadwal kerja, dan persentase komisi"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Nama Barber <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            placeholder="e.g. Rizky 'The Blade' Pratama"
            onChange={e => setName(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Nomor Telepon / WA <span className="text-rose-400">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              placeholder="e.g. 081234567801"
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Komisi Layanan (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={commissionRate}
              onChange={e => setCommissionRate(Number(e.target.value))}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400 font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Keahlian & Spesialisasi
          </label>
          <input
            type="text"
            value={specialization}
            placeholder="e.g. Fade Specialist & Hair Tattoo Art"
            onChange={e => setSpecialization(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Jadwal Hari Kerja
            </label>
            <input
              type="text"
              value={workingDays}
              placeholder="e.g. Senin - Sabtu"
              onChange={e => setWorkingDays(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Jam Operasional
            </label>
            <input
              type="text"
              value={workingHours}
              placeholder="e.g. 10:00 - 21:00"
              onChange={e => setWorkingHours(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Alamat Tinggal / Domisili
          </label>
          <input
            type="text"
            value={address}
            placeholder="e.g. Jl. Senopati No. 42, Jakarta Selatan"
            onChange={e => setAddress(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Status Kehadiran
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as BarberStatus)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            >
              <option value="Hadir">Hadir (Standby)</option>
              <option value="Istirahat">Istirahat</option>
              <option value="Libur">Libur / Cuti</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              URL Foto Avatar
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="gold" size="sm">
            {barberToEdit ? 'Simpan Perubahan' : 'Tambahkan Barber'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewFormModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { customers, barbers, services, addReview } = useAppStore();

  const [customerId, setCustomerId] = useState('');
  const [barberId, setBarberId] = useState('');
  const [serviceName, setServiceName] = useState('Signature Gentleman Haircut');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !barberId || !comment.trim()) {
      alert('Pilih Pelanggan, Barber, dan isi komentar ulasan.');
      return;
    }

    const customer = customers.find(c => c.id === customerId);
    const barber = barbers.find(b => b.id === barberId);

    addReview({
      customerId,
      customerName: customer?.fullName || 'Pelanggan',
      barberId,
      barberName: barber?.name || 'Barber',
      serviceName,
      rating,
      comment,
    });

    alert('Terima kasih! Ulasan pelanggan berhasil ditambahkan.');
    onClose();
    setComment('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Ulasan Pelanggan Baru"
      subtitle="Input review bintang dan feedback pelanggan terhadap pelayanan barber"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Pilih Pelanggan <span className="text-rose-400">*</span>
          </label>
          <select
            required
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
          >
            <option value="">-- Pilih Pelanggan --</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.fullName}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Pilih Barber yang Melayani <span className="text-rose-400">*</span>
          </label>
          <select
            required
            value={barberId}
            onChange={e => setBarberId(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
          >
            <option value="">-- Pilih Barber --</option>
            {barbers.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Layanan yang Digunakan
          </label>
          <select
            value={serviceName}
            onChange={e => setServiceName(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
          >
            {services.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Rating Stars Input */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Rating Kepuasan (1 - 5 Bintang)
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className="p-1 hover:scale-110 transition-transform cursor-pointer"
              >
                <Star
                  className={`w-7 h-7 ${
                    rating >= star
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-600'
                  }`}
                />
              </button>
            ))}
            <span className="text-sm font-bold text-amber-300 ml-2">{rating}.0 Bintang</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Komentar & Pengalaman Pelanggan <span className="text-rose-400">*</span>
          </label>
          <textarea
            required
            rows={3}
            placeholder="Tuliskan ulasan pelanggan mengenai potongan rambut, kenyamanan, atau kebersihan..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="gold" size="sm">
            Kirim Ulasan
          </Button>
        </div>
      </form>
    </Modal>
  );
};

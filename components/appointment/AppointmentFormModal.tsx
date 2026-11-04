'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertCircle, Clock, Calendar, Scissors, UserCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentFormModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { customers, barbers, services, addAppointment } = useAppStore();

  const [customerId, setCustomerId] = useState('');
  const [barberId, setBarberId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [conflictError, setConflictError] = useState<string | null>(null);

  const selectedService = services.find(s => s.id === serviceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    if (!customerId || !barberId || !serviceId) {
      alert('Harap pilih Pelanggan, Barber, dan Layanan.');
      return;
    }

    const result = addAppointment({
      customerId,
      barberId,
      serviceId,
      appointmentDate,
      startTime,
      notes: notes || undefined,
    });

    if (!result.success) {
      setConflictError(result.error || 'Jadwal bentrok dengan reservasi lain.');
    } else {
      alert(`Reservasi berhasil dibuat! Nomor Antrean: ${result.appointment?.queueNumber}`);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Buat Reservasi & Antrean Baru"
      subtitle="Sistem otomatis mencegah bentrok jadwal berdasarkan durasi pengerjaan"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {conflictError && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Gagal Membuat Reservasi:</p>
              <p className="mt-0.5">{conflictError}</p>
            </div>
          </div>
        )}

        {/* Customer Select */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Pilih Pelanggan <span className="text-rose-400">*</span>
          </label>
          <select
            required
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
          >
            <option value="">-- Pilih dari database pelanggan --</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.fullName} ({c.whatsapp}) - {c.membershipTier}
              </option>
            ))}
          </select>
        </div>

        {/* Barber Select */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Pilih Barber yang Bertugas <span className="text-rose-400">*</span>
          </label>
          <select
            required
            value={barberId}
            onChange={e => setBarberId(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
          >
            <option value="">-- Pilih Barber --</option>
            {barbers.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.specialization}) - Status: {b.status}
              </option>
            ))}
          </select>
        </div>

        {/* Service Select */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Pilih Layanan Utama <span className="text-rose-400">*</span>
          </label>
          <select
            required
            value={serviceId}
            onChange={e => setServiceId(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
          >
            <option value="">-- Pilih Layanan --</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} - Durasi: {s.durationMinutes} Menit (Rp {s.price.toLocaleString('id-ID')})
              </option>
            ))}
          </select>
          {selectedService && (
            <p className="text-[11px] text-gold-400 mt-1 flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" />
              Estimasi durasi pengerjaan: {selectedService.durationMinutes} menit
            </p>
          )}
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Tanggal Reservasi <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              required
              value={appointmentDate}
              onChange={e => setAppointmentDate(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Jam Mulai (10:00 - 20:30) <span className="text-rose-400">*</span>
            </label>
            <input
              type="time"
              required
              min="10:00"
              max="21:00"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Catatan Khusus (Opsional)
          </label>
          <input
            type="text"
            placeholder="e.g. Minta potongan low taper fade..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="gold">
            Konfirmasi Booking
          </Button>
        </div>
      </form>
    </Modal>
  );
};

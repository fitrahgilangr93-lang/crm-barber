'use client';

import React, { useState, useEffect } from 'react';
import { Customer, CustomerStatus, MembershipTier } from '@/types';
import { useAppStore } from '@/lib/store';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { INITIAL_SOURCES } from '@/lib/seed-data';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customerToEdit?: Customer | null;
}

export const CustomerFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  customerToEdit,
}) => {
  const { addCustomer, updateCustomer, barbers } = useAppStore();

  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'Pria' | 'Wanita'>('Pria');
  const [address, setAddress] = useState('');
  const [sourceId, setSourceId] = useState('instagram');
  const [favoriteBarberId, setFavoriteBarberId] = useState('');
  const [hairPreference, setHairPreference] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<CustomerStatus>('Aktif');
  const [membershipTier, setMembershipTier] = useState<MembershipTier>('Silver');

  useEffect(() => {
    if (customerToEdit) {
      setFullName(customerToEdit.fullName);
      setWhatsapp(customerToEdit.whatsapp);
      setEmail(customerToEdit.email || '');
      setBirthDate(customerToEdit.birthDate || '');
      setGender(customerToEdit.gender || 'Pria');
      setAddress(customerToEdit.address || '');
      setSourceId(customerToEdit.sourceId || 'instagram');
      setFavoriteBarberId(customerToEdit.favoriteBarberId || '');
      setHairPreference(customerToEdit.hairPreference || '');
      setNotes(customerToEdit.notes || '');
      setStatus(customerToEdit.status || 'Aktif');
      setMembershipTier(customerToEdit.membershipTier || 'Silver');
    } else {
      setFullName('');
      setWhatsapp('');
      setEmail('');
      setBirthDate('');
      setGender('Pria');
      setAddress('');
      setSourceId('instagram');
      setFavoriteBarberId('');
      setHairPreference('');
      setNotes('');
      setStatus('Aktif');
      setMembershipTier('Silver');
    }
  }, [customerToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !whatsapp.trim()) {
      alert('Nama lengkap dan nomor WhatsApp wajib diisi.');
      return;
    }

    if (customerToEdit) {
      updateCustomer(customerToEdit.id, {
        fullName,
        whatsapp,
        email: email || undefined,
        birthDate: birthDate || undefined,
        gender,
        address: address || undefined,
        sourceId,
        favoriteBarberId: favoriteBarberId || undefined,
        hairPreference: hairPreference || undefined,
        notes: notes || undefined,
        status,
        membershipTier,
      });
    } else {
      addCustomer({
        fullName,
        whatsapp,
        email: email || undefined,
        birthDate: birthDate || undefined,
        gender,
        address: address || undefined,
        sourceId,
        favoriteBarberId: favoriteBarberId || undefined,
        hairPreference: hairPreference || undefined,
        notes: notes || undefined,
        status,
        membershipTier,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customerToEdit ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
      subtitle={customerToEdit ? `Mengubah profil ${customerToEdit.fullName}` : 'Daftarkan profil baru ke sistem CRM'}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Nama Lengkap <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dimas Pratama"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-400"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Nomor WhatsApp <span className="text-rose-400">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. 081298765432"
              value={whatsapp}
              onChange={e => setWhatsapp(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email (Opsional)
            </label>
            <input
              type="email"
              placeholder="e.g. dimas@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-400"
            />
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Tanggal Lahir (Untuk Promo Ultah)
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Jenis Kelamin
            </label>
            <select
              value={gender}
              onChange={e => setGender(e.target.value as any)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            >
              <option value="Pria">Pria</option>
              <option value="Wanita">Wanita</option>
            </select>
          </div>

          {/* Customer Source */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Sumber Pelanggan (Customer Acquisition)
            </label>
            <select
              value={sourceId}
              onChange={e => setSourceId(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            >
              {INITIAL_SOURCES.map(src => (
                <option key={src.id} value={src.id}>
                  {src.name}
                </option>
              ))}
            </select>
          </div>

          {/* Favorite Barber */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Barber Favorit
            </label>
            <select
              value={favoriteBarberId}
              onChange={e => setFavoriteBarberId(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            >
              <option value="">-- Belum Ada Preferensi Khusus --</option>
              {barbers.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.specialization})
                </option>
              ))}
            </select>
          </div>

          {/* Status & Tier */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Status Pelanggan
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as CustomerStatus)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            >
              <option value="Aktif">Aktif</option>
              <option value="Kurang Aktif">Kurang Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif (Churned)</option>
            </select>
          </div>
        </div>

        {/* Hair Preference */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Preferensi Model Rambut & Styling
          </label>
          <input
            type="text"
            placeholder="e.g. Low Fade Textured Fringe, Pomade Heavy Hold Matte"
            value={hairPreference}
            onChange={e => setHairPreference(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-400"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Alamat Domisili (Opsional)
          </label>
          <input
            type="text"
            placeholder="e.g. Kebayoran Baru, Jakarta Selatan"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-400"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Catatan Khusus Pelanggan
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Kulit sensitif, suka kopi hitam saat antri..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-400"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="gold">
            {customerToEdit ? 'Simpan Perubahan' : 'Tambahkan Pelanggan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

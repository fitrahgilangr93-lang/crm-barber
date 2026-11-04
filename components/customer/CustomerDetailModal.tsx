'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Scissors, 
  ShoppingBag, 
  GitBranch, 
  MessageSquare, 
  Printer, 
  ExternalLink,
  Award,
  Sparkles
} from 'lucide-react';
import { Customer } from '@/types';
import { useAppStore } from '@/lib/store';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DigitalMembershipCard } from '@/components/customer/DigitalMembershipCard';
import { formatRupiah, formatDate, formatDateTime } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
  onOpenReceipt?: (txId: string) => void;
}

export const CustomerDetailModal: React.FC<Props> = ({
  isOpen,
  onClose,
  customer,
  onOpenReceipt,
}) => {
  const { transactions, appointments, journeys, journeyHistory, interactions, barbers } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'appointments' | 'journey'>('overview');

  if (!customer) return null;

  const customerTransactions = transactions.filter(t => t.customerId === customer.id);
  const customerAppointments = appointments.filter(a => a.customerId === customer.id);
  const customerJourney = journeys.find(j => j.customerId === customer.id);
  const customerJourneyHistory = journeyHistory.filter(jh => jh.customerId === customer.id);
  const customerInteractions = interactions.filter(i => i.customerId === customer.id);
  const favoriteBarber = barbers.find(b => b.id === customer.favoriteBarberId);

  const avgOrderValue = customer.totalVisits > 0 
    ? Math.round(customer.totalSpend / customer.totalVisits) 
    : 0;

  const handleSendWA = () => {
    let cleanPhone = customer.whatsapp.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
    const msg = encodeURIComponent(`Halo Bro ${customer.fullName}, salam hangat dari The Royal Cut Barbershop! 🙏`);
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Profil Lengkap Pelanggan"
      subtitle={`${customer.fullName} • ${customer.id}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Digital VIP Card */}
          <div className="md:col-span-2">
            <DigitalMembershipCard customer={customer} />
          </div>

          {/* Quick Contact & Action Card */}
          <div className="glass-card rounded-2xl p-5 border border-slate-700/60 space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Kontak & Informasi</h5>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-slate-200">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">{customer.whatsapp}</span>
              </div>
              {customer.email && (
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className="truncate">{customer.email}</span>
                </div>
              )}
              {customer.birthDate && (
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Lahir: {formatDate(customer.birthDate)}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-start gap-2.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-tight">{customer.address}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <Button
                variant="gold"
                size="sm"
                className="w-full text-xs"
                onClick={handleSendWA}
              >
                <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                Hubungi via WhatsApp
              </Button>
            </div>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-dark-800/80 p-3 rounded-xl border border-slate-700/50">
            <p className="text-[11px] text-slate-400">Total Akumulasi Belanja</p>
            <p className="text-base font-bold text-gold-400">{formatRupiah(customer.totalSpend)}</p>
          </div>
          <div className="bg-dark-800/80 p-3 rounded-xl border border-slate-700/50">
            <p className="text-[11px] text-slate-400">Total Kunjungan</p>
            <p className="text-base font-bold text-white">{customer.totalVisits} Kali</p>
          </div>
          <div className="bg-dark-800/80 p-3 rounded-xl border border-slate-700/50">
            <p className="text-[11px] text-slate-400">Rata-rata Nilai Transaksi</p>
            <p className="text-base font-bold text-white">{formatRupiah(avgOrderValue)}</p>
          </div>
          <div className="bg-dark-800/80 p-3 rounded-xl border border-slate-700/50">
            <p className="text-[11px] text-slate-400">Kunjungan Terakhir</p>
            <p className="text-base font-bold text-emerald-400">{formatDate(customer.lastVisitAt)}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 gap-4 text-xs font-semibold">
          {[
            { key: 'overview', label: 'Ringkasan & Preferensi' },
            { key: 'transactions', label: `Riwayat Transaksi (${customerTransactions.length})` },
            { key: 'appointments', label: `Reservasi (${customerAppointments.length})` },
            { key: 'journey', label: 'Customer Journey & Log' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
                activeTab === tab.key
                  ? 'border-gold-400 text-gold-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview & Preferences */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-dark-800/60 border border-slate-700/50 space-y-2">
                <span className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Scissors className="w-4 h-4" /> Preferensi Potongan Rambut
                </span>
                <p className="text-sm font-semibold text-slate-100">
                  {customer.hairPreference || 'Belum ada catatan spesifik.'}
                </p>
                <div className="pt-2 text-xs text-slate-400">
                  <span className="font-medium text-slate-300">Barber Langganan: </span>
                  {favoriteBarber ? favoriteBarber.name : 'Fleksibel / Siapapun'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-dark-800/60 border border-slate-700/50 space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Catatan Grooming Staff
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {customer.notes || 'Belum ada catatan tambahan untuk pelanggan ini.'}
                </p>
                <div className="pt-1 text-[11px] text-slate-500">
                  Sumber Pelanggan: <span className="text-slate-300 uppercase font-semibold">{customer.sourceId}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Transactions */}
        {activeTab === 'transactions' && (
          <div className="space-y-3">
            {customerTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-dark-800 text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="p-2.5">No Invoice</th>
                      <th className="p-2.5">Tanggal</th>
                      <th className="p-2.5">Layanan</th>
                      <th className="p-2.5">Barber</th>
                      <th className="p-2.5 text-right">Total</th>
                      <th className="p-2.5">Metode</th>
                      <th className="p-2.5 text-center">Struk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {customerTransactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-dark-750/50">
                        <td className="p-2.5 font-mono font-bold text-gold-300">{tx.invoiceNumber}</td>
                        <td className="p-2.5 text-slate-400">{formatDate(tx.createdAt)}</td>
                        <td className="p-2.5 text-slate-200">
                          {tx.details.map(d => d.serviceName).join(', ')}
                        </td>
                        <td className="p-2.5 text-slate-300">{tx.barberName}</td>
                        <td className="p-2.5 text-right font-bold text-white">{formatRupiah(tx.totalAmount)}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
                            {tx.paymentMethod}
                          </span>
                        </td>
                        <td className="p-2.5 text-center">
                          {onOpenReceipt && (
                            <button
                              onClick={() => onOpenReceipt(tx.id)}
                              className="p-1 rounded hover:bg-gold-500/20 text-gold-400 cursor-pointer"
                              title="Lihat Struk"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">Belum ada transaksi yang tercatat.</p>
            )}
          </div>
        )}

        {/* Tab 3: Appointments */}
        {activeTab === 'appointments' && (
          <div className="space-y-3">
            {customerAppointments.length > 0 ? (
              <div className="space-y-2">
                {customerAppointments.map(apt => (
                  <div key={apt.id} className="p-3 rounded-xl bg-dark-800/80 border border-slate-700/60 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gold-400">{apt.queueNumber}</span>
                        <span className="font-semibold text-white">{apt.serviceName}</span>
                        <Badge variant={apt.status === 'Selesai' ? 'success' : apt.status === 'Sedang Dilayani' ? 'warning' : 'info'}>
                          {apt.status}
                        </Badge>
                      </div>
                      <p className="text-slate-400 mt-1">
                        {formatDate(apt.appointmentDate)} • {apt.startTime} - {apt.endTime} WIB • Bersama {apt.barberName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">Belum ada riwayat reservasi.</p>
            )}
          </div>
        )}

        {/* Tab 4: Journey & Timeline */}
        {activeTab === 'journey' && (
          <div className="space-y-4">
            {/* Current Stage */}
            {customerJourney && (
              <div className="p-3.5 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider">Tahapan Journey Saat Ini</span>
                  <p className="text-base font-extrabold text-white mt-0.5">{customerJourney.currentStage}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{customerJourney.lastNotes}</p>
                </div>
                <Badge variant="gold">Aktif sejak {formatDate(customerJourney.enteredStageAt)}</Badge>
              </div>
            )}

            {/* Timeline */}
            <div className="border-l-2 border-slate-800 ml-3 pl-4 space-y-4 text-xs">
              {customerInteractions.map(inter => (
                <div key={inter.id} className="relative group">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-gold-400 ring-4 ring-dark-900" />
                  <div className="bg-dark-800 p-2.5 rounded-xl border border-slate-700/60">
                    <div className="flex items-center justify-between font-semibold text-slate-200">
                      <span>{inter.interactionType}</span>
                      <span className="text-[10px] text-slate-500">{formatDateTime(inter.createdAt)}</span>
                    </div>
                    <p className="text-slate-400 mt-1">{inter.notes}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">Petugas: {inter.staffName || 'Staff'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

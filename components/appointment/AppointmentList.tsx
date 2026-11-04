'use client';

import React, { useState } from 'react';
import { 
  CalendarDays, 
  Plus, 
  Clock, 
  CheckCircle, 
  Play, 
  XCircle, 
  User, 
  Filter, 
  ChevronRight,
  AlertTriangle,
  LayoutGrid,
  List,
  Calendar as CalendarIcon
} from 'lucide-react';
import { AppointmentStatus, Appointment } from '@/types';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AppointmentFormModal } from '@/components/appointment/AppointmentFormModal';
import { formatDate } from '@/lib/utils';

export const AppointmentList: React.FC = () => {
  const { appointments, barbers, updateAppointmentStatus } = useAppStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-04');
  const [barberFilter, setBarberFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const filteredAppointments = appointments.filter(a => {
    const matchesDate = !selectedDate || a.appointmentDate === selectedDate;
    const matchesBarber = barberFilter === 'ALL' || a.barberId === barberFilter;
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesDate && matchesBarber && matchesStatus;
  });

  const getStatusBadgeVariant = (status: AppointmentStatus) => {
    switch (status) {
      case 'Selesai': return 'success';
      case 'Sedang Dilayani': return 'warning';
      case 'Dikonfirmasi': return 'info';
      case 'Dibatalkan': return 'danger';
      default: return 'neutral';
    }
  };

  // Operating hours slots for calendar schedule
  const OPERATING_HOURS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Reservasi & Antrean Barbershop
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 font-semibold">
              {filteredAppointments.length} Jadwal
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Kalender jadwal kerja, slot waktu barber, antrean otomatis, dan pencegahan bentrok pengerjaan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-dark-850 p-1 rounded-xl border border-slate-700/60 text-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 px-3 rounded-lg flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-gold-gradient text-dark-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Daftar</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 px-3 rounded-lg flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                viewMode === 'calendar' ? 'bg-gold-gradient text-dark-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Kalender Jadwal</span>
            </button>
          </div>

          <Button variant="gold" size="md" onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Buat Reservasi</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3">
        {/* Date Filter */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-medium text-slate-400">Pilih Tanggal Reservasi</label>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="text-[10px] text-gold-400 hover:underline cursor-pointer"
              >
                Tampilkan Semua Tanggal
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            />
            {!selectedDate && (
              <button
                onClick={() => setSelectedDate('2026-11-04')}
                className="px-2.5 py-2 rounded-xl bg-dark-750 text-gold-300 text-xs border border-slate-700 whitespace-nowrap cursor-pointer hover:bg-gold-500/20"
              >
                Hari Ini
              </button>
            )}
          </div>
        </div>

        {/* Barber Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Filter Barber</label>
          <select
            value={barberFilter}
            onChange={e => setBarberFilter(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
          >
            <option value="ALL">Semua Barber</option>
            {barbers.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Filter Status</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
          >
            <option value="ALL">Semua Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Dikonfirmasi">Dikonfirmasi</option>
            <option value="Sedang Dilayani">Sedang Dilayani</option>
            <option value="Selesai">Selesai</option>
            <option value="Dibatalkan">Dibatalkan</option>
          </select>
        </div>
      </div>

      {/* Main View: Calendar Schedule Grid vs Standard List View */}
      {viewMode === 'calendar' ? (
        /* Kalender Jadwal Visual Grid (Barber Columns x Hourly Slots) */
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-dark-850">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-gold-400" />
                Kalender Slot Jadwal & Ketersediaan Barber
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tanggal: <strong className="text-white">{selectedDate ? formatDate(selectedDate) : 'Semua Tanggal'}</strong> • Jam Operasional 10:00 - 21:00 WIB
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Slot Terisi
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-dark-700 border border-slate-600" /> Slot Tersedia
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header: Barber Columns */}
              <div className="grid grid-cols-6 border-b border-slate-800 bg-dark-900/80 text-xs">
                <div className="p-3 font-bold text-slate-400 border-r border-slate-800 text-center">
                  Jam / Waktu
                </div>
                {barbers.map(b => (
                  <div key={b.id} className="p-3 text-center border-r border-slate-800 last:border-r-0">
                    <p className="font-bold text-white truncate">{b.name}</p>
                    <p className="text-[10px] text-gold-400 truncate">{b.specialization}</p>
                  </div>
                ))}
              </div>

              {/* Rows: Each hour */}
              <div className="divide-y divide-slate-800/60 text-xs">
                {OPERATING_HOURS.map(hour => (
                  <div key={hour} className="grid grid-cols-6 items-stretch min-h-[64px]">
                    <div className="p-2 border-r border-slate-800 flex items-center justify-center font-mono font-bold text-slate-400 bg-dark-900/40 text-[11px]">
                      {hour}
                    </div>
                    {barbers.map(barber => {
                      const hourNum = parseInt(hour.split(':')[0], 10);
                      // Find appointment in this hour slot
                      const apt = appointments.find(a => {
                        if (a.barberId !== barber.id) return false;
                        if (selectedDate && a.appointmentDate !== selectedDate) return false;
                        if (a.status === 'Dibatalkan') return false;
                        const aptHour = parseInt(a.startTime.split(':')[0], 10);
                        return aptHour === hourNum;
                      });

                      return (
                        <div key={barber.id} className="p-1.5 border-r border-slate-800 last:border-r-0 flex flex-col justify-center">
                          {apt ? (
                            <div className="p-2 rounded-xl bg-gold-500/15 border border-gold-500/40 text-xs hover:border-gold-400 transition-colors">
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-gold-400 text-[10px]">{apt.queueNumber}</span>
                                <span className="text-[9px] px-1 py-0.2 rounded bg-dark-800 text-slate-300">
                                  {apt.status}
                                </span>
                              </div>
                              <p className="font-bold text-white text-[11px] truncate mt-0.5">{apt.customerName}</p>
                              <p className="text-[10px] text-slate-400 truncate">{apt.serviceName}</p>
                            </div>
                          ) : (
                            <div className="h-full rounded-xl border border-dashed border-slate-800/80 hover:border-slate-700 flex items-center justify-center p-1 text-center transition-colors">
                              <span className="text-[10px] text-slate-600 font-medium">Kosong</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Appointments List / Queue Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map(apt => (
              <div
                key={apt.id}
                className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-gold-400/40 transition-all shadow-lg"
              >
                <div>
                  {/* Header: Queue number & Status */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black font-mono text-gold-400 tracking-wider">
                        {apt.queueNumber}
                      </span>
                      <span className="text-xs text-slate-400">Antrean</span>
                    </div>
                    <Badge variant={getStatusBadgeVariant(apt.status)}>
                      {apt.status}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="my-3 space-y-2 text-xs">
                    <div>
                      <p className="text-sm font-bold text-white">{apt.customerName}</p>
                      <p className="text-[11px] text-slate-400">{apt.customerPhone || 'Walk-in Guest'}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-dark-800/80 border border-slate-700/40 space-y-1">
                      <p className="font-semibold text-gold-300">{apt.serviceName}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-300">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gold-400" /> {apt.startTime} - {apt.endTime} WIB
                        </span>
                        <span>{apt.serviceDuration || 45} Menit</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Tanggal: {formatDate(apt.appointmentDate)}</p>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      <span className="text-slate-500">Barber:</span>{' '}
                      <strong className="text-slate-200">{apt.barberName}</strong>
                    </p>

                    {apt.notes && (
                      <p className="text-[10px] text-slate-400 italic bg-dark-850 p-1.5 rounded-lg border border-slate-800">
                        Catatan: &quot;{apt.notes}&quot;
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-1.5 text-xs">
                  {apt.status === 'Menunggu' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={() => updateAppointmentStatus(apt.id, 'Dikonfirmasi')}
                    >
                      Konfirmasi Booking
                    </Button>
                  )}
                  {apt.status === 'Dikonfirmasi' && (
                    <Button
                      size="sm"
                      variant="gold"
                      className="w-full text-xs"
                      onClick={() => updateAppointmentStatus(apt.id, 'Sedang Dilayani')}
                    >
                      <Play className="w-3 h-3 mr-1 fill-dark-950" />
                      Mulai Layani
                    </Button>
                  )}
                  {apt.status === 'Sedang Dilayani' && (
                    <Button
                      size="sm"
                      variant="gold"
                      className="w-full text-xs bg-emerald-600 text-white hover:bg-emerald-500"
                      onClick={() => updateAppointmentStatus(apt.id, 'Selesai')}
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1" />
                      Selesaikan Pelayanan
                    </Button>
                  )}
                  {apt.status !== 'Selesai' && apt.status !== 'Dibatalkan' && (
                    <button
                      onClick={() => {
                        if (confirm('Batalkan reservasi ini?')) {
                          updateAppointmentStatus(apt.id, 'Dibatalkan');
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 cursor-pointer"
                      title="Batalkan Reservasi"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400 glass-card rounded-2xl border border-slate-800">
              <CalendarDays className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">Tidak ada jadwal reservasi yang ditemukan.</p>
              <p className="text-xs text-slate-500 mt-1">Gunakan tombol &quot;Buat Reservasi Baru&quot; untuk menambahkan antrean.</p>
            </div>
          )}
        </div>
      )}

      {/* Appointment Booking Modal */}
      <AppointmentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
};

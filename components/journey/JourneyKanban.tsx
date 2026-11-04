'use client';

import React, { useState } from 'react';
import { 
  GitBranch, 
  Plus, 
  ArrowRight, 
  MessageSquare, 
  Clock, 
  Calendar, 
  User, 
  CheckCircle2, 
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { JourneyStageKey, CustomerJourney, Customer } from '@/types';
import { useAppStore } from '@/lib/store';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatDate, formatDateTime } from '@/lib/utils';
import { CustomerDetailModal } from '@/components/customer/CustomerDetailModal';

interface StageConfig {
  key: JourneyStageKey;
  title: string;
  sub: string;
  color: string;
  badgeBg: string;
  borderColor: string;
}

const STAGES: StageConfig[] = [
  {
    key: 'AWARENESS',
    title: '1. AWARENESS',
    sub: 'Tahu dari Medsos & Ads',
    color: 'text-purple-400',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    borderColor: 'border-purple-500/40',
  },
  {
    key: 'INTEREST',
    title: '2. INTEREST',
    sub: 'Tanya Harga & Jadwal',
    color: 'text-blue-400',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    borderColor: 'border-blue-500/40',
  },
  {
    key: 'FIRST_VISIT',
    title: '3. FIRST VISIT',
    sub: 'Kunjungan Perdana',
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    borderColor: 'border-amber-500/40',
  },
  {
    key: 'TRANSACTION',
    title: '4. TRANSACTION',
    sub: 'Transaksi Sukses',
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    borderColor: 'border-emerald-500/40',
  },
  {
    key: 'RETENTION',
    title: '5. RETENTION',
    sub: 'Kunjungan Berulang (2x+)',
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
    borderColor: 'border-cyan-500/40',
  },
  {
    key: 'LOYALTY',
    title: '6. LOYALTY',
    sub: 'Pelanggan VIP Tetap',
    color: 'text-gold-400',
    badgeBg: 'bg-gold-500/20 text-gold-300 border-gold-500/40',
    borderColor: 'border-gold-400/50',
  },
];

export const JourneyKanban: React.FC = () => {
  const { journeys, customers, moveJourneyStage, journeyHistory, interactions, addInteraction } = useAppStore();

  const [draggedCustId, setDraggedCustId] = useState<string | null>(null);
  const [activeStageTarget, setActiveStageTarget] = useState<JourneyStageKey | null>(null);

  // Interaction note modal
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedCustId, setSelectedCustId] = useState<string | null>(null);
  const [targetStageAfterNote, setTargetStageAfterNote] = useState<JourneyStageKey | null>(null);
  const [noteContent, setNoteContent] = useState('');

  // Customer Detail modal
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Audit Tab
  const [activeAuditTab, setActiveAuditTab] = useState<'history' | 'interactions'>('history');

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, customerId: string) => {
    e.dataTransfer.setData('text/plain', customerId);
    setDraggedCustId(customerId);
  };

  const handleDragOver = (e: React.DragEvent, stageKey: JourneyStageKey) => {
    e.preventDefault();
    setActiveStageTarget(stageKey);
  };

  const handleDragLeave = () => {
    setActiveStageTarget(null);
  };

  const handleDrop = (e: React.DragEvent, targetStage: JourneyStageKey) => {
    e.preventDefault();
    const customerId = e.dataTransfer.getData('text/plain') || draggedCustId;
    setActiveStageTarget(null);
    setDraggedCustId(null);

    if (customerId) {
      // Prompt modal to attach reason / notes
      setSelectedCustId(customerId);
      setTargetStageAfterNote(targetStage);
      setNoteContent(`Dipindahkan ke ${targetStage}`);
      setIsNoteModalOpen(true);
    }
  };

  const handleConfirmStageMove = () => {
    if (selectedCustId && targetStageAfterNote) {
      moveJourneyStage(selectedCustId, targetStageAfterNote, noteContent);
      addInteraction(selectedCustId, 'WhatsApp Chat', `Update Tahapan Journey ke ${targetStageAfterNote}: ${noteContent}`);
    }
    setIsNoteModalOpen(false);
    setSelectedCustId(null);
    setTargetStageAfterNote(null);
    setNoteContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Customer Journey Tracking
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 font-semibold">
              Kanban Board
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visualisasi & pantau siklus hidup perjalanan pelanggan dari pertama kali mengenal barbershop hingga menjadi VIP loyal.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-dark-800/80 px-3 py-2 rounded-xl border border-slate-700/50">
          <Info className="w-4 h-4 text-gold-400 shrink-0" />
          <span className="text-slate-300">
            Tarik & lepas kartu untuk mengubah tahapan pelanggan (Drag & Drop).
          </span>
        </div>
      </div>

      {/* Kanban Board Columns (6 Stages) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
        {STAGES.map(stage => {
          const stageJourneys = journeys.filter(j => j.currentStage === stage.key);
          const isTarget = activeStageTarget === stage.key;

          return (
            <div
              key={stage.key}
              onDragOver={e => handleDragOver(e, stage.key)}
              onDragLeave={handleDragLeave}
              onDrop={e => handleDrop(e, stage.key)}
              className={`rounded-2xl bg-dark-900/90 border transition-all duration-200 flex flex-col min-h-[500px] overflow-hidden ${
                isTarget
                  ? 'border-gold-400 bg-gold-500/5 shadow-lg shadow-gold-500/10 scale-[1.01]'
                  : 'border-slate-800/80'
              }`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-800 bg-dark-850">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black tracking-wider uppercase ${stage.color}`}>
                    {stage.title}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-dark-750 text-white border border-slate-700">
                    {stageJourneys.length}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{stage.sub}</p>
              </div>

              {/* Cards List in Stage */}
              <div className="p-2 space-y-2.5 flex-1 overflow-y-auto">
                {stageJourneys.map(j => {
                  const customer = customers.find(c => c.id === j.customerId);
                  if (!customer) return null;

                  return (
                    <div
                      key={j.customerId}
                      draggable
                      onDragStart={e => handleDragStart(e, j.customerId)}
                      className="glass-card rounded-xl p-3 border border-slate-700/60 cursor-grab active:cursor-grabbing hover:border-gold-400/50 transition-all select-none group relative"
                    >
                      {/* Customer Name & Tier */}
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            setDetailCustomer(customer);
                            setIsDetailOpen(true);
                          }}
                        >
                          <p className="text-xs font-bold text-white group-hover:text-gold-300 transition-colors">
                            {customer.fullName}
                          </p>
                          <span className="text-[10px] font-mono text-slate-400">{customer.id}</span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold bg-dark-750 text-slate-300 border border-slate-700">
                          {customer.membershipTier}
                        </span>
                      </div>

                      {/* Source & Details */}
                      <div className="space-y-1 text-[11px] text-slate-400 my-2">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-500">Sumber:</span>
                          <span className="text-slate-300 font-medium capitalize">{j.sourceChannel}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-500">Masuk Tahap:</span>
                          <span className="text-slate-400">{formatDate(j.enteredStageAt)}</span>
                        </div>
                      </div>

                      {/* Last Note Snippet */}
                      {j.lastNotes && (
                        <div className="bg-dark-850/80 p-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-300 leading-snug line-clamp-2 italic">
                          &quot;{j.lastNotes}&quot;
                        </div>
                      )}

                      {/* Quick Move Button for Mobile / Accessibility */}
                      <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className={`text-[9px] flex items-center gap-1 font-semibold ${
                          customer.status === 'Aktif'
                            ? 'text-emerald-400'
                            : customer.status === 'Kurang Aktif'
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}>
                          <CheckCircle2 className="w-2.5 h-2.5" /> {customer.status}
                        </span>
                        
                        {/* Stage Selector Dropdown */}
                        <select
                          value={j.currentStage}
                          onChange={e => {
                            setSelectedCustId(customer.id);
                            setTargetStageAfterNote(e.target.value as JourneyStageKey);
                            setNoteContent(`Pindah tahapan ke ${e.target.value}`);
                            setIsNoteModalOpen(true);
                          }}
                          className="bg-dark-800 text-[10px] text-gold-300 border border-slate-700 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
                        >
                          {STAGES.map(s => (
                            <option key={s.key} value={s.key}>
                              Pindah ke: {s.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}

                {stageJourneys.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center p-4 text-center">
                    <p className="text-[11px] text-slate-500">Tarik kartu pelanggan ke sini</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Riwayat Perubahan Tahapan & Timeline Aktivitas Interaksi Section */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl mt-6">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-dark-850">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-400" />
              Riwayat Perubahan Tahapan & Timeline Interaksi
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Log audit perpindahan status journey dan catatan interaksi pelanggan
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-dark-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveAuditTab('history')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeAuditTab === 'history'
                  ? 'bg-gold-gradient text-dark-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Riwayat Perpindahan ({journeyHistory.length})
            </button>
            <button
              onClick={() => setActiveAuditTab('interactions')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeAuditTab === 'interactions'
                  ? 'bg-gold-gradient text-dark-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Catatan Interaksi ({interactions.length})
            </button>
          </div>
        </div>

        {activeAuditTab === 'history' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-dark-800/80 text-slate-400 border-b border-slate-700/80 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-3">Waktu</th>
                  <th className="p-3">Pelanggan</th>
                  <th className="p-3">Perpindahan Tahapan</th>
                  <th className="p-3">Catatan / Alasan</th>
                  <th className="p-3">Diubah Oleh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {journeyHistory.slice(0, 10).map(hist => {
                  const cust = customers.find(c => c.id === hist.customerId);
                  return (
                    <tr key={hist.id} className="hover:bg-dark-750/50">
                      <td className="p-3 text-slate-400 whitespace-nowrap text-[11px]">
                        {formatDateTime(hist.createdAt)}
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-white block">{cust?.fullName || hist.customerId}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{hist.customerId}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-dark-750 text-slate-400 border border-slate-700">
                            {hist.fromStage || 'AWAL'}
                          </span>
                          <ArrowRight className="w-3 h-3 text-gold-400" />
                          <span className="px-2 py-0.5 rounded text-[10px] bg-gold-500/20 text-gold-300 font-semibold border border-gold-500/30">
                            {hist.toStage}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-300 text-[11px] max-w-sm">
                        {hist.notes || '-'}
                      </td>
                      <td className="p-3 text-slate-400 text-[11px]">
                        {hist.changedBy || 'Sistem Otomatis'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {interactions.slice(0, 8).map(inter => {
              const cust = customers.find(c => c.id === inter.customerId);
              return (
                <div key={inter.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-dark-750/40 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{cust?.fullName || inter.customerId}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-dark-750 text-gold-300 border border-slate-700">
                        {inter.interactionType}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{inter.notes}</p>
                  </div>
                  <div className="text-right text-[11px] text-slate-400 shrink-0">
                    <p>{inter.staffName || 'Staff'}</p>
                    <p className="text-[10px] text-slate-500">{formatDateTime(inter.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stage Change Reason / Notes Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title="Catat Perubahan Tahapan Journey"
        subtitle={`Update tahapan menuju ${targetStageAfterNote || ''}`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Catatan Interaksi / Alasan Perpindahan
            </label>
            <textarea
              rows={3}
              value={noteContent}
              onChange={e => setNoteContent(e.target.value)}
              placeholder="e.g. Pelanggan telah berkunjung dan melakukan pembayaran transaksi..."
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="secondary" size="sm" onClick={() => setIsNoteModalOpen(false)}>
              Batal
            </Button>
            <Button variant="gold" size="sm" onClick={handleConfirmStageMove}>
              Simpan & Pindahkan
            </Button>
          </div>
        </div>
      </Modal>

      {/* Customer Detail Modal */}
      <CustomerDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        customer={detailCustomer}
      />
    </div>
  );
};

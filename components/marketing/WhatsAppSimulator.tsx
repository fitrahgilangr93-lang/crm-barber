'use client';

import React, { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  CheckCheck, 
  Smartphone, 
  Users, 
  Play, 
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Campaign, CampaignSegment } from '@/types';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

export const WhatsAppSimulator: React.FC = () => {
  const { campaigns, addCampaign, sendWhatsAppSimulation, customers, settings } = useAppStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [targetSegment, setTargetSegment] = useState<CampaignSegment>('at_risk');
  const [messageTemplate, setMessageTemplate] = useState(
    'Halo Bro {{nama}}! Salam ganteng dari The Royal Cut Barbershop. Nikmati diskon spesial pangkas rambut dengan kode promo {{kode_promo}}. Reservasi sekarang ya!'
  );
  const [isSending, setIsSending] = useState(false);
  const [selectedPreviewCampaign, setSelectedPreviewCampaign] = useState<Campaign>(campaigns[0]);

  // Segment count computation
  const getTargetCount = (seg: CampaignSegment) => {
    switch (seg) {
      case 'new': return customers.filter(c => c.totalVisits <= 1).length;
      case 'inactive_churn': return customers.filter(c => c.status === 'Tidak Aktif').length;
      case 'birthday_this_month': return customers.filter(c => c.birthDate && c.birthDate.includes('-11-')).length;
      case 'vip_platinum': return customers.filter(c => c.membershipTier === 'Platinum').length;
      case 'at_risk': return customers.filter(c => c.status === 'Kurang Aktif' || c.status === 'Tidak Aktif').length;
      default: return customers.length;
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !messageTemplate.trim()) {
      alert('Judul dan template pesan wajib diisi.');
      return;
    }

    const count = getTargetCount(targetSegment);
    const newCamp = addCampaign({
      title,
      targetSegment,
      channel: 'WhatsApp',
      messageTemplate,
      status: 'Draft',
      totalRecipients: count,
    });

    setSelectedPreviewCampaign(newCamp);
    setIsCreateOpen(false);
    setTitle('');
  };

  const handleBroadcast = async (campId: string) => {
    setIsSending(true);
    await sendWhatsAppSimulation(campId);
    setIsSending(false);
    alert('Simulasi pengiriman pesan broadcast WhatsApp berhasil dijalankan ke semua nomor target!');
  };

  // Preview replaced message
  const previewSampleName = customers[0]?.fullName || 'Dimas Pratama';
  const previewRenderedMessage = (selectedPreviewCampaign?.messageTemplate || messageTemplate)
    .replace(/{{nama}}/g, previewSampleName)
    .replace(/{{kode_promo}}/g, 'GANTENG20')
    .replace(/{{poin}}/g, '140');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Marketing & Promosi WhatsApp
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
              WA API Gateway
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Segmentasi pelanggan cerdas, broadcast kampanye promosi otomatis, dan preview simulasi pesan WhatsApp.
          </p>
        </div>

        <Button variant="gold" size="md" onClick={() => setIsCreateOpen(true)}>
          <Send className="w-4 h-4 mr-1.5" />
          <span>Buat Kampanye Baru</span>
        </Button>
      </div>

      {/* Gateway Simulation Status Banner */}
      <div className="glass-card rounded-2xl p-4 border border-emerald-500/30 bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <span className="font-bold text-emerald-300">
              Gateway Provider: {settings.whatsappGateway.provider}
            </span>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Status: <strong className="text-emerald-400">Mode Sandbox Simulation Aktif</strong> • Siap kirim broadcast simulasi tanpa memotong kuota pulsa
            </p>
          </div>
        </div>
        <span className="text-[10px] text-slate-500 font-mono bg-dark-900 px-2 py-1 rounded border border-slate-700">
          Token: {settings.whatsappGateway.tokenMasked}
        </span>
      </div>

      {/* Main Grid: Campaign List & Mobile Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Campaign List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-gold-400" /> Daftar Kampanye Promosi
              </span>
              <span className="text-slate-400 font-normal">{campaigns.length} Kampanye</span>
            </h4>

            <div className="space-y-3">
              {campaigns.map(camp => {
                const isSelected = selectedPreviewCampaign?.id === camp.id;

                return (
                  <div
                    key={camp.id}
                    onClick={() => setSelectedPreviewCampaign(camp)}
                    className={`p-4 rounded-xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-dark-800 border-gold-400 shadow-lg shadow-gold-500/10'
                        : 'bg-dark-850/70 border-slate-700/60 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="font-bold text-white text-sm">{camp.title}</h5>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-dark-750 text-gold-300 border border-gold-500/20 font-semibold uppercase">
                            Target: {camp.targetSegment.replace('_', ' ')}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {camp.totalRecipients} Kontak Penerima
                          </span>
                        </div>
                      </div>

                      <Badge
                        variant={camp.status === 'Selesai' ? 'success' : camp.status === 'Berjalan' ? 'warning' : 'neutral'}
                      >
                        {camp.status}
                      </Badge>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2.5 line-clamp-2 bg-dark-900/60 p-2 rounded-lg border border-slate-800">
                      {camp.messageTemplate}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">
                        {camp.deliveredCount}/{camp.totalRecipients} Pesan Terkirim
                      </span>

                      {camp.status !== 'Selesai' && (
                        <Button
                          size="sm"
                          variant="gold"
                          isLoading={isSending}
                          onClick={e => {
                            e.stopPropagation();
                            handleBroadcast(camp.id);
                          }}
                          className="text-xs"
                        >
                          <Play className="w-3 h-3 mr-1 fill-dark-950" />
                          Kirim Broadcast Sekarang
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Realistic WhatsApp Mobile Mockup (5 cols) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-[340px] rounded-[38px] bg-dark-950 border-4 border-slate-700 p-3 shadow-2xl relative overflow-hidden">
            {/* Phone Speaker Notch */}
            <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-2" />

            {/* WA Header */}
            <div className="bg-[#075E54] text-white p-3 rounded-t-2xl flex items-center gap-2.5 shadow">
              <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-dark-950">
                RC
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">The Royal Cut Barbershop</p>
                <p className="text-[9px] text-emerald-200">Akun WhatsApp Resmi (Centang Hijau)</p>
              </div>
            </div>

            {/* WA Chat Body */}
            <div className="bg-[#0B141A] p-3 min-h-[360px] flex flex-col justify-end space-y-2 rounded-b-2xl">
              <div className="self-center bg-[#182229] text-slate-400 text-[9px] px-2 py-0.5 rounded-full mb-4">
                HARI INI
              </div>

              {/* Message Bubble (WhatsApp Green Bubble) */}
              <div className="self-end bg-[#005C4B] text-white p-3 rounded-2xl rounded-tr-none max-w-[90%] text-xs shadow-md space-y-2">
                <p className="text-[11px] leading-relaxed whitespace-pre-wrap">
                  {previewRenderedMessage}
                </p>
                <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-200">
                  <span>10:30</span>
                  <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />
                </div>
              </div>
            </div>

            <p className="text-center text-[10px] text-slate-500 mt-2 font-mono">
              Live WhatsApp Simulation Preview
            </p>
          </div>
        </div>
      </div>

      {/* Modal: Create Campaign */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Buat Kampanye Promosi Baru"
        subtitle="Rancang pesan WhatsApp dengan segmentasi target penerima otomatis"
        maxWidth="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Judul Kampanye <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Diskon Reaktivasi Pelanggan Akhir Pekan"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Target Segmentasi Pelanggan
            </label>
            <select
              value={targetSegment}
              onChange={e => setTargetSegment(e.target.value as CampaignSegment)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            >
              <option value="all">Semua Pelanggan ({getTargetCount('all')} kontak)</option>
              <option value="new">Pelanggan Baru ({getTargetCount('new')} kontak)</option>
              <option value="at_risk">Pelanggan Kurang Aktif & Berisiko Churn ({getTargetCount('at_risk')} kontak)</option>
              <option value="birthday_this_month">Ulang Tahun Bulan Ini ({getTargetCount('birthday_this_month')} kontak)</option>
              <option value="vip_platinum">Royal Platinum VIP ({getTargetCount('vip_platinum')} kontak)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Template Pesan WhatsApp
            </label>
            <textarea
              rows={4}
              required
              value={messageTemplate}
              onChange={e => setMessageTemplate(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400 leading-relaxed font-mono"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10px] text-slate-400">Variabel Dinamis:</span>
              {['{{nama}}', '{{poin}}', '{{kode_promo}}'].map(tag => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setMessageTemplate(prev => prev + ' ' + tag)}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-dark-750 text-gold-300 border border-gold-500/30 hover:bg-gold-500/20 cursor-pointer"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsCreateOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="gold" size="sm">
              Simpan Kampanye
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

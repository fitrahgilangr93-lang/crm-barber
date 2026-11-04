'use client';

import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Scissors, 
  UserCheck, 
  Award, 
  CheckCircle2,
  GitBranch,
  BarChart3,
  Users,
  Clock,
  Filter
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatRupiah, formatDate, exportToCSV, exportToExcel, exportToPDF, computeRFMScores } from '@/lib/utils';

export type ReportType = 
  | 'revenue' 
  | 'transactions' 
  | 'new_customers' 
  | 'returning_customers' 
  | 'visits' 
  | 'services' 
  | 'barbers' 
  | 'membership' 
  | 'journey' 
  | 'rfm' 
  | 'retention';

export const ReportsView: React.FC = () => {
  const { transactions, customers, barbers, services, appointments, journeys, vouchers } = useAppStore();
  const [activeReportTab, setActiveReportTab] = useState<ReportType>('revenue');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'month' | 'year'>('month');

  // Compute metrics
  const totalRevenue = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
  const totalDiscount = transactions.reduce((sum, t) => sum + t.discountAmount, 0);
  const avgOrderValue = transactions.length > 0 ? Math.round(totalRevenue / transactions.length) : 0;

  const rfmScores = computeRFMScores(customers, transactions);

  const REPORT_DEFINITIONS: { key: ReportType; label: string; icon: any }[] = [
    { key: 'revenue', label: '1. Pendapatan Finansial', icon: DollarSign },
    { key: 'transactions', label: '2. Transaksi Kasir', icon: TrendingUp },
    { key: 'new_customers', label: '3. Pelanggan Baru', icon: Users },
    { key: 'returning_customers', label: '4. Pelanggan Lama (Repeat)', icon: Users },
    { key: 'visits', label: '5. Kunjungan & Antrean', icon: Clock },
    { key: 'services', label: '6. Layanan Terpopuler', icon: Scissors },
    { key: 'barbers', label: '7. Performa & Komisi Barber', icon: UserCheck },
    { key: 'membership', label: '8. Membership & Poin', icon: Award },
    { key: 'journey', label: '9. Customer Journey', icon: GitBranch },
    { key: 'rfm', label: '10. Analisis RFM', icon: BarChart3 },
    { key: 'retention', label: '11. Retensi & Churn Risk', icon: CheckCircle2 },
  ];

  // Helper to extract report rows for active tab
  const getReportData = (): {
    title: string;
    headers: string[];
    rows: (string | number | undefined)[][];
    raw: Record<string, any>[];
  } => {
    switch (activeReportTab) {
      case 'revenue':
      case 'transactions':
        return {
          title: 'Laporan Transaksi Kasir & Pendapatan',
          headers: ['Invoice', 'Tanggal', 'Pelanggan', 'Barber', 'Metode Bayar', 'Subtotal', 'Diskon', 'Total Akhir'],
          rows: transactions.map(t => [
            t.invoiceNumber,
            formatDate(t.createdAt),
            t.customerName || 'Tamu Walk-in',
            t.barberName || 'Staff Barber',
            t.paymentMethod,
            formatRupiah(t.subtotal),
            t.discountAmount > 0 ? `-${formatRupiah(t.discountAmount)}` : 'Rp 0',
            formatRupiah(t.totalAmount),
          ]),
          raw: transactions.map(t => ({
            Invoice: t.invoiceNumber,
            Tanggal: formatDate(t.createdAt),
            Pelanggan: t.customerName,
            Barber: t.barberName,
            Metode_Bayar: t.paymentMethod,
            Subtotal: t.subtotal,
            Diskon: t.discountAmount,
            Total: t.totalAmount,
          })),
        };

      case 'new_customers': {
        const newCusts = customers.filter(c => c.totalVisits <= 1);
        return {
          title: 'Laporan Pelanggan Baru',
          headers: ['ID', 'Nama Pelanggan', 'No WhatsApp', 'Sumber', 'Tanggal Daftar', 'Tier', 'Status'],
          rows: newCusts.map(c => [
            c.id,
            c.fullName,
            c.whatsapp,
            c.sourceId,
            formatDate(c.createdAt),
            c.membershipTier,
            c.status,
          ]),
          raw: newCusts.map(c => ({
            ID: c.id,
            Nama: c.fullName,
            WhatsApp: c.whatsapp,
            Sumber: c.sourceId,
            Tanggal_Daftar: formatDate(c.createdAt),
            Tier: c.membershipTier,
            Status: c.status,
          })),
        };
      }

      case 'returning_customers': {
        const retCusts = customers.filter(c => c.totalVisits > 1);
        return {
          title: 'Laporan Pelanggan Lama / Repeat',
          headers: ['ID', 'Nama Pelanggan', 'Total Kunjungan', 'Total Belanja', 'Kunjungan Terakhir', 'Tier', 'Status'],
          rows: retCusts.map(c => [
            c.id,
            c.fullName,
            `${c.totalVisits} kali`,
            formatRupiah(c.totalSpend),
            formatDate(c.lastVisitAt),
            c.membershipTier,
            c.status,
          ]),
          raw: retCusts.map(c => ({
            ID: c.id,
            Nama: c.fullName,
            Kunjungan: c.totalVisits,
            Total_Belanja: c.totalSpend,
            Terakhir_Kunjungan: formatDate(c.lastVisitAt),
            Tier: c.membershipTier,
            Status: c.status,
          })),
        };
      }

      case 'visits':
        return {
          title: 'Laporan Kunjungan & Reservasi Antrean',
          headers: ['Antrean', 'Tanggal', 'Jam', 'Pelanggan', 'Layanan', 'Barber', 'Durasi', 'Status'],
          rows: appointments.map(a => [
            a.queueNumber,
            formatDate(a.appointmentDate),
            `${a.startTime} - ${a.endTime}`,
            a.customerName,
            a.serviceName,
            a.barberName,
            `${a.serviceDuration} mnt`,
            a.status,
          ]),
          raw: appointments.map(a => ({
            Antrean: a.queueNumber,
            Tanggal: a.appointmentDate,
            Jam: `${a.startTime}-${a.endTime}`,
            Pelanggan: a.customerName,
            Layanan: a.serviceName,
            Barber: a.barberName,
            Status: a.status,
          })),
        };

      case 'services':
        return {
          title: 'Laporan Menu Layanan Terpopuler',
          headers: ['ID', 'Nama Layanan', 'Kategori', 'Harga Satuan', 'Durasi', 'Status'],
          rows: services.map(s => [
            s.id,
            s.name,
            s.category,
            formatRupiah(s.price),
            `${s.durationMinutes} menit`,
            s.isActive ? 'Aktif' : 'Nonaktif',
          ]),
          raw: services.map(s => ({
            ID: s.id,
            Layanan: s.name,
            Kategori: s.category,
            Harga: s.price,
            Durasi: s.durationMinutes,
            Status: s.isActive ? 'Aktif' : 'Nonaktif',
          })),
        };

      case 'barbers':
        return {
          title: 'Laporan Performa & Komisi Tim Barber',
          headers: ['Nama Barber', 'Spesialisasi', 'Pelanggan Dilayani', 'Total Omset', 'Komisi (%)', 'Rating Rata-rata', 'Status'],
          rows: barbers.map(b => [
            b.name,
            b.specialization,
            `${b.totalCustomersServed} orang`,
            formatRupiah(b.totalRevenueGenerated),
            `${b.commissionRate}%`,
            `${b.averageRating} / 5.0`,
            b.status,
          ]),
          raw: barbers.map(b => ({
            Nama: b.name,
            Spesialisasi: b.specialization,
            Pelanggan_Dilayani: b.totalCustomersServed,
            Total_Omset: b.totalRevenueGenerated,
            Komisi: `${b.commissionRate}%`,
            Rating: b.averageRating,
            Status: b.status,
          })),
        };

      case 'membership':
        return {
          title: 'Laporan Membership & Poin Loyalitas',
          headers: ['ID', 'Nama Pelanggan', 'Tier Membership', 'Saldo Poin', 'Total Belanja', 'Frekuensi Kunjungan'],
          rows: customers.map(c => [
            c.id,
            c.fullName,
            c.membershipTier,
            `${c.loyaltyPoints} Pts`,
            formatRupiah(c.totalSpend),
            `${c.totalVisits}x`,
          ]),
          raw: customers.map(c => ({
            ID: c.id,
            Nama: c.fullName,
            Tier: c.membershipTier,
            Poin: c.loyaltyPoints,
            Total_Belanja: c.totalSpend,
            Kunjungan: c.totalVisits,
          })),
        };

      case 'journey':
        return {
          title: 'Laporan Customer Journey Pipeline',
          headers: ['ID Pelanggan', 'Tahapan Saat Ini', 'Kanal Sumber', 'Tanggal Masuk Tahap', 'Catatan Terakhir'],
          rows: journeys.map(j => {
            const cust = customers.find(c => c.id === j.customerId);
            return [
              cust?.fullName || j.customerId,
              j.currentStage,
              j.sourceChannel,
              formatDate(j.enteredStageAt),
              j.lastNotes || '-',
            ];
          }),
          raw: journeys.map(j => ({
            Pelanggan: j.customerId,
            Tahapan: j.currentStage,
            Sumber: j.sourceChannel,
            Masuk_Tahap: formatDate(j.enteredStageAt),
            Catatan: j.lastNotes,
          })),
        };

      case 'rfm':
        return {
          title: 'Laporan Analisis RFM Pelanggan',
          headers: ['Pelanggan', 'Segmen RFM', 'Skor R-F-M', 'Recency (Hari)', 'Frekuensi', 'Total Belanja', 'Rekomendasi'],
          rows: rfmScores.map(s => [
            s.customerName,
            s.segment,
            s.overallScore,
            `${s.recencyDays} hari`,
            `${s.frequencyCount} kali`,
            formatRupiah(s.monetaryAmount),
            s.actionRecommendation,
          ]),
          raw: rfmScores.map(s => ({
            Pelanggan: s.customerName,
            Segmen: s.segment,
            Skor_RFM: s.overallScore,
            Recency_Hari: s.recencyDays,
            Frekuensi: s.frequencyCount,
            Total_Belanja: s.monetaryAmount,
            Rekomendasi: s.actionRecommendation,
          })),
        };

      case 'retention': {
        const atRiskCusts = rfmScores.filter(s => s.segment === 'At Risk' || s.segment === 'Hibernating' || s.segment === 'Lost Customers');
        return {
          title: 'Laporan Retensi & Analisis Pelanggan Churn Risk',
          headers: ['Pelanggan', 'WhatsApp', 'Segmen', 'Hari Tanpa Kunjungan', 'Riwayat Kunjungan', 'Rekomendasi Reaktivasi'],
          rows: atRiskCusts.map(s => [
            s.customerName,
            s.whatsapp,
            s.segment,
            `${s.recencyDays} hari lalu`,
            `${s.frequencyCount} kali`,
            s.actionRecommendation,
          ]),
          raw: atRiskCusts.map(s => ({
            Pelanggan: s.customerName,
            WhatsApp: s.whatsapp,
            Segmen: s.segment,
            Hari_Tanpa_Kunjungan: s.recencyDays,
            Kunjungan: s.frequencyCount,
            Rekomendasi: s.actionRecommendation,
          })),
        };
      }
    }
  };

  const currentReport = getReportData();

  const handleExport = (type: 'xlsx' | 'csv' | 'pdf') => {
    const filename = `Laporan_BarberCRM_${activeReportTab}_${new Date().toISOString().slice(0, 10)}`;

    if (type === 'xlsx') {
      exportToExcel(filename, activeReportTab, currentReport.raw);
    } else if (type === 'csv') {
      exportToCSV(filename, currentReport.raw);
    } else {
      exportToPDF(filename, currentReport.title, currentReport.headers, currentReport.rows);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Laporan Bisnis & Ekspor Data
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 font-semibold">
              11 Kategori Lengkap
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Laporan finansial, journey pipeline, retensi RFM, performa barber, dan ekspor instan ke Excel, CSV, atau PDF.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleExport('xlsx')}
            className="text-xs"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1 text-emerald-400" />
            Ekspor Excel
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleExport('csv')}
            className="text-xs"
          >
            <Download className="w-4 h-4 mr-1 text-gold-400" />
            Ekspor CSV
          </Button>
          <Button
            variant="gold"
            size="sm"
            onClick={() => handleExport('pdf')}
            className="text-xs"
          >
            <Printer className="w-4 h-4 mr-1" />
            Ekspor PDF
          </Button>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Total Akumulasi Pendapatan</span>
          <p className="text-2xl font-black gold-text-gradient mt-1">{formatRupiah(totalRevenue)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Dari {transactions.length} transaksi kasir tercatat</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Rata-rata Pengeluaran per Transaksi (AOV)</span>
          <p className="text-2xl font-black text-white mt-1">{formatRupiah(avgOrderValue)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Basket size rata-rata pelanggan</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Total Diskon & Reward Diberikan</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{formatRupiah(totalDiscount)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Insentif loyalitas & voucher VIP</p>
        </div>
      </div>

      {/* 11 Reports Category Selector Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Pilih Jenis Laporan (11 Laporan Lengkap Sesuai Spesifikasi):
        </label>
        <div className="flex flex-wrap gap-2 pb-2">
          {REPORT_DEFINITIONS.map(tab => {
            const Icon = tab.icon;
            const isSelected = activeReportTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveReportTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-gold-500/20 text-gold-300 border-gold-400 shadow-sm'
                    : 'bg-dark-850 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-gold-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Report Table Content */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-dark-850">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>{currentReport.title}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-750 text-gold-300 border border-slate-700">
              {currentReport.rows.length} Baris Data
            </span>
          </h4>
          <span className="text-xs text-slate-400">
            Format Siap Unduh: Excel / CSV / PDF
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-dark-800 text-slate-400 border-b border-slate-700/80 uppercase text-[10px] font-semibold">
              <tr>
                {currentReport.headers.map((h, idx) => (
                  <th key={idx} className="p-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {currentReport.rows.slice(0, 30).map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-dark-750/50">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3 text-slate-200 whitespace-nowrap text-[11px]">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

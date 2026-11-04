'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  DollarSign, 
  ShoppingBag, 
  CalendarDays, 
  Clock, 
  ArrowRight, 
  Star, 
  Crown,
  Sparkles,
  TrendingUp,
  Receipt,
  Activity,
  MessageSquare,
  Scissors
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { CustomerGrowthChart } from '@/components/charts/CustomerGrowthChart';
import { VisitsTrendChart } from '@/components/charts/VisitsTrendChart';
import { ServicePopularityChart } from '@/components/charts/ServicePopularityChart';
import { NewVsReturningChart } from '@/components/charts/NewVsReturningChart';
import { formatRupiah, formatDate, formatDateTime } from '@/lib/utils';

export default function DashboardPage() {
  const { customers, barbers, services, appointments, transactions, interactions } = useAppStore();
  const [periodFilter, setPeriodFilter] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  const todayStr = '2026-11-04'; // Reference today
  const todayDate = new Date(todayStr);

  // Dynamic calculations based on periodFilter
  const filteredTransactions = transactions.filter(t => {
    const txDate = new Date(t.createdAt);
    if (periodFilter === 'daily') {
      return t.createdAt.startsWith(todayStr);
    } else if (periodFilter === 'weekly') {
      const diffDays = (todayDate.getTime() - txDate.getTime()) / (1000 * 3600 * 24);
      return diffDays >= 0 && diffDays <= 7;
    } else if (periodFilter === 'monthly') {
      return t.createdAt.startsWith('2026-11') || t.createdAt.startsWith('2026-10');
    } else {
      return t.createdAt.startsWith('2026');
    }
  });

  const periodRevenue = filteredTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
  const periodTxCount = filteredTransactions.length;

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'Aktif').length;
  const inactiveCustomers = customers.filter(c => c.status === 'Tidak Aktif').length;

  // New customers filtered by period
  const newCustomersInPeriod = customers.filter(c => {
    if (periodFilter === 'daily') {
      return c.createdAt.startsWith(todayStr);
    } else if (periodFilter === 'weekly') {
      const diffDays = (todayDate.getTime() - new Date(c.createdAt).getTime()) / (1000 * 3600 * 24);
      return diffDays >= 0 && diffDays <= 7;
    } else if (periodFilter === 'monthly') {
      return c.totalVisits <= 1;
    } else {
      return c.createdAt.startsWith('2026');
    }
  }).length;

  // Appointments & visits
  const todayAppointments = appointments.filter(a => a.appointmentDate === todayStr);
  const todayVisits = todayAppointments.filter(a => a.status === 'Selesai' || a.status === 'Sedang Dilayani').length;

  const periodLabelMap = {
    daily: 'Hari Ini',
    weekly: 'Minggu Ini',
    monthly: 'Bulan Ini',
    yearly: 'Tahun Ini',
  };

  // Top Barbers sorted by revenue
  const topBarbers = [...barbers].sort((a, b) => b.totalRevenueGenerated - a.totalRevenueGenerated).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Banner & Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Dashboard Utama
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 font-semibold">
              The Royal Cut
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ringkasan performa bisnis, kesehatan retensi pelanggan, dan arus transaksi ({periodLabelMap[periodFilter]}).
          </p>
        </div>

        {/* Period Filter Selector */}
        <div className="flex items-center gap-1 p-1 bg-dark-850 rounded-xl border border-slate-700/60 text-xs">
          {[
            { key: 'daily', label: 'Hari Ini' },
            { key: 'weekly', label: 'Minggu Ini' },
            { key: 'monthly', label: 'Bulan Ini' },
            { key: 'yearly', label: 'Tahun Ini' },
          ].map(p => (
            <button
              key={p.key}
              onClick={() => setPeriodFilter(p.key as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                periodFilter === p.key
                  ? 'bg-gold-gradient text-dark-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 8 Statistic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pelanggan"
          value={totalCustomers}
          trend={{ value: '+14.2%', isPositive: true }}
          icon={Users}
          iconColor="text-gold-400"
        />

        <StatCard
          title={`Pelanggan Baru (${periodLabelMap[periodFilter]})`}
          value={newCustomersInPeriod}
          subtitle={`Periode ${periodLabelMap[periodFilter]}`}
          icon={UserPlus}
          iconColor="text-cyan-400"
        />

        <StatCard
          title="Pelanggan Aktif"
          value={activeCustomers}
          trend={{ value: `${Math.round((activeCustomers / totalCustomers) * 100)}%`, isPositive: true }}
          icon={UserCheck}
          iconColor="text-emerald-400"
        />

        <StatCard
          title="Pelanggan Tidak Aktif (Churn)"
          value={inactiveCustomers}
          subtitle="Perlu reaktivasi WA"
          icon={UserX}
          iconColor="text-rose-400"
        />

        <StatCard
          title={`Pendapatan (${periodLabelMap[periodFilter]})`}
          value={formatRupiah(periodRevenue)}
          trend={{ value: '+18.5%', isPositive: true }}
          icon={DollarSign}
          iconColor="text-gold-400"
        />

        <StatCard
          title={`Total Transaksi (${periodLabelMap[periodFilter]})`}
          value={periodTxCount}
          subtitle="Sukses terbayar"
          icon={ShoppingBag}
          iconColor="text-blue-400"
        />

        <StatCard
          title="Kunjungan Hari Ini"
          value={`${todayVisits} Orang`}
          subtitle="Sedang & Selesai"
          icon={Clock}
          iconColor="text-purple-400"
        />

        <StatCard
          title="Reservasi Hari Ini"
          value={`${todayAppointments.length} Antrean`}
          subtitle="Slot terjadwal"
          icon={CalendarDays}
          iconColor="text-amber-400"
        />
      </div>

      {/* 5 Charts as specified in prompt Section 4 */}
      {/* Row 1: Monthly Revenue & Customer Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Revenue Chart (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-slate-800 shadow-xl">
          <RevenueChart />
        </div>

        {/* Right: Customer Growth Curve (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-slate-800 shadow-xl">
          <CustomerGrowthChart />
        </div>
      </div>

      {/* Row 2: Visits Trend Chart & Popular Services */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Visits Trend Chart (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-slate-800 shadow-xl">
          <VisitsTrendChart period={periodFilter} />
        </div>

        {/* Right: Top Services Breakdown (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-slate-800 shadow-xl">
          <ServicePopularityChart />
        </div>
      </div>

      {/* Row 3: New vs Returning Customers Ratio */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Grafik Komposisi Pelanggan Baru vs Pelanggan Lama (Repeat)
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Rasio retensi kunjungan ulang pelanggan barbershop</p>
          </div>
          <span className="text-xs text-gold-400 font-semibold">
            Tingkat Retensi: {Math.round(((totalCustomers - newCustomersInPeriod) / totalCustomers) * 100)}%
          </span>
        </div>
        <div className="py-4">
          <NewVsReturningChart 
            newCount={newCustomersInPeriod || 8} 
            returningCount={Math.max(1, totalCustomers - newCustomersInPeriod)} 
          />
        </div>
      </div>

      {/* 4 Additional Sections as specified in prompt Section 4:
          1. Transaksi terbaru
          2. Reservasi hari ini
          3. Barber dengan performa terbaik
          4. Aktivitas pelanggan terbaru
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 1. Reservasi Hari Ini (3 cols) */}
        <div className="lg:col-span-3 glass-card rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-gold-400" /> Reservasi Hari Ini
            </h4>
            <Link href="/appointments" className="text-xs text-gold-400 hover:underline">
              Semua
            </Link>
          </div>

          <div className="space-y-2.5">
            {todayAppointments.slice(0, 5).map(apt => (
              <div key={apt.id} className="p-3 rounded-xl bg-dark-850/80 border border-slate-700/50 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-gold-400">{apt.queueNumber}</span>
                  <Badge variant={apt.status === 'Selesai' ? 'success' : apt.status === 'Sedang Dilayani' ? 'warning' : 'info'} size="sm">
                    {apt.status}
                  </Badge>
                </div>
                <p className="font-bold text-white text-xs mt-1">{apt.customerName}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>{apt.serviceName}</span>
                  <span className="text-slate-300 font-medium">{apt.startTime} WIB</span>
                </div>
              </div>
            ))}
            {todayAppointments.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4">Belum ada antrean untuk hari ini.</p>
            )}
          </div>
        </div>

        {/* 2. Transaksi Kasir Terbaru (3 cols) */}
        <div className="lg:col-span-3 glass-card rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-gold-400" /> Transaksi Terbaru
            </h4>
            <Link href="/pos" className="text-xs text-gold-400 hover:underline">
              Ke Kasir
            </Link>
          </div>

          <div className="space-y-2.5">
            {transactions.slice(0, 5).map(tx => (
              <div key={tx.id} className="p-3 rounded-xl bg-dark-850/80 border border-slate-700/50 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-gold-300 text-[11px]">{tx.invoiceNumber}</span>
                    <span className="text-[10px] px-1 py-0.2 rounded bg-dark-750 text-slate-400 border border-slate-700">
                      {tx.paymentMethod}
                    </span>
                  </div>
                  <p className="font-bold text-white mt-1 truncate max-w-[120px]">{tx.customerName}</p>
                  <p className="text-[10px] text-slate-500">{formatDate(tx.createdAt)}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white text-xs">{formatRupiah(tx.totalAmount)}</span>
                  <span className="text-[10px] text-emerald-400 block font-semibold mt-0.5">Lunas</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Barber Terbaik (3 cols) */}
        <div className="lg:col-span-3 glass-card rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-gold-400" /> Barber Terbaik
            </h4>
            <Link href="/barbers" className="text-xs text-gold-400 hover:underline">
              Semua
            </Link>
          </div>

          <div className="space-y-3">
            {topBarbers.map(b => (
              <div key={b.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-dark-850/60 border border-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.avatarUrl} alt={b.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs text-white truncate">{b.name}</p>
                  <p className="text-[10px] text-amber-400 flex items-center font-bold">
                    <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                    {b.averageRating} • {b.totalCustomersServed} cust
                  </p>
                  <p className="text-[10px] text-gold-400 font-semibold">{formatRupiah(b.totalRevenueGenerated)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Aktivitas Pelanggan Terbaru (3 cols) - Prompt Section 4 requirement */}
        <div className="lg:col-span-3 glass-card rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> Aktivitas Pelanggan
            </h4>
            <Link href="/journey" className="text-xs text-gold-400 hover:underline">
              Journey
            </Link>
          </div>

          <div className="space-y-2.5">
            {interactions.slice(0, 5).map(item => {
              const cust = customers.find(c => c.id === item.customerId);
              return (
                <div key={item.id} className="p-3 rounded-xl bg-dark-850/80 border border-slate-700/50 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate">{cust?.fullName || item.customerId}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-dark-750 text-gold-300 font-medium border border-slate-700">
                      {item.interactionType}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {item.notes}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 pt-1 border-t border-slate-800">
                    <span>{item.staffName || 'Staff'}</span>
                    <span>{formatDateTime(item.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

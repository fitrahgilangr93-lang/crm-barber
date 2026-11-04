'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  PlusCircle,
  ShoppingBag,
  RotateCcw,
  Sparkles,
  Calendar,
  Clock,
  User as UserIcon,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export const Header: React.FC = () => {
  const router = useRouter();
  const { currentUser, customers, resetDemoData } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Filtered live search results
  const searchResults = searchQuery.trim()
    ? customers.filter(
        c =>
          c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.whatsapp.includes(searchQuery) ||
          c.id.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const notifications = [
    { id: 1, title: 'Booking Baru', msg: 'Dimas Aditya booking Signature Cut jam 10:00', time: '10m lalu', isNew: true },
    { id: 2, title: 'Ulasan Bintang 5', msg: 'Raditya Dika memberikan rating 5.0 untuk Barber Eko', time: '1j lalu', isNew: true },
    { id: 3, title: 'Reminder Ultah', msg: 'Pandu Wicaksono berulang tahun bulan November ini', time: '3j lalu', isNew: false },
  ];

  return (
    <header className="h-16 border-b border-slate-800/80 bg-dark-900/90 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Search Bar with Autocomplete Dropdown */}
      <div className="relative flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pelanggan (nama, No WA, ID)..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full bg-dark-800 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-gold-400/60 transition-colors"
          />
        </div>

        {/* Live Search Autocomplete Dropdown */}
        {isSearchOpen && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-dark-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in duration-150">
            <p className="text-[10px] text-slate-400 px-2 py-1 font-semibold uppercase">Hasil Pencarian Pelanggan:</p>
            {searchResults.length > 0 ? (
              searchResults.map(c => (
                <div
                  key={c.id}
                  onClick={() => {
                    router.push(`/customers?id=${c.id}`);
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="p-2 rounded-lg hover:bg-dark-750 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <p className="font-semibold text-slate-200">{c.fullName}</p>
                    <p className="text-[11px] text-slate-400">{c.whatsapp} • ID: {c.id}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 font-medium">
                    {c.membershipTier}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 p-2 text-center">Tidak ditemukan pelanggan yang cocok.</p>
            )}
          </div>
        )}
      </div>

      {/* Barbershop Status Badge */}
      <div className="hidden lg:flex items-center gap-3 text-xs bg-dark-800/60 border border-slate-800 px-3 py-1.5 rounded-xl">
        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Buka (10:00 - 21:00)
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-gold-400" />
          {formatDate(new Date().toISOString())}
        </span>
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        {/* Reset Demo Data Button */}
        <button
          onClick={() => {
            if (confirm('Reset semua data demo ke kondisi awal?')) {
              resetDemoData();
              alert('Data demo berhasil direset ke kondisi awal!');
            }
          }}
          title="Reset Data Demo"
          className="p-2 text-slate-400 hover:text-gold-400 hover:bg-dark-800 rounded-xl border border-transparent hover:border-slate-700 transition-colors cursor-pointer hidden sm:flex items-center gap-1.5 text-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden xl:inline">Reset Demo</span>
        </button>

        {/* Quick POS Button - hidden for staff barber */}
        {currentUser.role !== 'barber' && (
          <Link href="/pos">
            <Button size="sm" variant="gold" className="text-xs">
              <ShoppingBag className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Kasir POS</span>
            </Button>
          </Link>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 text-slate-300 hover:text-white bg-dark-800 hover:bg-dark-750 rounded-xl border border-slate-700/60 relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold-400 ring-2 ring-dark-900" />
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-dark-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" /> Notifikasi Terbaru
                </span>
                <span className="text-[10px] text-gold-400 font-medium">3 Baru</span>
              </div>
              <div className="space-y-2">
                {notifications.map(n => (
                  <div key={n.id} className="p-2 rounded-lg bg-dark-800/80 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-200">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-500 font-normal">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{n.msg}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar / User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-dark-800 border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gold-gradient p-[1px]">
              <div className="w-full h-full rounded-full bg-dark-900 flex items-center justify-center overflow-hidden">
                {currentUser.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4 text-gold-400" />
                )}
              </div>
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-slate-100">{currentUser.fullName}</p>
              <p className="text-[10px] text-gold-400 font-medium capitalize">{currentUser.role.replace('_', ' ')}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-dark-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in duration-150">
              <div className="px-3 py-2 border-b border-slate-800 mb-1">
                <p className="text-xs font-bold text-white truncate">{currentUser.fullName}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
              </div>
              <Link
                href="/login"
                onClick={() => setIsProfileOpen(false)}
                className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Halaman Login</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

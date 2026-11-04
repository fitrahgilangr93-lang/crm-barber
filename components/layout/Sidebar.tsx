'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GitBranch,
  CalendarDays,
  ShoppingBag,
  Scissors,
  UserCheck,
  Award,
  Send,
  BarChart3,
  Star,
  FileSpreadsheet,
  Settings,
  ShieldCheck,
  ChevronDown,
  X,
  Menu,
  Crown
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, switchUserRole } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      allowedRoles: ['super_admin', 'admin_barber', 'barber'],
    },
    {
      label: 'Database Pelanggan',
      href: '/customers',
      icon: Users,
      allowedRoles: ['super_admin', 'admin_barber'],
    },
    {
      label: 'Customer Journey',
      href: '/journey',
      icon: GitBranch,
      allowedRoles: ['super_admin', 'admin_barber'],
      badge: 'Kanban',
    },
    {
      label: 'Reservasi & Antrean',
      href: '/appointments',
      icon: CalendarDays,
      allowedRoles: ['super_admin', 'admin_barber', 'barber'],
    },
    {
      label: 'Kasir POS & Transaksi',
      href: '/pos',
      icon: ShoppingBag,
      allowedRoles: ['super_admin', 'admin_barber'],
      badge: 'Kasir',
    },
    {
      label: 'Katalog Layanan',
      href: '/services',
      icon: Scissors,
      allowedRoles: ['super_admin', 'admin_barber'],
    },
    {
      label: 'Manajemen Barber',
      href: '/barbers',
      icon: UserCheck,
      allowedRoles: ['super_admin', 'admin_barber', 'barber'],
    },
    {
      label: 'Membership & Loyalty',
      href: '/loyalty',
      icon: Award,
      allowedRoles: ['super_admin', 'admin_barber'],
    },
    {
      label: 'Marketing WhatsApp',
      href: '/marketing',
      icon: Send,
      allowedRoles: ['super_admin', 'admin_barber'],
      badge: 'WA API',
    },
    {
      label: 'Analitik RFM & Churn',
      href: '/analytics',
      icon: BarChart3,
      allowedRoles: ['super_admin', 'admin_barber'],
    },
    {
      label: 'Ulasan & Feedback',
      href: '/reviews',
      icon: Star,
      allowedRoles: ['super_admin', 'admin_barber', 'barber'],
    },
    {
      label: 'Laporan & Ekspor',
      href: '/reports',
      icon: FileSpreadsheet,
      allowedRoles: ['super_admin', 'admin_barber'],
    },
    {
      label: 'Pengaturan',
      href: '/settings',
      icon: Settings,
      allowedRoles: ['super_admin'],
    },
  ];

  const roleLabelMap: Record<UserRole, { label: string; badgeColor: string }> = {
    super_admin: { label: 'Super Admin', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    admin_barber: { label: 'Admin Barbershop', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
    barber: { label: 'Barber Staff', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  };

  const navContent = (
    <div className="flex flex-col h-full bg-dark-900 border-r border-slate-800/80 w-64 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gold-gradient p-[1px] shadow-lg shadow-gold-500/20">
            <div className="w-full h-full bg-dark-950 rounded-[11px] flex items-center justify-center group-hover:bg-transparent transition-colors">
              <Crown className="w-5 h-5 text-gold-400 group-hover:text-dark-950 transition-colors" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-wider text-white flex items-center gap-1.5">
              BARBER <span className="gold-text-gradient font-black">CRM</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">The Royal Cut</p>
          </div>
        </Link>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Role Switcher Widget (Essential for 1-click Demo Evaluation) */}
      <div className="p-3 mx-3 my-2 rounded-xl bg-dark-800/90 border border-slate-700/60 relative">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" /> Mode Hak Akses
          </span>
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="text-[11px] text-gold-400 hover:underline flex items-center gap-0.5 font-medium cursor-pointer"
          >
            Ganti <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase overflow-hidden border border-slate-600">
            {currentUser.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
            ) : (
              currentUser.fullName.slice(0, 2)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{currentUser.fullName}</p>
            <span className={cn('inline-block text-[9px] px-1.5 py-0.2 rounded border font-medium mt-0.5', roleLabelMap[currentUser.role].badgeColor)}>
              {roleLabelMap[currentUser.role].label}
            </span>
          </div>
        </div>

        {/* Dropdown Role Menu */}
        {roleDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 z-30 bg-dark-900 border border-gold-400/30 rounded-xl p-1.5 shadow-2xl animate-in fade-in duration-150">
            <p className="text-[10px] text-slate-400 px-2 py-1 font-semibold uppercase">Pilih Role Pengguna:</p>
            {(['super_admin', 'admin_barber', 'barber'] as UserRole[]).map(r => (
              <button
                key={r}
                onClick={() => {
                  switchUserRole(r);
                  setRoleDropdownOpen(false);
                }}
                className={cn(
                  'w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer',
                  currentUser.role === r ? 'bg-gold-500/20 text-gold-300 font-semibold' : 'text-slate-300 hover:bg-white/5'
                )}
              >
                <span>{roleLabelMap[r].label}</span>
                {currentUser.role === r && <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {navigationItems.map(item => {
          const isAllowed = item.allowedRoles.includes(currentUser.role);
          if (!isAllowed) return null;

          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group',
                isActive
                  ? 'bg-gold-gradient text-dark-950 font-bold shadow-md shadow-gold-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-dark-750'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-dark-950 stroke-[2.5]' : 'text-slate-400 group-hover:text-gold-400'
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    'text-[9px] px-1.5 py-0.5 rounded-md font-semibold uppercase',
                    isActive
                      ? 'bg-dark-950 text-gold-300'
                      : 'bg-dark-750 text-gold-400 border border-gold-500/20'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 text-center text-[10px] text-slate-500">
        <p className="font-medium text-slate-400">BARBER CRM v1.0.0</p>
        <p>Premium Luxury Edition</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger Button */}
      <div className="md:hidden fixed top-3 left-3 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl bg-dark-800 border border-slate-700 text-gold-400 shadow-lg cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block h-screen sticky top-0 z-30 shrink-0">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10">{navContent}</div>
        </div>
      )}
    </>
  );
};

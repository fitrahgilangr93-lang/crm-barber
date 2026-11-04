'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useAppStore } from '@/lib/store';
import { UserRole } from '@/types';
import { ShieldAlert, ArrowLeft, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Route permission mapping based on business roles
const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/': ['super_admin', 'admin_barber', 'barber'],
  '/appointments': ['super_admin', 'admin_barber', 'barber'],
  '/barbers': ['super_admin', 'admin_barber', 'barber'],
  '/reviews': ['super_admin', 'admin_barber', 'barber'],
  '/customers': ['super_admin', 'admin_barber'],
  '/journey': ['super_admin', 'admin_barber'],
  '/pos': ['super_admin', 'admin_barber'],
  '/services': ['super_admin', 'admin_barber'],
  '/loyalty': ['super_admin', 'admin_barber'],
  '/marketing': ['super_admin', 'admin_barber'],
  '/analytics': ['super_admin', 'admin_barber'],
  '/reports': ['super_admin', 'admin_barber'],
  '/settings': ['super_admin'],
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { currentUser, switchUserRole } = useAppStore();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <main className="min-h-screen bg-dark-950 text-slate-100">{children}</main>;
  }

  // Check role authorization for the active pathname
  const allowedRoles = ROUTE_PERMISSIONS[pathname] || ['super_admin'];
  const isAuthorized = allowedRoles.includes(currentUser.role);

  const roleNameMap: Record<UserRole, string> = {
    super_admin: 'Super Admin (Owner)',
    admin_barber: 'Admin Barbershop (Store Manager)',
    barber: 'Staff Barber',
  };

  return (
    <div className="flex min-h-screen bg-dark-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {isAuthorized ? (
            children
          ) : (
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="max-w-md w-full glass-card rounded-3xl p-8 border border-rose-500/30 text-center space-y-5 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Akses Ditolak (403)</h3>
                  <p className="text-xs text-rose-300 font-semibold mt-1">
                    Pembatasan Hak Akses Berdasarkan Role
                  </p>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                    Akun Anda saat ini memiliki role <strong className="text-white">{roleNameMap[currentUser.role]}</strong> yang tidak memiliki wewenang untuk membuka modul <code className="text-gold-300 bg-dark-800 px-1.5 py-0.5 rounded font-mono">{pathname}</code>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-dark-850 border border-slate-800 text-[11px] text-slate-400 text-left space-y-1">
                  <p className="font-semibold text-slate-200">Role yang diizinkan:</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {allowedRoles.map(r => (
                      <span key={r} className="px-2 py-0.5 rounded bg-dark-750 text-gold-300 border border-slate-700 font-medium">
                        {roleNameMap[r]}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <Link href="/">
                    <Button variant="secondary" size="sm">
                      <ArrowLeft className="w-4 h-4 mr-1.5" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => switchUserRole('super_admin')}
                  >
                    <KeyRound className="w-4 h-4 mr-1.5" />
                    Beralih ke Super Admin
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

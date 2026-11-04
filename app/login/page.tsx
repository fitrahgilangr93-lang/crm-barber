'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Lock, Mail, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const { switchUserRole, users } = useAppStore();

  const [email, setEmail] = useState('admin@barbercrm.com');
  const [password, setPassword] = useState('supersecret123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      // Validate credentials
      const matchedUser = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!matchedUser) {
        setIsLoading(false);
        setErrorMessage('Alamat email tidak terdaftar dalam sistem BARBER CRM.');
        return;
      }

      if (!password || password.length < 6) {
        setIsLoading(false);
        setErrorMessage('Kata sandi salah atau minimal 6 karakter.');
        return;
      }

      switchUserRole(matchedUser.role);
      setIsLoading(false);
      router.push('/');
    }, 500);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setErrorMessage(null);
    const user = users.find(u => u.role === role) || users[0];
    setEmail(user.email);
    setPassword('supersecret123');
    switchUserRole(role);
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-radial-dark relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-gradient p-[1px] shadow-2xl shadow-gold-500/30 mb-4">
            <div className="w-full h-full bg-dark-950 rounded-[15px] flex items-center justify-center">
              <Crown className="w-8 h-8 text-gold-400" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-wider flex items-center justify-center gap-1.5">
            BARBER <span className="gold-text-gradient font-black">CRM</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
            The Royal Cut Barbershop Management
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <span className="font-bold">Error:</span> {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@barbercrm.com"
                  className="w-full bg-dark-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Kata Sandi</label>
                <button
                  type="button"
                  onClick={() => alert('Fitur pemulihan kata sandi telah dikirimkan ke email Anda!')}
                  className="text-[11px] text-gold-400 hover:underline"
                >
                  Lupa password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-dark-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              isLoading={isLoading}
              className="w-full text-xs font-bold uppercase tracking-wider mt-2 shadow-gold-glow"
            >
              Masuk ke Aplikasi
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Quick 1-Click Role Switcher for Reviewers */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" /> Masuk Cepat Demo (1-Click)
              </span>
              <span className="text-[10px] text-gold-300 font-medium">Pilih Role:</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('super_admin')}
                className="p-2 rounded-xl bg-dark-800 hover:bg-gold-500/20 border border-slate-700 hover:border-gold-400/50 text-slate-200 text-[11px] font-bold transition-all text-center cursor-pointer"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin_barber')}
                className="p-2 rounded-xl bg-dark-800 hover:bg-blue-500/20 border border-slate-700 hover:border-blue-400/50 text-slate-200 text-[11px] font-bold transition-all text-center cursor-pointer"
              >
                Admin Toko
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('barber')}
                className="p-2 rounded-xl bg-dark-800 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-400/50 text-slate-200 text-[11px] font-bold transition-all text-center cursor-pointer"
              >
                Staff Barber
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-500 mt-6">
          © 2026 BARBER CRM • The Royal Cut Luxury Barbershop System
        </p>
      </div>
    </div>
  );
}

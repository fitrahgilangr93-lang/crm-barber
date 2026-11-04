import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'BARBER CRM - The Royal Cut Customer Relationship Management',
  description: 'Aplikasi CRM dan POS profesional untuk bisnis barbershop modern dengan tema emas dan hitam gradasi.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-dark-950 text-slate-100 antialiased selection:bg-gold-500/30 selection:text-gold-200">
        <AppProvider>
          <AppShell>
            {children}
          </AppShell>
        </AppProvider>
      </body>
    </html>
  );
}

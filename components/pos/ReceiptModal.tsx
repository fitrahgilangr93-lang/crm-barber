'use client';

import React from 'react';
import { Printer, Download, X, Crown, Scissors } from 'lucide-react';
import { Transaction } from '@/types';
import { formatRupiah, formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
}

export const ReceiptModal: React.FC<Props> = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-dark-900 border border-slate-700/80 p-5 shadow-2xl text-slate-100 animate-in zoom-in-95">
        {/* Actions Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 print:hidden">
          <span className="text-xs font-bold text-slate-400">Preview Struk Kasir</span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="gold" onClick={handlePrint}>
              <Printer className="w-3.5 h-3.5 mr-1" />
              Cetak Struk
            </Button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-dark-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Thermal Receipt (White thermal paper look) */}
        <div
          id="printable-receipt"
          className="bg-white text-black p-5 rounded-xl font-mono text-[11px] space-y-3.5 shadow-inner my-3"
        >
          {/* Header */}
          <div className="text-center border-b border-dashed border-gray-400 pb-3">
            <div className="flex justify-center mb-1">
              <Crown className="w-6 h-6 text-black" />
            </div>
            <h3 className="font-extrabold text-sm uppercase tracking-wider">THE ROYAL CUT BARBERSHOP</h3>
            <p className="text-[10px] text-gray-700">Jl. Senopati No. 88, Kebayoran Baru</p>
            <p className="text-[10px] text-gray-700">Jakarta Selatan • Telp: 0812-9876-5432</p>
          </div>

          {/* Meta Info */}
          <div className="space-y-1 text-[10px] border-b border-dashed border-gray-400 pb-2">
            <div className="flex justify-between">
              <span>No. Invoice:</span>
              <span className="font-bold">{transaction.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Tanggal:</span>
              <span>{formatDateTime(transaction.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pelanggan:</span>
              <span className="font-semibold">{transaction.customerName} ({transaction.customerTier || 'Silver'})</span>
            </div>
            <div className="flex justify-between">
              <span>Barber:</span>
              <span>{transaction.barberName}</span>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-1.5 border-b border-dashed border-gray-400 pb-3">
            {transaction.details.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div className="pr-2">
                  <p className="font-bold leading-tight">{item.serviceName}</p>
                  <p className="text-[9px] text-gray-600">1 x {formatRupiah(item.price)}</p>
                </div>
                <span className="font-semibold">{formatRupiah(item.subtotal)}</span>
              </div>
            ))}
          </div>

          {/* Totals & Payment */}
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatRupiah(transaction.subtotal)}</span>
            </div>
            {transaction.discountAmount > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Diskon VIP:</span>
                <span>-{formatRupiah(transaction.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm pt-1 border-t border-gray-300">
              <span>TOTAL BAYAR:</span>
              <span>{formatRupiah(transaction.totalAmount)}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span>Metode Pembayaran:</span>
              <span className="font-semibold uppercase">{transaction.paymentMethod}</span>
            </div>
            {transaction.cashTendered && (
              <>
                <div className="flex justify-between">
                  <span>Tunai Diterima:</span>
                  <span>{formatRupiah(transaction.cashTendered)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kembalian:</span>
                  <span>{formatRupiah(transaction.cashChange || 0)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-[10px] text-emerald-800 font-semibold pt-1">
              <span>Poin Loyalty Diperoleh:</span>
              <span>+{transaction.pointsEarned} Poin</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-3 border-t border-dashed border-gray-400 text-[9px] space-y-1 text-gray-700">
            <p className="font-bold">Terima Kasih Atas Kunjungan Anda!</p>
            <p>Tetap tampil rapi dan maskulin bersama The Royal Cut.</p>
            <p className="font-mono text-[8px] text-gray-500">IG: @royalcut.barber • Web: royalcut.id</p>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  User, 
  Scissors, 
  Percent, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Printer, 
  CheckCircle2, 
  Search,
  Sparkles,
  Receipt
} from 'lucide-react';
import { PaymentMethod, Transaction } from '@/types';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ReceiptModal } from '@/components/pos/ReceiptModal';
import { formatRupiah, formatDate, formatDateTime } from '@/lib/utils';

export const CashierPOS: React.FC = () => {
  const { customers, barbers, services, transactions, createTransaction } = useAppStore();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [selectedBarberId, setSelectedBarberId] = useState<string>(barbers[0]?.id || '');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([services[0]?.id || '']);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('QRIS');
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  // Receipt modal state
  const [activeReceiptTx, setActiveReceiptTx] = useState<Transaction | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);

  // Search filter for recent transactions
  const [txSearch, setTxSearch] = useState('');

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const selectedBarber = barbers.find(b => b.id === selectedBarberId);
  const chosenServices = services.filter(s => selectedServiceIds.includes(s.id));

  const subtotal = chosenServices.reduce((sum, s) => sum + s.price, 0);

  // Auto VIP discount calculation if applicable
  const vipDiscount = selectedCustomer?.membershipTier === 'Platinum'
    ? subtotal * 0.1
    : selectedCustomer?.membershipTier === 'Gold'
    ? subtotal * 0.05
    : 0;

  const effectiveDiscount = discountAmount > 0 ? discountAmount : vipDiscount;
  const totalAmount = Math.max(0, subtotal - effectiveDiscount);
  const cashChange = cashTendered > totalAmount ? cashTendered - totalAmount : 0;

  const toggleService = (srvId: string) => {
    setSelectedServiceIds(prev =>
      prev.includes(srvId)
        ? prev.filter(id => id !== srvId)
        : [...prev, srvId]
    );
  };

  const handleCheckout = () => {
    if (!selectedCustomerId) {
      alert('Pilih pelanggan terlebih dahulu.');
      return;
    }
    if (!selectedBarberId) {
      alert('Pilih barber yang melayani.');
      return;
    }
    if (selectedServiceIds.length === 0) {
      alert('Pilih minimal satu layanan.');
      return;
    }
    if (paymentMethod === 'Tunai' && cashTendered < totalAmount) {
      alert(`Uang tunai kurang! Total bayar: ${formatRupiah(totalAmount)}, Diterima: ${formatRupiah(cashTendered)}`);
      return;
    }

    const newTx = createTransaction({
      customerId: selectedCustomerId,
      barberId: selectedBarberId,
      serviceIds: selectedServiceIds,
      discountAmount: effectiveDiscount,
      paymentMethod,
      cashTendered: paymentMethod === 'Tunai' ? cashTendered : undefined,
      notes: notes || undefined,
    });

    setActiveReceiptTx(newTx);
    setIsReceiptOpen(true);

    // Reset some fields
    setSelectedServiceIds([services[0]?.id || '']);
    setDiscountAmount(0);
    setCashTendered(0);
    setNotes('');
  };

  const filteredTransactions = transactions.filter(t =>
    t.invoiceNumber.toLowerCase().includes(txSearch.toLowerCase()) ||
    (t.customerName && t.customerName.toLowerCase().includes(txSearch.toLowerCase())) ||
    (t.barberName && t.barberName.toLowerCase().includes(txSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Kasir & Transaksi POS
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 font-semibold">
              Point of Sale
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Input transaksi pangkas rambut, hitung diskon VIP otomatis, komisi barber, akumulasi poin, dan cetak struk kasir.
          </p>
        </div>
      </div>

      {/* Main POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Cashier Builder (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Step 1: Customer & Barber */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4" /> 1. Pelanggan & Barber Bertugas
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Customer Dropdown */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Pilih Pelanggan</label>
                <select
                  value={selectedCustomerId}
                  onChange={e => setSelectedCustomerId(e.target.value)}
                  className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} - {c.membershipTier} ({c.loyaltyPoints} Pts)
                    </option>
                  ))}
                </select>

                {selectedCustomer && (
                  <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Tier: <strong className="text-gold-300">{selectedCustomer.membershipTier}</strong></span>
                    <span>Poin Saat Ini: <strong className="text-amber-400">{selectedCustomer.loyaltyPoints}</strong></span>
                  </div>
                )}
              </div>

              {/* Barber Dropdown */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Barber yang Melayani</label>
                <select
                  value={selectedBarberId}
                  onChange={e => setSelectedBarberId(e.target.value)}
                  className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                >
                  {barbers.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.specialization})
                    </option>
                  ))}
                </select>
                {selectedBarber && (
                  <div className="mt-2 text-[11px] text-slate-400">
                    Komisi Barber: <strong className="text-emerald-400">{selectedBarber.commissionRate}%</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Select Services */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                <Scissors className="w-4 h-4" /> 2. Pilih Layanan (Bisa Multi-Layanan)
              </h4>
              <span className="text-xs text-slate-400">{selectedServiceIds.length} dipilih</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {services.map(srv => {
                const isSelected = selectedServiceIds.includes(srv.id);

                return (
                  <div
                    key={srv.id}
                    onClick={() => toggleService(srv.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-gold-500/15 border-gold-400 text-white shadow-md shadow-gold-500/10'
                        : 'bg-dark-800/80 border-slate-700/60 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold leading-tight">{srv.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-dark-750 text-slate-300">
                        {srv.durationMinutes}m
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/40">
                      <span className="text-[10px] text-slate-400">{srv.category}</span>
                      <span className={`font-bold ${isSelected ? 'text-gold-300' : 'text-slate-200'}`}>
                        {formatRupiah(srv.price)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Payment Method & Tendered Cash */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" /> 3. Metode Pembayaran & Diskon
            </h4>

            {/* Payment method selector */}
            <div className="grid grid-cols-3 gap-2">
              {(['QRIS', 'Tunai', 'Transfer Bank'] as PaymentMethod[]).map(pm => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setPaymentMethod(pm)}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === pm
                      ? 'bg-gold-gradient text-dark-950 border-gold-400 shadow-md shadow-gold-500/20'
                      : 'bg-dark-800 border-slate-700 text-slate-300 hover:bg-dark-750'
                  }`}
                >
                  {pm === 'QRIS' && <QrCode className="w-5 h-5" />}
                  {pm === 'Tunai' && <Banknote className="w-5 h-5" />}
                  {pm === 'Transfer Bank' && <CreditCard className="w-5 h-5" />}
                  <span>{pm}</span>
                </button>
              ))}
            </div>

            {/* If Tunai selected: quick cash buttons */}
            {paymentMethod === 'Tunai' && (
              <div className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-700/60 space-y-2">
                <label className="block text-xs font-medium text-slate-300">Uang Diterima dari Pelanggan</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Rp</span>
                  <input
                    type="number"
                    value={cashTendered || ''}
                    placeholder="Nominal uang tunai..."
                    onChange={e => setCashTendered(Number(e.target.value))}
                    className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-gold-400 font-bold"
                  />
                </div>
                {/* Quick amount shortcuts */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[totalAmount, 50000, 100000, 150000, 200000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCashTendered(amt)}
                      className="text-[10px] px-2 py-1 bg-dark-750 hover:bg-gold-500/20 hover:text-gold-300 rounded border border-slate-700 cursor-pointer"
                    >
                      {formatRupiah(amt)}
                    </button>
                  ))}
                </div>
                {cashTendered > 0 && (
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-700 font-semibold">
                    <span className="text-slate-400">Kembalian:</span>
                    <span className={cashChange >= 0 ? 'text-emerald-400 text-sm' : 'text-rose-400'}>
                      {formatRupiah(cashChange)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Custom Discount Input */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Diskon Khusus (Rp)
                </label>
                <input
                  type="number"
                  value={discountAmount || ''}
                  placeholder="0"
                  onChange={e => setDiscountAmount(Number(e.target.value))}
                  className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Catatan Transaksi
                </label>
                <input
                  type="text"
                  value={notes}
                  placeholder="e.g. Pembayaran lunas via QRIS..."
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-gold-500/30 space-y-4 shadow-xl">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-gold-400" /> Ringkasan Pembayaran
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Lunas
              </span>
            </h4>

            {/* Items list */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
              {chosenServices.map(s => (
                <div key={s.id} className="flex justify-between items-center text-slate-300 py-1 border-b border-slate-800/60">
                  <span>{s.name}</span>
                  <span className="font-semibold text-white">{formatRupiah(s.price)}</span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="text-slate-200">{formatRupiah(subtotal)}</span>
              </div>
              {effectiveDiscount > 0 && (
                <div className="flex justify-between text-amber-400 font-medium">
                  <span>Diskon VIP:</span>
                  <span>-{formatRupiah(effectiveDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-base font-extrabold text-white pt-2 border-t border-slate-700">
                <span>TOTAL AKHIR:</span>
                <span className="text-xl gold-text-gradient">{formatRupiah(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                <span>Poin Loyalty Didapat:</span>
                <span className="font-bold text-gold-400">
                  +{Math.round(totalAmount / 10000)} Poin
                </span>
              </div>
            </div>

            {/* Process Checkout Button */}
            <Button
              variant="gold"
              size="lg"
              className="w-full text-sm font-bold shadow-gold-glow"
              onClick={handleCheckout}
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Proses Transaksi & Cetak Struk
            </Button>
          </div>

          {/* Recent Transactions Snippet */}
          <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h5 className="text-xs font-bold text-slate-300">Riwayat Transaksi Terkini</h5>
              <span className="text-[10px] text-slate-500">{transactions.length} tercatat</span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
              {transactions.slice(0, 6).map(tx => (
                <div
                  key={tx.id}
                  className="p-2.5 rounded-xl bg-dark-800/80 border border-slate-700/50 flex items-center justify-between hover:border-gold-500/30 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-gold-400 text-[11px]">{tx.invoiceNumber}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-dark-750 text-slate-400">
                        {tx.paymentMethod}
                      </span>
                    </div>
                    <p className="text-slate-200 font-semibold text-[11px] mt-0.5">{tx.customerName}</p>
                    <p className="text-[10px] text-slate-500">{formatDate(tx.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white text-xs">{formatRupiah(tx.totalAmount)}</p>
                    <button
                      onClick={() => {
                        setActiveReceiptTx(tx);
                        setIsReceiptOpen(true);
                      }}
                      className="text-[10px] text-gold-400 hover:underline flex items-center gap-0.5 ml-auto mt-1 cursor-pointer"
                    >
                      <Printer className="w-3 h-3" /> Struk
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        transaction={activeReceiptTx}
      />
    </div>
  );
};

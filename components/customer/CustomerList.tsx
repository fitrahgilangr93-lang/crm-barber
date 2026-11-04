'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  UserPlus, 
  Crown,
  FileSpreadsheet,
  Printer
} from 'lucide-react';
import { Customer, MembershipTier, CustomerStatus } from '@/types';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CustomerFormModal } from '@/components/customer/CustomerFormModal';
import { CustomerDetailModal } from '@/components/customer/CustomerDetailModal';
import { formatRupiah, formatDate, exportToExcel, exportToCSV, exportToPDF } from '@/lib/utils';
import { INITIAL_SOURCES } from '@/lib/seed-data';

export const CustomerList: React.FC = () => {
  const { customers, deleteCustomer } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Auto-open customer from URL search query (e.g. from Header search)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const queryId = urlParams.get('id');
      if (queryId) {
        const target = customers.find(c => c.id.toLowerCase() === queryId.toLowerCase());
        if (target) {
          setSelectedCustomer(target);
          setIsDetailOpen(true);
        }
      }
    }
  }, [customers]);

  // Filtering
  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.whatsapp.includes(searchQuery) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier = tierFilter === 'ALL' || c.membershipTier === tierFilter;
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesSource = sourceFilter === 'ALL' || c.sourceId === sourceFilter;

    return matchesSearch && matchesTier && matchesStatus && matchesSource;
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pelanggan "${name}" (${id})? Riwayat terkait akan ikut terhapus.`)) {
      deleteCustomer(id);
    }
  };

  const handleExport = (type: 'xlsx' | 'csv' | 'pdf') => {
    const exportData = filteredCustomers.map(c => ({
      ID: c.id,
      Nama_Lengkap: c.fullName,
      WhatsApp: c.whatsapp,
      Email: c.email || '-',
      Jenis_Kelamin: c.gender,
      Membership_Tier: c.membershipTier,
      Loyalty_Points: c.loyaltyPoints,
      Total_Belanja: c.totalSpend,
      Total_Kunjungan: c.totalVisits,
      Terakhir_Berkunjung: formatDate(c.lastVisitAt),
      Status: c.status,
      Sumber_Pelanggan: c.sourceId,
      Preferensi_Rambut: c.hairPreference || '-',
    }));

    if (type === 'xlsx') {
      exportToExcel(`Pelanggan_BarberCRM_${new Date().toISOString().slice(0, 10)}`, 'Pelanggan', exportData);
    } else if (type === 'csv') {
      exportToCSV(`Pelanggan_BarberCRM_${new Date().toISOString().slice(0, 10)}`, exportData);
    } else {
      const headers = ['ID', 'Nama Pelanggan', 'WhatsApp', 'Tier', 'Poin', 'Total Belanja', 'Kunjungan', 'Status'];
      const rows = filteredCustomers.map(c => [
        c.id,
        c.fullName,
        c.whatsapp,
        c.membershipTier,
        c.loyaltyPoints,
        formatRupiah(c.totalSpend),
        `${c.totalVisits}x`,
        c.status,
      ]);
      exportToPDF(`Pelanggan_BarberCRM_${new Date().toISOString().slice(0, 10)}`, 'Database Pelanggan', headers, rows);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Database Pelanggan
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 font-semibold">
              {filteredCustomers.length} Total
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Kelola profil, riwayat transaksi, membership loyalitas, dan preferensi rambut pelanggan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export Buttons */}
          <button
            onClick={() => handleExport('xlsx')}
            className="p-2.5 bg-dark-800 hover:bg-dark-750 border border-slate-700/60 rounded-xl text-xs text-slate-300 hover:text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Ekspor ke Excel (XLSX)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline font-medium">Excel</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="p-2.5 bg-dark-800 hover:bg-dark-750 border border-slate-700/60 rounded-xl text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Ekspor ke CSV"
          >
            <Download className="w-4 h-4 text-gold-400" />
            <span className="hidden md:inline font-medium">CSV</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="p-2.5 bg-dark-800 hover:bg-dark-750 border border-slate-700/60 rounded-xl text-xs text-slate-300 hover:text-cyan-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Ekspor ke PDF"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline font-medium">PDF</span>
          </button>

          {/* Add Customer Button */}
          <Button
            variant="gold"
            size="md"
            onClick={() => {
              setEditingCustomer(null);
              setIsFormOpen(true);
            }}
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            <span>Tambah Pelanggan</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama, WA, atau ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold-400"
            />
          </div>

          {/* Tier Filter */}
          <div>
            <select
              value={tierFilter}
              onChange={e => setTierFilter(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            >
              <option value="ALL">Semua Membership Tier</option>
              <option value="Platinum">Royal Platinum VIP</option>
              <option value="Gold">Gold VIP</option>
              <option value="Silver">Silver Member</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            >
              <option value="ALL">Semua Status Pelanggan</option>
              <option value="Aktif">Aktif</option>
              <option value="Kurang Aktif">Kurang Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif (Churn)</option>
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <select
              value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            >
              <option value="ALL">Semua Sumber Pelanggan</option>
              {INITIAL_SOURCES.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-dark-800/90 text-slate-400 border-b border-slate-700/80 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Pelanggan</th>
                <th className="p-3.5">Kontak</th>
                <th className="p-3.5">Membership</th>
                <th className="p-3.5 text-right">Total Belanja</th>
                <th className="p-3.5 text-center">Kunjungan</th>
                <th className="p-3.5">Terakhir Datang</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => {
                  const tierVariant =
                    customer.membershipTier === 'Platinum'
                      ? 'platinum'
                      : customer.membershipTier === 'Gold'
                      ? 'gold'
                      : 'silver';

                  const statusVariant =
                    customer.status === 'Aktif'
                      ? 'success'
                      : customer.status === 'Kurang Aktif'
                      ? 'warning'
                      : 'danger';

                  return (
                    <tr key={customer.id} className="hover:bg-dark-750/50 transition-colors">
                      {/* Name & ID */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-dark-800 to-slate-700 flex items-center justify-center font-bold text-xs text-gold-300 border border-slate-700 uppercase shrink-0">
                            {customer.fullName.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-100 flex items-center gap-1.5 hover:text-gold-300 cursor-pointer"
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setIsDetailOpen(true);
                              }}
                            >
                              {customer.fullName}
                              {customer.membershipTier === 'Platinum' && (
                                <Crown className="w-3.5 h-3.5 text-cyan-400" />
                              )}
                            </p>
                            <span className="text-[10px] font-mono text-slate-400">ID: {customer.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="p-3.5">
                        <p className="font-semibold text-slate-200">{customer.whatsapp}</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[150px]">{customer.email || '-'}</p>
                      </td>

                      {/* Tier & Points */}
                      <td className="p-3.5">
                        <Badge variant={tierVariant} size="sm">
                          {customer.membershipTier}
                        </Badge>
                        <p className="text-[10px] text-amber-400/90 font-medium mt-1">
                          {customer.loyaltyPoints} Poin
                        </p>
                      </td>

                      {/* Total Spend */}
                      <td className="p-3.5 text-right font-bold text-slate-100">
                        {formatRupiah(customer.totalSpend)}
                      </td>

                      {/* Total Visits */}
                      <td className="p-3.5 text-center font-semibold text-slate-200">
                        {customer.totalVisits}x
                      </td>

                      {/* Last Visit */}
                      <td className="p-3.5 text-slate-300">
                        {formatDate(customer.lastVisitAt)}
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <Badge variant={statusVariant} size="sm">
                          {customer.status}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setIsDetailOpen(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-gold-500/20 text-slate-300 hover:text-gold-300 transition-colors cursor-pointer"
                            title="Lihat Detail Profil"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingCustomer(customer);
                              setIsFormOpen(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-blue-500/20 text-slate-300 hover:text-blue-400 transition-colors cursor-pointer"
                            title="Edit Data"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(customer.id, customer.fullName)}
                            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Hapus Pelanggan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Tidak ada pelanggan yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Form Modal */}
      <CustomerFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCustomer(null);
        }}
        customerToEdit={editingCustomer}
      />

      {/* Customer Detail Profile Modal */}
      <CustomerDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
      />
    </div>
  );
};

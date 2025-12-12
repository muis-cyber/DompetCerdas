import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants';
import { Plus, Trash2, ArrowUpRight, ArrowDownLeft, X } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onAddTransaction: (t: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  onAddTransaction, 
  onDeleteTransaction 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeType, setActiveType] = useState<TransactionType>('expense');
  
  // Form State
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onAddTransaction({
      amount: parseFloat(amount),
      category,
      date,
      description,
      type: activeType
    });

    // Reset and close
    setAmount('');
    setDescription('');
    setCategory('');
    setIsModalOpen(false);
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Riwayat Transaksi</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" />
          Tambah
        </button>
      </div>

      <div className="space-y-3">
        {sortedTransactions.length === 0 ? (
          <div className="text-center py-10 text-slate-500 bg-white rounded-xl shadow-sm">
            <p>Belum ada transaksi bulan ini.</p>
          </div>
        ) : (
          sortedTransactions.map((t) => (
            <div key={t.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {t.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{t.category}</p>
                  <p className="text-xs text-slate-500">{t.date} • {t.description || 'Tanpa deskripsi'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatRupiah(t.amount)}
                </p>
                <button 
                  onClick={() => onDeleteTransaction(t.id)}
                  className="text-xs text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Tambah Transaksi</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeType === 'expense' ? 'bg-white shadow text-rose-600' : 'text-slate-500'}`}
                  onClick={() => setActiveType('expense')}
                >
                  Pengeluaran
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeType === 'income' ? 'bg-white shadow text-emerald-600' : 'text-slate-500'}`}
                  onClick={() => setActiveType('income')}
                >
                  Pemasukan
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Jumlah (Rp)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Kategori</label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Kategori</option>
                  {(activeType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Deskripsi (Opsional)</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: Makan siang"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all ${
                  activeType === 'expense' ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
              >
                Simpan Transaksi
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
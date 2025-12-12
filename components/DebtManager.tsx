import React, { useState } from 'react';
import { Debt, DebtType } from '../types';
import { CheckCircle2, Circle, Plus, Trash2, X } from 'lucide-react';

interface DebtManagerProps {
  debts: Debt[];
  onAddDebt: (d: Omit<Debt, 'id'>) => void;
  onToggleStatus: (id: string) => void;
  onDeleteDebt: (id: string) => void;
}

export const DebtManager: React.FC<DebtManagerProps> = ({ debts, onAddDebt, onToggleStatus, onDeleteDebt }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<DebtType>('payable');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName || !amount) return;

    onAddDebt({
      personName,
      amount: parseFloat(amount),
      type,
      dueDate,
      description: '',
      isPaid: false
    });

    setPersonName('');
    setAmount('');
    setDueDate('');
    setIsModalOpen(false);
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="pb-20">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Catatan Hutang</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" />
          Tambah
        </button>
      </div>

      <div className="grid gap-4">
        {debts.length === 0 ? (
           <div className="text-center py-10 text-slate-500 bg-white rounded-xl shadow-sm">
             <p>Tidak ada catatan hutang/piutang.</p>
           </div>
        ) : (
          debts.map(debt => (
            <div key={debt.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${debt.isPaid ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className="flex items-center gap-4">
                <button onClick={() => onToggleStatus(debt.id)} className={`transition-colors ${debt.isPaid ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-500'}`}>
                  {debt.isPaid ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${debt.type === 'payable' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                      {debt.type === 'payable' ? 'Hutang Saya' : 'Piutang'}
                    </span>
                    <span className="font-semibold text-slate-800">{debt.personName}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">Jatuh Tempo: {debt.dueDate || 'Tidak ada'}</p>
                </div>
              </div>
              <div className="text-right">
                 <p className="font-bold text-slate-800">{formatRupiah(debt.amount)}</p>
                 <button onClick={() => onDeleteDebt(debt.id)} className="text-xs text-rose-500 hover:underline mt-1">Hapus</button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Catat Hutang/Piutang</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="flex p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${type === 'payable' ? 'bg-white shadow text-rose-600' : 'text-slate-500'}`}
                  onClick={() => setType('payable')}
                >
                  Saya Berhutang (Hutang)
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${type === 'receivable' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
                  onClick={() => setType('receivable')}
                >
                  Orang Berhutang (Piutang)
                </button>
              </div>
              <input type="text" placeholder="Nama Orang" required value={personName} onChange={e => setPersonName(e.target.value)} className="w-full p-3 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-blue-500" />
              <input type="number" placeholder="Jumlah (Rp)" required value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-blue-500" />
              <div>
                <label className="text-xs text-slate-500 block mb-1">Jatuh Tempo (Opsional)</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-3 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold">Simpan</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
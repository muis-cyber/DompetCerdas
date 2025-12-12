import React, { useState } from 'react';
import { SavingsGoal } from '../types';
import { SAVINGS_ICONS } from '../constants';
import { Plus, X, Trash2 } from 'lucide-react';

interface SavingsManagerProps {
  savings: SavingsGoal[];
  onAddSaving: (s: Omit<SavingsGoal, 'id'>) => void;
  onUpdateSaving: (id: string, amount: number) => void;
  onDeleteSaving: (id: string) => void;
}

export const SavingsManager: React.FC<SavingsManagerProps> = ({ savings, onAddSaving, onUpdateSaving, onDeleteSaving }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(SAVINGS_ICONS[0]);

  // For updating amount
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !target) return;
    onAddSaving({
      name,
      targetAmount: parseFloat(target),
      currentAmount: 0,
      icon: selectedIcon,
      color: '#3B82F6'
    });
    setName('');
    setTarget('');
    setIsModalOpen(false);
  };

  const handleUpdateAmount = (id: string) => {
    if (!addAmount) return;
    const saving = savings.find(s => s.id === id);
    if (saving) {
      onUpdateSaving(id, saving.currentAmount + parseFloat(addAmount));
    }
    setEditingId(null);
    setAddAmount('');
  };

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Target Tabungan</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg active:scale-95 transition-transform">
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savings.length === 0 ? (
          <div className="col-span-full text-center py-10 text-slate-500 bg-white rounded-xl shadow-sm">
             <p>Belum ada target tabungan.</p>
           </div>
        ) : (
          savings.map(s => {
            const progress = Math.min((s.currentAmount / s.targetAmount) * 100, 100);
            return (
              <div key={s.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{s.icon}</span>
                    <div>
                      <h3 className="font-bold text-slate-800">{s.name}</h3>
                      <p className="text-xs text-slate-500">Target: {formatRupiah(s.targetAmount)}</p>
                    </div>
                  </div>
                  <button onClick={() => onDeleteSaving(s.id)} className="text-slate-300 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                </div>

                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{formatRupiah(s.currentAmount)}</span>
                  <span className="text-slate-500">{progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4">
                  <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>

                {editingId === s.id ? (
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Jumlah tambah" 
                      value={addAmount} 
                      onChange={e => setAddAmount(e.target.value)}
                      className="flex-1 p-2 bg-slate-50 rounded-lg text-sm"
                      autoFocus
                    />
                    <button onClick={() => handleUpdateAmount(s.id)} className="bg-emerald-500 text-white px-3 rounded-lg text-sm">OK</button>
                    <button onClick={() => setEditingId(null)} className="text-slate-400 px-2"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setEditingId(s.id)} 
                    className="w-full py-2 border border-dashed border-slate-300 text-slate-500 rounded-lg text-sm hover:border-indigo-500 hover:text-indigo-500 transition-colors"
                  >
                    + Tabung Uang
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
             <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Buat Target Baru</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Nama Tabungan (mis: iPhone Baru)" required value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-blue-500" />
              <input type="number" placeholder="Target Jumlah (Rp)" required value={target} onChange={e => setTarget(e.target.value)} className="w-full p-3 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-blue-500" />
              
              <div>
                <label className="text-xs text-slate-500 mb-2 block">Pilih Ikon</label>
                <div className="flex flex-wrap gap-2">
                  {SAVINGS_ICONS.map(icon => (
                    <button 
                      key={icon} 
                      type="button" 
                      onClick={() => setSelectedIcon(icon)}
                      className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-colors ${selectedIcon === icon ? 'bg-indigo-100 border-2 border-indigo-500' : 'bg-slate-50 hover:bg-slate-100'}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold">Simpan Target</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
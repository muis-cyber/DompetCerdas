import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Receipt, HandCoins, PiggyBank, Sparkles } from 'lucide-react';
import { Transaction, Debt, SavingsGoal, AppView, FinancialSummary } from './types';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { DebtManager } from './components/DebtManager';
import { SavingsManager } from './components/SavingsManager';
import { AIAdvisor } from './components/AIAdvisor';

const STORAGE_KEY = 'dompetku_data_v1';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  
  // State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [savings, setSavings] = useState<SavingsGoal[]>([]);

  // Load data from local storage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setTransactions(parsed.transactions || []);
      setDebts(parsed.debts || []);
      setSavings(parsed.savings || []);
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions, debts, savings }));
  }, [transactions, debts, savings]);

  // Derived Summary
  const summary: FinancialSummary = React.useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const savingsTotal = savings.reduce((acc, s) => acc + s.currentAmount, 0);
    
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      savingsTotal
    };
  }, [transactions, savings]);

  // Handlers
  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = { ...t, id: Date.now().toString() };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addDebt = (d: Omit<Debt, 'id'>) => {
    const newDebt: Debt = { ...d, id: Date.now().toString() };
    setDebts(prev => [newDebt, ...prev]);
  };

  const toggleDebtStatus = (id: string) => {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, isPaid: !d.isPaid } : d));
  };

  const deleteDebt = (id: string) => {
    setDebts(prev => prev.filter(d => d.id !== id));
  };

  const addSaving = (s: Omit<SavingsGoal, 'id'>) => {
    const newSaving: SavingsGoal = { ...s, id: Date.now().toString() };
    setSavings(prev => [newSaving, ...prev]);
  };

  const updateSavingAmount = (id: string, amount: number) => {
    setSavings(prev => prev.map(s => s.id === id ? { ...s, currentAmount: amount } : s));
  };

  const deleteSaving = (id: string) => {
    setSavings(prev => prev.filter(s => s.id !== id));
  };

  // View Routing
  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard transactions={transactions} summary={summary} />;
      case AppView.TRANSACTIONS:
        return <TransactionList transactions={transactions} onAddTransaction={addTransaction} onDeleteTransaction={deleteTransaction} />;
      case AppView.DEBTS:
        return <DebtManager debts={debts} onAddDebt={addDebt} onToggleStatus={toggleDebtStatus} onDeleteDebt={deleteDebt} />;
      case AppView.SAVINGS:
        return <SavingsManager savings={savings} onAddSaving={addSaving} onUpdateSaving={updateSavingAmount} onDeleteSaving={deleteSaving} />;
      case AppView.AI_ADVISOR:
        return <AIAdvisor transactions={transactions} debts={debts} savings={savings} />;
      default:
        return <Dashboard transactions={transactions} summary={summary} />;
    }
  };

  const NavButton = ({ view, icon: Icon, label }: { view: AppView, icon: React.ElementType, label: string }) => (
    <button 
      onClick={() => setCurrentView(view)}
      className={`flex flex-col items-center justify-center w-full py-3 space-y-1 transition-colors ${
        currentView === view ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <Icon className={`w-6 h-6 ${currentView === view ? 'fill-current' : ''}`} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm h-[72px]">
        <div className="flex items-center gap-3">
          {/* Logo Image */}
          <img 
            src="https://placehold.co/100x100/3B82F6/ffffff?text=R" 
            alt="DompetCerdas Logo" 
            className="w-10 h-10 rounded-xl shadow-lg shadow-blue-200 object-cover" 
          />
          <h1 className="text-xl font-bold tracking-tight text-slate-800">DompetCerdas</h1>
        </div>
        <div className="text-xs font-medium bg-slate-100 px-3 py-1 rounded-full text-slate-600">
          {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="max-w-6xl mx-auto md:flex md:items-start md:gap-8 md:p-6">
        {/* Desktop Side Navigation - Sticky Sidebar */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 sticky top-24 gap-2 h-fit">
          {[
            { view: AppView.DASHBOARD, icon: LayoutDashboard, label: 'Ringkasan' },
            { view: AppView.TRANSACTIONS, icon: Receipt, label: 'Transaksi' },
            { view: AppView.DEBTS, icon: HandCoins, label: 'Hutang & Piutang' },
            { view: AppView.SAVINGS, icon: PiggyBank, label: 'Target Tabungan' },
            { view: AppView.AI_ADVISOR, icon: Sparkles, label: 'Analisis AI' },
          ].map(item => (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                currentView === item.view 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                  : 'text-slate-500 hover:bg-white hover:text-slate-800'
              }`}
            >
              <item.icon className={`w-5 h-5 ${currentView === item.view ? 'text-white' : ''}`} />
              {item.label}
            </button>
          ))}
        </aside>

        {/* Main Content - Flex Grow */}
        <main className="flex-1 min-w-0 p-4 md:p-0">
          {renderView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-40 md:hidden">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
          <NavButton view={AppView.DASHBOARD} icon={LayoutDashboard} label="Ringkasan" />
          <NavButton view={AppView.TRANSACTIONS} icon={Receipt} label="Transaksi" />
          <NavButton view={AppView.AI_ADVISOR} icon={Sparkles} label="AI Advisor" />
          <NavButton view={AppView.DEBTS} icon={HandCoins} label="Hutang" />
          <NavButton view={AppView.SAVINGS} icon={PiggyBank} label="Tabungan" />
        </div>
      </nav>
    </div>
  );
}

export default App;
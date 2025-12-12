import React, { useState, useEffect } from 'react';
import { Transaction, Debt, SavingsGoal } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import { Sparkles, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIAdvisorProps {
  transactions: Transaction[];
  debts: Debt[];
  savings: SavingsGoal[];
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ transactions, debts, savings }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    const result = await getFinancialAdvice(transactions, debts, savings);
    setAdvice(result);
    setLoading(false);
    setHasLoaded(true);
  };

  // Auto-fetch on first mount if not loaded
  useEffect(() => {
    if (!hasLoaded) {
      fetchAdvice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 rounded-3xl text-white shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            AI Financial Advisor
          </h2>
          <p className="opacity-90 max-w-lg">
            Dapatkan analisis cerdas tentang kebiasaan belanja, status hutang, dan progres tabunganmu menggunakan teknologi Gemini AI.
          </p>
          
          <button 
            onClick={fetchAdvice}
            disabled={loading}
            className="mt-6 bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-2.5 rounded-full font-semibold transition-all flex items-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {loading ? 'Sedang Menganalisis...' : 'Perbarui Analisis'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[300px]">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-32 bg-slate-100 rounded mt-4"></div>
          </div>
        ) : (
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h3 className="text-xl font-bold text-indigo-700 mt-4 mb-2" {...props} />,
                h2: ({node, ...props}) => <h4 className="text-lg font-bold text-indigo-600 mt-3 mb-2" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 text-slate-700" {...props} />,
                li: ({node, ...props}) => <li className="marker:text-indigo-500" {...props} />,
                p: ({node, ...props}) => <p className="text-slate-600 leading-relaxed mb-4" {...props} />,
                strong: ({node, ...props}) => <span className="font-bold text-slate-900" {...props} />,
              }}
            >
              {advice}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};
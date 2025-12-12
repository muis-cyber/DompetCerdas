export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: TransactionType;
}

export type DebtType = 'receivable' | 'payable'; // Piutang (orang hutang ke kita) | Hutang (kita hutang ke orang)

export interface Debt {
  id: string;
  personName: string;
  amount: number;
  dueDate: string;
  description: string;
  type: DebtType;
  isPaid: boolean;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  color: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsTotal: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  TRANSACTIONS = 'TRANSACTIONS',
  DEBTS = 'DEBTS',
  SAVINGS = 'SAVINGS',
  AI_ADVISOR = 'AI_ADVISOR'
}
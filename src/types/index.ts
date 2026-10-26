export type ExpenseCategory = 'primitias' | 'essencial' | 'estilo' | 'celeiro';

export interface IncomeItem {
  id: string;
  description: string;
  plannedAmount: number;
  actualAmount: number;
  date: string;
  category: string;
  notes?: string;
}

export interface ExpenseItem {
  id: string;
  description: string;
  plannedAmount: number;
  actualAmount: number;
  category: ExpenseCategory;
  date: string;
  notes?: string;
}

export interface DebtItem {
  id: string;
  creditor: string;
  balance: number;
  interestRate: number; // % ao mês
  monthlyPayment: number;
  initialBalance: number;
  dueDateDay: number;
  notes?: string;
}

export interface BarnStage {
  id: number;
  name: string;
  monthsRequired: number;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
}

export interface DevotionalItem {
  id: string;
  scripture: string;
  reference: string;
  theme: string;
  reflection: string;
  practicalAction: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

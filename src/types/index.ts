export type Role = 'admin' | 'viewer';

export type TransactionType = 'income' | 'expense';

export type Category =
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Food & Dining'
  | 'Shopping'
  | 'Transportation'
  | 'Entertainment'
  | 'Healthcare'
  | 'Education'
  | 'Utilities'
  | 'Rent'
  | 'Travel'
  | 'Subscriptions'
  | 'Gifts'
  | 'Other';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  merchant?: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategorySpend {
  category: string;
  amount: number;
  color: string;
  percentage: number;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  icon: string;
  value?: string;
}

export interface FilterState {
  search: string;
  type: TransactionType | 'all';
  category: Category | 'all';
  dateRange: 'all' | '7d' | '30d' | '90d' | '1y';
  sortBy: 'date' | 'amount' | 'category';
  sortOrder: 'asc' | 'desc';
}

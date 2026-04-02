'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, Role, FilterState, Category, TransactionType } from '@/types';
import { transactions as mockTransactions } from '@/data/mockData';

interface AppState {
  // Role
  role: Role;
  setRole: (role: Role) => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Filters
  filters: FilterState;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;

  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Active Page
  activePage: 'dashboard' | 'transactions' | 'insights';
  setActivePage: (page: 'dashboard' | 'transactions' | 'insights') => void;

  // Modal
  modalOpen: boolean;
  editingTransaction: Transaction | null;
  openModal: (transaction?: Transaction) => void;
  closeModal: () => void;
}

const defaultFilters: FilterState = {
  search: '',
  type: 'all',
  category: 'all',
  dateRange: 'all',
  sortBy: 'date',
  sortOrder: 'desc',
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Role
      role: 'admin',
      setRole: (role) => set({ role }),

      // Theme
      theme: 'dark',
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        set({ theme: newTheme });
      },

      // Transactions
      transactions: mockTransactions,
      addTransaction: (transaction) => {
        const id = `t${Date.now()}`;
        set((state) => ({
          transactions: [{ ...transaction, id }, ...state.transactions],
        }));
      },
      editTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      // Filters
      filters: defaultFilters,
      setFilter: (key, value) => {
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        }));
      },
      resetFilters: () => set({ filters: defaultFilters }),

      // Sidebar
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // Active Page
      activePage: 'dashboard',
      setActivePage: (page) => set({ activePage: page }),

      // Modal
      modalOpen: false,
      editingTransaction: null,
      openModal: (transaction) =>
        set({ modalOpen: true, editingTransaction: transaction || null }),
      closeModal: () => set({ modalOpen: false, editingTransaction: null }),
    }),
    {
      name: 'finance-dashboard-storage',
      partialize: (state) => ({
        theme: state.theme,
        role: state.role,
        transactions: state.transactions,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

// Helper: get filtered transactions
export function getFilteredTransactions(
  transactions: Transaction[],
  filters: FilterState
): Transaction[] {
  let filtered = [...transactions];

  // Search
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.merchant?.toLowerCase().includes(q) ||
        t.amount.toString().includes(q)
    );
  }

  // Type filter
  if (filters.type !== 'all') {
    filtered = filtered.filter((t) => t.type === filters.type);
  }

  // Category filter
  if (filters.category !== 'all') {
    filtered = filtered.filter((t) => t.category === filters.category);
  }

  // Date range filter
  if (filters.dateRange !== 'all') {
    const now = new Date('2026-04-01');
    const days = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 }[filters.dateRange];
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    filtered = filtered.filter((t) => new Date(t.date) >= cutoff);
  }

  // Sort
  filtered.sort((a, b) => {
    const order = filters.sortOrder === 'asc' ? 1 : -1;
    if (filters.sortBy === 'date') {
      return (new Date(a.date).getTime() - new Date(b.date).getTime()) * order;
    }
    if (filters.sortBy === 'amount') {
      return (a.amount - b.amount) * order;
    }
    return a.category.localeCompare(b.category) * order;
  });

  return filtered;
}

// Helper: compute category spending
export function getCategorySpending(transactions: Transaction[]) {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const totals: Record<string, number> = {};
  expenses.forEach((t) => {
    totals[t.category] = (totals[t.category] || 0) + t.amount;
  });
  const total = Object.values(totals).reduce((a, b) => a + b, 0);
  return Object.entries(totals)
    .map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
      percentage: Math.round((amount / total) * 1000) / 10,
    }))
    .sort((a, b) => b.amount - a.amount);
}

// Helper: compute summary stats
export function getSummaryStats(transactions: Transaction[]) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  return {
    totalBalance: Math.round((income - expenses) * 100) / 100,
    totalIncome: Math.round(income * 100) / 100,
    totalExpenses: Math.round(expenses * 100) / 100,
    savingsRate: income > 0 ? Math.round(((income - expenses) / income) * 1000) / 10 : 0,
    transactionCount: transactions.length,
  };
}

'use client';

import { useCallback } from 'react';
import { Transaction } from '@/types';

export function useExport() {
  const exportCSV = useCallback((transactions: Transaction[], filename = 'transactions') => {
    const headers = ['Date', 'Description', 'Amount', 'Type', 'Category', 'Merchant'];
    const rows = transactions.map((t) => [
      t.date,
      `"${t.description}"`,
      t.amount.toFixed(2),
      t.type,
      t.category,
      `"${t.merchant || ''}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const exportJSON = useCallback((transactions: Transaction[], filename = 'transactions') => {
    const json = JSON.stringify(transactions, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  return { exportCSV, exportJSON };
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, getFilteredTransactions } from '@/store/useStore';
import { formatCurrency, formatDate, getRelativeDate } from '@/utils/helpers';
import { useExport } from '@/hooks/useExport';
import { categoryColors } from '@/data/mockData';
import { Category, TransactionType } from '@/types';
import TransactionModal from './TransactionModal';
import { CategoryIcon } from './IconResolver';
import GlowCard from './GlowCard';
import CustomSelect from './CustomSelect';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  DocumentArrowDownIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const categories: (Category | 'all')[] = [
  'all', 'Salary', 'Freelance', 'Investment', 'Food & Dining', 'Shopping',
  'Transportation', 'Entertainment', 'Healthcare', 'Education', 'Utilities',
  'Rent', 'Travel', 'Subscriptions', 'Gifts', 'Other',
];

export default function TransactionTable() {
  const { transactions, filters, setFilter, resetFilters, role, openModal, deleteTransaction } = useStore();
  const { exportCSV, exportJSON } = useExport();
  const [exportOpen, setExportOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredTransactions = getFilteredTransactions(transactions, filters);

  const totalIn = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalOut = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const net = totalIn - totalOut;

  const sortedChronologically = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const balanceMap = new Map<string, number>();
  let currentBalance = 0;
  for (const t of sortedChronologically) {
    currentBalance += (t.type === 'income' ? t.amount : -t.amount);
    balanceMap.set(t.id, currentBalance);
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 20, position: 'relative', zIndex: 20 }}
      >
       <GlowCard style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <div style={{ flex: '1 1 240px', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <MagnifyingGlassIcon style={{ position: 'absolute', left: 12, color: 'var(--text-tertiary)', width: 16, height: 16, minWidth: 16 }} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              className="input-field"
              style={{ paddingLeft: 36, paddingRight: filters.search ? 80 : 44 }}
            />
            {filters.search ? (
              <div style={{ position: 'absolute', right: 12, fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 500, pointerEvents: 'none' }}>
                {filteredTransactions.length} results
              </div>
            ) : (
              <div style={{
                position: 'absolute', right: 8, padding: '2px 6px',
                background: 'var(--bg-tertiary)', borderRadius: 4,
                fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 600, pointerEvents: 'none',
                border: '1px solid var(--border-primary)'
              }}>
                ⌘K
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <CustomSelect
              value={filters.type}
              onChange={(val) => setFilter('type', val as any)}
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'income', label: 'Income' },
                { value: 'expense', label: 'Expense' }
              ]}
              style={{ minWidth: 120 }}
            />

            <CustomSelect
              value={filters.category}
              onChange={(val) => setFilter('category', val as any)}
              options={categories.map(c => ({ value: c, label: c === 'all' ? 'All Categories' : c }))}
              style={{ minWidth: 160 }}
            />

            <CustomSelect
              value={filters.dateRange}
              onChange={(val) => setFilter('dateRange', val as any)}
              options={[
                { value: 'all', label: 'All Time' },
                { value: '7d', label: 'Last 7 Days' },
                { value: '30d', label: 'Last 30 Days' },
                { value: '90d', label: 'Last 90 Days' },
                { value: '1y', label: 'Last Year' }
              ]}
              style={{ minWidth: 140 }}
            />

            <CustomSelect
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(val) => {
                const [sortBy, sortOrder] = val.split('-') as [any, any];
                setFilter('sortBy', sortBy);
                setFilter('sortOrder', sortOrder);
              }}
              options={[
                { value: 'date-desc', label: 'Newest First' },
                { value: 'date-asc', label: 'Oldest First' },
                { value: 'amount-desc', label: 'Highest Amount' },
                { value: 'amount-asc', label: 'Lowest Amount' },
                { value: 'category-asc', label: 'Category A-Z' }
              ]}
              style={{ minWidth: 160 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
            <button className="btn-secondary" onClick={resetFilters}>
              Reset
            </button>

            <div style={{ position: 'relative' }}>
              <button className="btn-secondary" onClick={() => setExportOpen(!exportOpen)}>
                <DocumentArrowDownIcon style={{ width: 16, height: 16 }} />
                Export
              </button>
              <AnimatePresence>
                {exportOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: 4,
                      background: 'color-mix(in srgb, var(--bg-primary), transparent 30%)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-md)',
                      zIndex: 20,
                      minWidth: 140,
                    }}
                  >
                    <button
                      onClick={() => { exportCSV(filteredTransactions); setExportOpen(false); }}
                      style={{
                        display: 'block', width: '100%', padding: '8px 12px', background: 'none', border: 'none',
                        color: 'var(--text-primary)', fontSize: '0.85rem', textAlign: 'left', cursor: 'pointer',
                        borderBottom: '1px solid var(--border-primary)', fontFamily: 'inherit'
                      }}
                    >
                      Export CSV
                    </button>
                    <button
                      onClick={() => { exportJSON(filteredTransactions); setExportOpen(false); }}
                      style={{
                        display: 'block', width: '100%', padding: '8px 12px', background: 'none', border: 'none',
                        color: 'var(--text-primary)', fontSize: '0.85rem', textAlign: 'left', cursor: 'pointer',
                        fontFamily: 'inherit'
                      }}
                    >
                      Export JSON
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {role === 'admin' && (
              <button className="btn-primary" onClick={() => openModal()}>
                <PlusIcon style={{ width: 16, height: 16 }} />
                Add
              </button>
            )}
          </div>
        </div>
       </GlowCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '0 4px', 
          marginBottom: 16,
          marginTop: -4
        }}
      >
        <div style={{ display: 'flex', gap: 24, fontSize: '0.8125rem' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>Total In:</span>
            <span className="mono" style={{ color: 'var(--accent-success)', fontWeight: 600 }}>+{formatCurrency(totalIn)}</span>
          </div>
          <div style={{ width: 1, height: 12, backgroundColor: 'var(--border-primary)', margin: 'auto 0' }} />
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>Total Out:</span>
            <span className="mono" style={{ color: 'var(--accent-danger)', fontWeight: 600 }}>-{formatCurrency(totalOut)}</span>
          </div>
          <div style={{ width: 1, height: 12, backgroundColor: 'var(--border-primary)', margin: 'auto 0' }} />
          <div style={{ 
            display: 'flex', gap: 6, alignItems: 'center', 
            background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: 12, 
            border: '1px solid var(--border-primary)' 
          }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net</span>
            <span className="mono" style={{ color: net >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)', fontWeight: 700 }}>
              {net >= 0 ? '+' : '-'}{formatCurrency(Math.abs(net))}
            </span>
          </div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
          {filteredTransactions.length} of {transactions.length} records
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
       <GlowCard style={{ overflow: 'hidden' }}>
        {filteredTransactions.length === 0 ? (
          <div style={{ 
            padding: '100px 40px', 
            textAlign: 'center', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(ellipse at top, color-mix(in srgb, var(--bg-secondary), transparent 80%), transparent 70%)'
          }}>
            <div style={{
              width: 80, height: 80, 
              borderRadius: '50%', 
              background: 'color-mix(in srgb, var(--border-primary), transparent 70%)',
              border: '1px solid var(--border-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 24, 
              boxShadow: 'var(--shadow-lg), inset 0 0 20px rgba(0,0,0,0.5)'
            }}>
              <MagnifyingGlassIcon style={{ width: 36, height: 36, color: 'color-mix(in srgb, var(--text-tertiary), var(--text-secondary) 50%)' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12, letterSpacing: '-0.01em' }}>
              No transactions match your filters
            </h3>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', maxWidth: 320, marginBottom: 32, lineHeight: 1.5 }}>
              Try adjusting your search keywords, timeframe, or category to find what you're looking for.
            </p>
            <button 
              className="btn-primary" 
              onClick={resetFilters} 
              style={{ padding: '8px 20px', borderRadius: 20 }}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: 24 }}>Description</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th style={{ textAlign: 'right' }}>Balance</th>
                  {role === 'admin' && <th style={{ textAlign: 'center', width: 90 }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredTransactions.map((t, i) => {
                    const rowColor = categoryColors[t.category as string] || 'var(--text-tertiary)';
                    const rowBalance = balanceMap.get(t.id) || 0;
                    return (
                      <motion.tr
                        key={t.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: Math.min(i * 0.01, 0.2) }}
                        className="interactive-row"
                        style={{ position: 'relative' }}
                      >
                        <td style={{ paddingLeft: 24, position: 'relative' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-secondary)',
                                flexShrink: 0,
                              }}
                            >
                              <CategoryIcon category={t.category} className="w-5 h-5" />
                            </div>
                            <div>
                              <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{t.description}</p>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{t.merchant}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{formatDate(t.date)}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{getRelativeDate(t.date)}</p>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            {t.category}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                            {t.type}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className="mono" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className="mono" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                            {formatCurrency(rowBalance)}
                          </span>
                        </td>
                        {role === 'admin' && (
                          <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                            <div className="row-actions" style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                              <button className="btn-icon subtle-action" onClick={() => openModal(t)}>
                                <PencilIcon style={{ width: 16, height: 16 }} />
                              </button>
                              {deleteConfirm === t.id ? (
                                <button className="btn-icon" onClick={() => { deleteTransaction(t.id); setDeleteConfirm(null); }} style={{ color: 'var(--accent-danger)', backgroundColor: 'var(--accent-danger-light)' }}>
                                  <CheckIcon style={{ width: 16, height: 16 }} />
                                </button>
                              ) : (
                                <button className="btn-icon subtle-action" onClick={() => setDeleteConfirm(t.id)}>
                                  <TrashIcon style={{ width: 16, height: 16 }} />
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
       </GlowCard>
      </motion.div>

      <TransactionModal />

      <style jsx global>{`
        .interactive-row {
          transition: background-color 0.2s ease;
        }
        .interactive-row:hover {
          background-color: var(--bg-tertiary) !important;
        }
        .row-actions .subtle-action {
          opacity: 0;
          transform: scale(0.9);
          transition: all 0.2s ease;
        }
        .interactive-row:hover .row-actions .subtle-action {
          opacity: 1;
          transform: scale(1);
        }
      `}</style>
    </div>
  );
}

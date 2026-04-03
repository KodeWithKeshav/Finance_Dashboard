'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, getFilteredTransactions } from '@/store/useStore';
import { formatCurrency, formatDate, getRelativeDate } from '@/utils/helpers';
import { useExport } from '@/hooks/useExport';
import TransactionModal from './TransactionModal';
import { Category, TransactionType } from '@/types';
import { CategoryIcon } from './IconResolver';
import GlowCard from './GlowCard';
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

  const filteredTransactions = getFilteredTransactions(transactions, filters);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 20 }}
      >
       <GlowCard style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <MagnifyingGlassIcon style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-tertiary)', width: 16, height: 16, minWidth: 16 }} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              className="input-field"
              style={{ paddingLeft: 36 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <select
              value={filters.type}
              onChange={(e) => setFilter('type', e.target.value as TransactionType | 'all')}
              className="select-field"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilter('category', e.target.value as Category | 'all')}
              className="select-field"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
              ))}
            </select>

            <select
              value={filters.dateRange}
              onChange={(e) => setFilter('dateRange', e.target.value as any)}
              className="select-field"
            >
              <option value="all">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>

            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-') as [any, any];
                setFilter('sortBy', sortBy);
                setFilter('sortOrder', sortOrder);
              }}
              className="select-field"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
              <option value="category-asc">Category A-Z</option>
            </select>
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
        <div style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
          Showing {filteredTransactions.length} of {transactions.length} records
        </div>
       </GlowCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
       <GlowCard style={{ overflow: 'hidden' }}>
        {filteredTransactions.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <FunnelIcon style={{ width: 48, height: 48, margin: '0 auto 16px', color: 'var(--text-tertiary)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
              No entries found
            </h3>
            <button className="btn-secondary" onClick={resetFilters} style={{ marginTop: 16 }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  {role === 'admin' && <th style={{ textAlign: 'center', width: 100 }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredTransactions.map((t, i) => (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: Math.min(i * 0.01, 0.2) }}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
                            <CategoryIcon category={t.category} className="w-4 h-4" />
                          </div>
                          <div>
                            <p style={{ fontWeight: 500, fontSize: '0.875rem' }}>{t.description}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{t.merchant}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p style={{ fontSize: '0.875rem' }}>{formatDate(t.date)}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{getRelativeDate(t.date)}</p>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {t.category}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="mono" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </span>
                      </td>
                      {role === 'admin' && (
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                            <button className="btn-icon" onClick={() => openModal(t)}>
                              <PencilIcon style={{ width: 16, height: 16 }} />
                            </button>
                            {deleteConfirm === t.id ? (
                              <button className="btn-icon" onClick={() => { deleteTransaction(t.id); setDeleteConfirm(null); }} style={{ color: 'var(--accent-danger)', borderColor: 'var(--accent-danger)' }}>
                                <CheckIcon style={{ width: 16, height: 16 }} />
                              </button>
                            ) : (
                              <button className="btn-icon" onClick={() => setDeleteConfirm(t.id)}>
                                <TrashIcon style={{ width: 16, height: 16 }} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
       </GlowCard>
      </motion.div>

      <TransactionModal />
    </div>
  );
}

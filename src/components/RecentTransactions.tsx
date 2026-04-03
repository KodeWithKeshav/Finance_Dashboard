'use client';

import { motion } from 'framer-motion';
import { formatCurrency, formatDate, getRelativeDate } from '@/utils/helpers';
import { Transaction } from '@/types';
import { CategoryIcon } from './IconResolver';
import GlowCard from './GlowCard';
import { categoryColors } from '@/data/mockData';
import { useStore } from '@/store/useStore';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recent = transactions.slice(0, 6);
  const { setActivePage } = useStore();
  const netTotal = recent.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
     <GlowCard style={{ padding: 24, display: 'flex', flexDirection: 'column', minHeight: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Recent Activity
        </h3>
        <button 
          onClick={() => setActivePage('transactions')}
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          View All →
        </button>
      </div>

      {recent.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>No transactions found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {recent.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 0',
                borderBottom: i < recent.length - 1 ? '1px solid var(--border-primary)' : 'none',
              }}
            >
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
                  position: 'relative',
                }}
              >
                <CategoryIcon category={t.category} className="w-4 h-4" />
                <span 
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: categoryColors[t.category] || 'var(--border-secondary)',
                    border: '2px solid var(--bg-primary)'
                  }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {t.description}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                  {t.merchant} · {getRelativeDate(t.date)}
                </p>
              </div>
              <span
                className="mono"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: t.type === 'income' ? 'var(--accent-success)' : 'var(--text-primary)',
                  flexShrink: 0,
                }}
              >
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </span>
            </motion.div>
          ))}
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '16px',
            borderTop: '1px dashed var(--border-primary)',
            marginTop: '8px'
          }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Net Total
            </span>
            <span className="mono" style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: netTotal >= 0 ? '#10b981' : 'var(--text-primary)'
            }}>
              {netTotal >= 0 ? '+' : '-'}{formatCurrency(Math.abs(netTotal))}
            </span>
          </div>
        </div>
      )}
     </GlowCard>
    </motion.div>
  );
}

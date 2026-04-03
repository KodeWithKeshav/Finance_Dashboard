'use client';

import { LightBulbIcon, ChartPieIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import GlowCard from './GlowCard';
import { formatCurrency } from '@/utils/helpers';
import { Transaction } from '@/types';

interface Props {
  transactions: Transaction[];
  categorySpending: { category: string; amount: number; percentage: number }[];
}

export default function QuickInsightsStrip({ transactions, categorySpending }: Props) {
  const highestCategory = categorySpending[0];

  const expenses = transactions.filter((t) => t.type === 'expense');
  const marchExpenses = expenses.filter((t) => t.date.startsWith('2026-03')).reduce((s, t) => s + t.amount, 0);
  const febExpenses = expenses.filter((t) => t.date.startsWith('2026-02')).reduce((s, t) => s + t.amount, 0);
  const momChange = febExpenses > 0 ? ((marchExpenses - febExpenses) / febExpenses) * 100 : 0;

  // Auto-generated observation logic comparing Food & Dining
  const marchDining = expenses.filter((t) => t.date.startsWith('2026-03') && t.category === 'Food & Dining').reduce((s, t) => s + t.amount, 0);
  const febDining = expenses.filter((t) => t.date.startsWith('2026-02') && t.category === 'Food & Dining').reduce((s, t) => s + t.amount, 0);
  
  let observation = '';
  if (febDining > 0) {
    const diningChange = ((marchDining - febDining) / febDining) * 100;
    if (diningChange < 0) {
      observation = `You spent ${Math.abs(Math.round(diningChange))}% less on dining this month.`;
    } else {
      observation = `Dining expenses increased by ${Math.round(diningChange)}% this month.`;
    }
  } else {
    observation = 'Consistency is key. Keep tracking your daily expenses.';
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '24px', marginBottom: '28px' }}>
      <GlowCard style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ padding: '10px', background: 'var(--bg-tertiary)', borderRadius: '12px', color: 'var(--text-secondary)' }}>
          <ChartPieIcon className="w-6 h-6" />
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: '2px' }}>Highest Spend Area</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>
            {highestCategory ? highestCategory.category : 'N/A'} <span className="mono" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>({highestCategory ? formatCurrency(highestCategory.amount) : '0'})</span>
          </p>
        </div>
      </GlowCard>

      <GlowCard style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ padding: '10px', background: 'var(--bg-tertiary)', borderRadius: '12px', color: momChange > 0 ? 'var(--accent-danger)' : 'var(--accent-success)' }}>
          {momChange > 0 ? <ArrowTrendingUpIcon className="w-6 h-6" /> : <ArrowTrendingDownIcon className="w-6 h-6" />}
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: '2px' }}>MoM Spending Change</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>
            {momChange > 0 ? '+' : ''}{momChange.toFixed(1)}% <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>vs last month</span>
          </p>
        </div>
      </GlowCard>

      <GlowCard style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ padding: '10px', background: 'var(--bg-tertiary)', borderRadius: '12px', color: '#eab308' }}>
          <LightBulbIcon className="w-6 h-6" />
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: '2px' }}>AI Observation</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>
            {observation}
          </p>
        </div>
      </GlowCard>
    </div>
  );
}

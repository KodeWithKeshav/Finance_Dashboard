'use client';

import { motion } from 'framer-motion';
import { formatCurrency } from '@/utils/helpers';
import { BanknotesIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, ScaleIcon, ChartBarSquareIcon } from '@heroicons/react/24/outline';
import GlowCard from './GlowCard';

interface StatCardsProps {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  transactionCount: number;
  topCategory?: { category: string; amount: number; percentage: number; } | null;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function StatCards({
  totalBalance,
  totalIncome,
  totalExpenses,
  savingsRate,
  transactionCount,
  topCategory,
}: StatCardsProps) {
  const stats = [
    {
      label: 'Balance',
      value: formatCurrency(totalBalance),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: <BanknotesIcon className="w-5 h-5" />,
    },
    {
      label: 'Income',
      value: formatCurrency(totalIncome),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: <ArrowTrendingUpIcon className="w-5 h-5" />,
    },
    {
      label: 'Expenses',
      value: formatCurrency(totalExpenses),
      change: '-3.1%',
      changeType: 'negative' as const,
      icon: <ArrowTrendingDownIcon className="w-5 h-5" />,
    },
    {
      label: 'Savings Rate',
      value: `${savingsRate}%`,
      change: `${transactionCount} txns`,
      changeType: 'neutral' as const,
      icon: <ScaleIcon className="w-5 h-5" />,
    },
    {
      label: 'Top Expense',
      value: topCategory ? topCategory.category : 'N/A',
      change: topCategory ? `${formatCurrency(topCategory.amount)} (${Math.round(topCategory.percentage)}%)` : '-',
      changeType: 'neutral' as const,
      icon: <ChartBarSquareIcon className="w-5 h-5" />,
    },
  ];

  return (
    <motion.div 
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }} 
      variants={container} 
      initial="hidden" 
      animate="show"
    >
      {stats.map((stat) => (
        <motion.div key={stat.label} variants={item}>
          <GlowCard style={{ padding: 24 }}>
            <div className="stat-header">
              <span className="stat-label">{stat.label}</span>
              <div className="stat-icon">
                {stat.icon}
              </div>
            </div>
            <div className="stat-body">
              <p className="stat-value mono">{stat.value}</p>
              <span className={`stat-change ${stat.changeType}`}>
                {stat.changeType === 'positive' && '+'}
                {stat.changeType === 'negative' && ''}
                {stat.change}
              </span>
            </div>
          </GlowCard>

          <style jsx>{`
            .stat-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 24px;
            }
            .stat-label {
              font-size: 0.875rem;
              color: var(--text-secondary);
              font-weight: 500;
            }
            .stat-icon {
              color: var(--text-tertiary);
            }
            .stat-body {
              display: flex;
              align-items: baseline;
              gap: 12px;
            }
            .stat-value {
              font-size: 1.5rem;
              font-weight: 700;
              color: var(--text-primary);
              letter-spacing: -0.02em;
            }
            .stat-change {
              font-size: 0.75rem;
              font-weight: 500;
            }
            .stat-change.positive { color: var(--accent-success); }
            .stat-change.negative { color: var(--accent-danger); }
            .stat-change.neutral { color: var(--text-tertiary); }
          `}</style>
        </motion.div>
      ))}
    </motion.div>
  );
}

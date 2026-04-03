'use client';

import { motion } from 'framer-motion';
import { useStore, getCategorySpending, getSummaryStats } from '@/store/useStore';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { categoryColors } from '@/data/mockData';
import { CategoryIcon } from './IconResolver';
import { ChartBarSquareIcon, WalletIcon, CurrencyDollarIcon, TagIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, CheckBadgeIcon, ScaleIcon } from '@heroicons/react/24/outline';
import GlowCard from './GlowCard';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function InsightsPanel() {
  const { transactions } = useStore();
  const stats = getSummaryStats(transactions);
  const categorySpending = getCategorySpending(transactions);

  const expenses = transactions.filter((t) => t.type === 'expense');
  const incomes = transactions.filter((t) => t.type === 'income');

  const highestCategory = categorySpending[0];
  const avgExpense = expenses.length > 0 ? expenses.reduce((s, t) => s + t.amount, 0) / expenses.length : 0;
  const avgIncome = incomes.length > 0 ? incomes.reduce((s, t) => s + t.amount, 0) / incomes.length : 0;

  const marchExpenses = expenses.filter((t) => t.date.startsWith('2026-03')).reduce((s, t) => s + t.amount, 0);
  const febExpenses = expenses.filter((t) => t.date.startsWith('2026-02')).reduce((s, t) => s + t.amount, 0);
  const monthChange = febExpenses > 0 ? ((marchExpenses - febExpenses) / febExpenses * 100) : 0;

  const marchIncome = incomes.filter((t) => t.date.startsWith('2026-03')).reduce((s, t) => s + t.amount, 0);
  const febIncome = incomes.filter((t) => t.date.startsWith('2026-02')).reduce((s, t) => s + t.amount, 0);
  const incomeChange = febIncome > 0 ? ((marchIncome - febIncome) / febIncome * 100) : 0;

  const dailyAvg = marchExpenses / 31;
  const subscriptions = expenses.filter((t) => t.category === 'Subscriptions');
  const subscriptionTotal = subscriptions.reduce((s, t) => s + t.amount, 0);
  const uniqueCategories = new Set(expenses.map((t) => t.category)).size;

  const insights = [
    {
      title: 'Highest Category',
      description: highestCategory ? `${highestCategory.category} accounts for ${Math.round(highestCategory.percentage)}% of spending.` : 'N/A',
      icon: <ChartBarSquareIcon className="w-5 h-5" />,
      highlight: highestCategory ? formatCurrency(highestCategory.amount) : '-',
    },
    {
      title: 'MoM Expense Trend',
      description: monthChange > 0 ? `Spending increased by ${monthChange.toFixed(1)}%.` : `Spending decreased by ${Math.abs(monthChange).toFixed(1)}%.`,
      icon: monthChange > 0 ? <ArrowTrendingUpIcon className="w-5 h-5" /> : <ArrowTrendingDownIcon className="w-5 h-5" />,
      highlight: `${monthChange > 0 ? '+' : ''}${monthChange.toFixed(1)}%`,
    },
    {
      title: 'Income Growth',
      description: incomeChange > 0 ? `Income grew by ${incomeChange.toFixed(1)}%.` : `Income decreased by ${Math.abs(incomeChange).toFixed(1)}%.`,
      icon: <CheckBadgeIcon className="w-5 h-5" />,
      highlight: `${incomeChange > 0 ? '+' : ''}${incomeChange.toFixed(1)}%`,
    },
    {
      title: 'Savings Rate',
      description: `Saving ${stats.savingsRate}% of total income.`,
      icon: <ScaleIcon className="w-5 h-5" />,
      highlight: `${stats.savingsRate}%`,
    },
    {
      title: 'Daily Spending',
      description: `Average daily spending this month.`,
      icon: <WalletIcon className="w-5 h-5" />,
      highlight: formatCurrency(dailyAvg),
    },
    {
      title: 'Subscriptions',
      description: `Total cost across ${subscriptions.length} recurring charges.`,
      icon: <CurrencyDollarIcon className="w-5 h-5" />,
      highlight: formatCurrency(subscriptionTotal),
    },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total TXNs', value: transactions.length, icon: <ChartBarSquareIcon className="w-5 h-5" /> },
          { label: 'Avg Expense', value: formatCurrency(avgExpense), icon: <WalletIcon className="w-5 h-5" /> },
          { label: 'Avg Income', value: formatCurrency(avgIncome), icon: <CurrencyDollarIcon className="w-5 h-5" /> },
          { label: 'Categories Used', value: uniqueCategories, icon: <TagIcon className="w-5 h-5" /> },
        ].map((m, i) => (
          <motion.div key={i} variants={item}>
            <GlowCard style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{m.label}</span>
                <span style={{ color: 'var(--text-tertiary)' }}>{m.icon}</span>
              </div>
              <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 600 }}>{m.value}</div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 28 }}>
        {insights.map((insight, i) => (
          <motion.div key={i} variants={item}>
            <GlowCard style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', flexShrink: 0 }}>
                  {insight.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>{insight.title}</h3>
                    <span className="mono" style={{ fontSize: '0.875rem', fontWeight: 600 }}>{insight.highlight}</span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{insight.description}</p>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        <motion.div variants={item}>
          <GlowCard style={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 20 }}>Top Expenses</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {expenses.slice(0, 5).map((t, i) => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottom: i < 4 ? '1px solid var(--border-primary)' : 'none' }}>
                  <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>0{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{t.description}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{formatDate(t.date)}</p>
                  </div>
                  <span className="mono" style={{ fontWeight: 600, fontSize: '0.875rem' }}>{formatCurrency(t.amount)}</span>
                </div>
              ))}
            </div>
          </GlowCard>
        </motion.div>

        <motion.div variants={item}>
          <GlowCard style={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 20 }}>Distribution</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {categorySpending.slice(0, 6).map((cat) => (
                <div key={cat.category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.875rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                      <CategoryIcon category={cat.category} className="w-4 h-4" />
                      {cat.category}
                    </span>
                    <span className="mono" style={{ fontWeight: 600 }}>{formatCurrency(cat.amount)}</span>
                  </div>
                  <div style={{ width: '100%', height: 4, background: 'var(--border-primary)', borderRadius: 2 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      style={{ height: '100%', background: categoryColors[cat.category] || 'var(--text-primary)', borderRadius: 2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>
        </motion.div>
      </div>
    </motion.div>
  );
}

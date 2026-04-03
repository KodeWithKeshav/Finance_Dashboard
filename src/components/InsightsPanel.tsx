'use client';

import { motion } from 'framer-motion';
import { useStore, getCategorySpending, getSummaryStats } from '@/store/useStore';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { categoryColors } from '@/data/mockData';
import { CategoryIcon } from './IconResolver';
import { ChartBarSquareIcon, WalletIcon, CurrencyDollarIcon, TagIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, CheckBadgeIcon, ScaleIcon } from '@heroicons/react/24/outline';
import GlowCard from './GlowCard';
import {
  ResponsiveContainer, ComposedChart, BarChart, Bar, Line, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { monthlyData } from '@/data/mockData';

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
        {(() => {
          // Generate monthly transaction counts for sparkline
          const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
          const txnsByMonth = months.map(m => transactions.filter(t => t.date.includes(`-${m}-`)).length);
          const expensesByMonth = months.map(m => {
            const monthExpenses = expenses.filter(t => t.date.includes(`-${m}-`));
            return monthExpenses.length > 0 ? monthExpenses.reduce((s, t) => s + t.amount, 0) / monthExpenses.length : 0;
          });
          const incomesByMonth = months.map(m => {
            const monthIncomes = incomes.filter(t => t.date.includes(`-${m}-`));
            return monthIncomes.length > 0 ? monthIncomes.reduce((s, t) => s + t.amount, 0) / monthIncomes.length : 0;
          });
          const catsByMonth = months.map(m => new Set(transactions.filter(t => t.date.includes(`-${m}-`)).map(t => t.category)).size);

          const MiniSparkline = ({ data, color, height = 32 }: { data: number[], color: string, height?: number }) => {
            const filtered = data.filter(d => d > 0);
            if (filtered.length === 0) return null;
            const max = Math.max(...filtered);
            const min = Math.min(...filtered);
            const range = max - min || 1;
            const w = 80;
            const points = filtered.map((d, i) => {
              const x = (i / (filtered.length - 1)) * w;
              const y = height - ((d - min) / range) * (height - 4) - 2;
              return `${x},${y}`;
            }).join(' ');
            return (
              <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id={`grad-${color.replace(/[^a-z]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  points={points}
                  fill="none"
                  stroke={color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polygon
                  points={`0,${height} ${points} ${w},${height}`}
                  fill={`url(#grad-${color.replace(/[^a-z]/gi, '')})`}
                />
              </svg>
            );
          };

          const MiniBarChart = ({ data, color, height = 32 }: { data: number[], color: string, height?: number }) => {
            const filtered = data.filter(d => d > 0);
            if (filtered.length === 0) return null;
            const max = Math.max(...filtered);
            const w = 80;
            const barW = Math.max(4, (w / filtered.length) - 2);
            return (
              <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`}>
                {filtered.map((d, i) => {
                  const barH = (d / max) * (height - 2);
                  const x = i * (barW + 2);
                  return (
                    <rect
                      key={i}
                      x={x} y={height - barH}
                      width={barW} height={barH}
                      rx={2}
                      fill={color}
                      opacity={i === filtered.length - 1 ? 1 : 0.4}
                    />
                  );
                })}
              </svg>
            );
          };

          const cards = [
            {
              label: 'Total TXNs', value: transactions.length,
              icon: <ChartBarSquareIcon className="w-5 h-5" />,
              chart: <MiniSparkline data={txnsByMonth} color="var(--text-secondary)" />,
            },
            {
              label: 'Avg Expense', value: formatCurrency(avgExpense),
              icon: <WalletIcon className="w-5 h-5" />,
              chart: <MiniBarChart data={expensesByMonth} color="var(--accent-danger)" />,
              change: monthChange,
            },
            {
              label: 'Avg Income', value: formatCurrency(avgIncome),
              icon: <CurrencyDollarIcon className="w-5 h-5" />,
              chart: <MiniBarChart data={incomesByMonth} color="var(--accent-success)" />,
              change: incomeChange,
            },
            {
              label: 'Categories Used', value: uniqueCategories,
              icon: <TagIcon className="w-5 h-5" />,
              chart: <MiniSparkline data={catsByMonth} color="var(--text-secondary)" />,
            },
          ];

          return cards.map((m, i) => (
            <motion.div key={i} variants={item}>
              <GlowCard style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{m.label}</span>
                  <span style={{ color: 'var(--text-tertiary)' }}>{m.icon}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 700 }}>{m.value}</div>
                    {m.change !== undefined && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        marginTop: 6, padding: '2px 8px', borderRadius: 12,
                        fontSize: '0.7rem', fontWeight: 600,
                        background: m.change >= 0 ? 'var(--accent-success-light)' : 'var(--accent-danger-light)',
                        color: m.change >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)',
                      }}>
                        {m.change >= 0 ? '↑' : '↓'} {Math.abs(m.change).toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div style={{ opacity: 0.8, flexShrink: 0 }}>
                    {m.chart}
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ));
        })()}
      </div>

      {/* Insight Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {(() => {
          const savingsNum = typeof stats.savingsRate === 'string' ? parseFloat(stats.savingsRate) : Number(stats.savingsRate) || 0;

          const MiniRing = ({ percent, color, size = 40 }: { percent: number, color: string, size?: number }) => {
            const r = (size - 6) / 2;
            const circ = 2 * Math.PI * r;
            const offset = circ - (Math.min(percent, 100) / 100) * circ;
            return (
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-primary)" strokeWidth="3" />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="3"
                  strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                  transform={`rotate(-90 ${size / 2} ${size / 2})`} />
                <text x={size / 2} y={size / 2} textAnchor="middle" dy="0.35em"
                  fill={color} fontSize="10" fontWeight="700" fontFamily="inherit">
                  {Math.round(percent)}
                </text>
              </svg>
            );
          };

          const ProgressBar = ({ value, max, color }: { value: number, max: number, color: string }) => {
            const pct = Math.min((value / (max || 1)) * 100, 100);
            return (
              <div style={{ width: '100%', height: 4, background: 'var(--border-primary)', borderRadius: 2, marginTop: 12 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ height: '100%', background: color, borderRadius: 2 }}
                />
              </div>
            );
          };

          const insightCards = [
            {
              title: 'Highest Category',
              value: highestCategory ? formatCurrency(highestCategory.amount) : '-',
              sub: highestCategory ? `${highestCategory.category} · ${Math.round(highestCategory.percentage)}% of spend` : 'N/A',
              color: 'var(--accent-warning)',
              visual: highestCategory ? <MiniRing percent={highestCategory.percentage} color="var(--accent-warning)" /> : null,
              bar: highestCategory ? { value: highestCategory.percentage, max: 100, color: 'var(--accent-warning)' } : null,
            },
            {
              title: 'MoM Expense Trend',
              value: `${monthChange > 0 ? '+' : ''}${monthChange.toFixed(1)}%`,
              sub: monthChange > 0 ? 'Spending up from last month' : 'Spending down from last month',
              color: monthChange > 0 ? 'var(--accent-danger)' : 'var(--accent-success)',
              visual: null,
              bar: { value: Math.abs(monthChange), max: 50, color: monthChange > 0 ? 'var(--accent-danger)' : 'var(--accent-success)' },
            },
            {
              title: 'Income Growth',
              value: `${incomeChange > 0 ? '+' : ''}${incomeChange.toFixed(1)}%`,
              sub: incomeChange > 0 ? 'Income grew this month' : 'Income declined this month',
              color: incomeChange >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)',
              visual: null,
              bar: { value: Math.abs(incomeChange), max: 100, color: incomeChange >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' },
            },
            {
              title: 'Savings Rate',
              value: `${stats.savingsRate}%`,
              sub: savingsNum >= 20 ? 'Healthy savings maintained' : 'Below recommended 20%',
              color: savingsNum >= 20 ? 'var(--accent-success)' : 'var(--accent-warning)',
              visual: <MiniRing percent={savingsNum} color={savingsNum >= 20 ? 'var(--accent-success)' : 'var(--accent-warning)'} />,
              bar: { value: savingsNum, max: 100, color: savingsNum >= 20 ? 'var(--accent-success)' : 'var(--accent-warning)' },
            },
            {
              title: 'Daily Spending',
              value: formatCurrency(dailyAvg),
              sub: 'Avg daily spend this month',
              color: 'var(--text-secondary)',
              visual: null,
              bar: { value: dailyAvg, max: avgExpense * 2, color: 'var(--text-secondary)' },
            },
            {
              title: 'Subscriptions',
              value: formatCurrency(subscriptionTotal),
              sub: `${subscriptions.length} recurring charges`,
              color: 'var(--text-secondary)',
              visual: null,
              bar: { value: subscriptionTotal, max: stats.totalExpenses, color: 'var(--text-secondary)' },
            },
          ];

          return insightCards.map((card, i) => (
            <motion.div key={i} variants={item}>
              <GlowCard style={{ padding: 20, height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: card.color, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{card.title}</span>
                    </div>
                    <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                      {card.value}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{card.sub}</p>
                    {card.bar && <ProgressBar value={card.bar.value} max={card.bar.max} color={card.bar.color} />}
                  </div>
                  {card.visual && (
                    <div style={{ flexShrink: 0, marginLeft: 16 }}>
                      {card.visual}
                    </div>
                  )}
                </div>
              </GlowCard>
            </motion.div>
          ));
        })()}
      </div>

      {/* Charts Section */}
      {(() => {
        const months = ['Jan', 'Feb', 'Mar'];
        const monthPrefixes = ['2026-01', '2026-02', '2026-03'];

        const topCats = [...new Set(expenses.map(t => t.category))].slice(0, 6);
        const catOverTimeData = months.map((m, mi) => {
          const row: Record<string, any> = { month: m };
          topCats.forEach(cat => {
            row[cat] = expenses
              .filter(t => t.date.startsWith(monthPrefixes[mi]) && t.category === cat)
              .reduce((s, t) => s + t.amount, 0);
          });
          return row;
        });

        const compData = months.map((m, mi) => ({
          month: m,
          Income: transactions.filter(t => t.type === 'income' && t.date.startsWith(monthPrefixes[mi])).reduce((s, t) => s + t.amount, 0),
          Expense: transactions.filter(t => t.type === 'expense' && t.date.startsWith(monthPrefixes[mi])).reduce((s, t) => s + t.amount, 0),
        }));

        const ttStyle = {
          contentStyle: { background: '#0a0a0a', border: '1px solid #262626', borderRadius: 8, fontSize: '0.8rem', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', padding: '10px 14px' },
          labelStyle: { color: '#fafafa', fontWeight: 600 as const, marginBottom: 6 },
          itemStyle: { color: '#a3a3a3', fontSize: '0.75rem', padding: '1px 0' },
          cursor: { fill: 'rgba(255,255,255,0.04)' },
        };

        return (
          <>
            <motion.div variants={item} style={{ marginBottom: 28 }}>
              <GlowCard style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Monthly Trend</h3>
                  <div style={{ display: 'flex', gap: 16, fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--accent-success)' }} />Income</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--accent-danger)' }} />Expense</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 3, borderRadius: 2, background: 'var(--text-primary)' }} />Balance</span>
                  </div>
                </div>
                <div style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value: any) => formatCurrency(Number(value))} {...ttStyle} />
                      <Area type="monotone" dataKey="income" fill="var(--accent-success)" fillOpacity={0.08} stroke="var(--accent-success)" strokeWidth={2} name="Income" />
                      <Area type="monotone" dataKey="expense" fill="var(--accent-danger)" fillOpacity={0.08} stroke="var(--accent-danger)" strokeWidth={2} name="Expense" />
                      <Line type="monotone" dataKey="balance" stroke="var(--text-primary)" strokeWidth={2} strokeDasharray="6 3" dot={{ fill: 'var(--text-primary)', r: 3 }} name="Balance" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </GlowCard>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
              <motion.div variants={item}>
                <GlowCard style={{ padding: 24, height: '100%' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 20 }}>Category Breakdown Over Time</h3>
                  <div style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={catOverTimeData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                        <Tooltip formatter={(value: any) => formatCurrency(Number(value))} {...ttStyle} />
                        {topCats.map(cat => (
                          <Bar key={cat} dataKey={cat} stackId="a" fill={categoryColors[cat] || '#64748b'} />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
                    {topCats.map(cat => (
                      <span key={cat} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                        <span style={{ width: 6, height: 6, borderRadius: 2, background: categoryColors[cat] || '#64748b' }} />
                        {cat}
                      </span>
                    ))}
                  </div>
                </GlowCard>
              </motion.div>

              <motion.div variants={item}>
                <GlowCard style={{ padding: 24, height: '100%' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 20 }}>Income vs Expense</h3>
                  <div style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={compData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(value: any) => formatCurrency(Number(value))} {...ttStyle} />
                        <Bar dataKey="Income" fill="var(--accent-success)" radius={[4, 4, 0, 0]} barSize={28} />
                        <Bar dataKey="Expense" fill="var(--accent-danger)" radius={[4, 4, 0, 0]} barSize={28} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--accent-success)' }} />Income
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--accent-danger)' }} />Expense
                    </span>
                  </div>
                </GlowCard>
              </motion.div>
            </div>
          </>
        );
      })()}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <motion.div variants={item}>
          <GlowCard style={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 20 }}>Top Expenses</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
              {expenses.slice(0, 6).map((t, i) => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 14, borderBottom: i < 5 ? '1px solid var(--border-primary)' : 'none' }}>
                  <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', width: 18 }}>0{i + 1}</span>
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
          <GlowCard style={{ padding: 28, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 24 }}>Distribution</h3>

            {/* Category Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
              {categorySpending.slice(0, 6).map((cat, i) => (
                <div key={cat.category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span style={{
                        width: 10, height: 10, borderRadius: 3,
                        background: categoryColors[cat.category] || '#64748b', flexShrink: 0
                      }} />
                      {cat.category}
                    </span>
                    <span className="mono" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        color: 'var(--text-tertiary)', fontWeight: 500,
                        background: 'var(--bg-tertiary)',
                        padding: '2px 7px', borderRadius: 4, fontSize: '0.7rem'
                      }}>
                        {Math.round(cat.percentage)}%
                      </span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatCurrency(cat.amount)}</span>
                    </span>
                  </div>
                  <div style={{ width: '100%', height: 6, background: 'var(--border-primary)', borderRadius: 3, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percentage}%` }}
                      transition={{ duration: 0.7, delay: i * 0.08, ease: 'easeOut' }}
                      style={{
                        height: '100%', borderRadius: 3,
                        background: `linear-gradient(90deg, ${categoryColors[cat.category] || '#64748b'}, ${categoryColors[cat.category] || '#64748b'}cc)`
                      }}
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

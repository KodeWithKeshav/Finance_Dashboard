'use client';

import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { monthlyData, categoryColors } from '@/data/mockData';
import { formatCurrency } from '@/utils/helpers';
import { CategoryIcon } from './IconResolver';

interface SpendingData {
  category: string;
  amount: number;
  percentage: number;
}

interface ChartsProps {
  categorySpending: SpendingData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 8, fontSize: '0.875rem' }}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 2 }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: entry.color, marginRight: 6 }} />
            {entry.name}: <span className="mono">{formatCurrency(entry.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.875rem' }}>{payload[0].name}</p>
        <p className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export function BalanceTrendChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="panel-card"
      style={{ padding: '24px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Flow Overview</h3>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
            <span style={{ width: 8, height: 2, background: 'var(--text-primary)', display: 'inline-block' }} />
            Income
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
            <span style={{ width: 8, height: 2, background: 'var(--border-secondary)', display: 'inline-block' }} />
            Expenses
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
            axisLine={{ stroke: 'var(--border-primary)' }}
            tickLine={false}
            dy={10}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--text-tertiary)', fontFamily: "'JetBrains Mono', monospace" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="var(--text-primary)"
            strokeWidth={1.5}
            fill="transparent"
            activeDot={{ fill: 'var(--bg-primary)', stroke: 'var(--text-primary)', strokeWidth: 2, r: 4 }}
          />
          <Area
            type="monotone"
            dataKey="expense"
            name="Expenses"
            stroke="var(--border-secondary)"
            strokeWidth={1.5}
            fill="transparent"
            activeDot={{ fill: 'var(--bg-primary)', stroke: 'var(--border-secondary)', strokeWidth: 2, r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function SpendingBreakdownChart({ categorySpending }: ChartsProps) {
  const top6 = categorySpending.slice(0, 5);
  const data = top6.map((item) => ({
    ...item,
    fill: categoryColors[item.category] || 'var(--border-secondary)',
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="panel-card"
      style={{ padding: '24px' }}
    >
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Distribution
        </h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="amount"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
          {data.map((item) => (
            <div
              key={item.category}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '0.75rem',
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: item.fill,
                  flexShrink: 0,
                }}
              />
              <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function IncomeExpenseBarChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="panel-card"
      style={{ padding: '24px' }}
    >
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Monthly Comparison
        </h3>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} barGap={2} barSize={12}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
            axisLine={{ stroke: 'var(--border-primary)' }}
            tickLine={false}
            dy={10}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--text-tertiary)', fontFamily: "'JetBrains Mono', monospace" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-tertiary)' }} />
          <Bar dataKey="income" name="Income" fill="var(--text-primary)" radius={[2, 2, 0, 0]} />
          <Bar dataKey="expense" name="Expenses" fill="var(--border-secondary)" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

'use client';

import React, { useState } from 'react';
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
  Sector,
  ComposedChart,
  Line,
  LabelList,
} from 'recharts';
import { monthlyData, categoryColors } from '@/data/mockData';
import { formatCurrency } from '@/utils/helpers';
import { CategoryIcon } from './IconResolver';
import GlowCard from './GlowCard';

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
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 8, fontSize: '0.875rem' }}>{label}</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 2 }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--text-primary)', marginRight: 6 }} />
          Income: <span className="mono">{formatCurrency(data.income)}</span>
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 2 }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--border-secondary)', marginRight: 6 }} />
          Expenses: <span className="mono">{formatCurrency(data.expense)}</span>
        </p>
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.875rem' }}>{payload[0].name}</p>
        <p className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>
          {formatCurrency(payload[0].value)} ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export function BalanceTrendChart() {
  const [activeRange, setActiveRange] = useState('6M');

  let dataToUse = monthlyData;
  if (activeRange === '1M') dataToUse = monthlyData.slice(-2);
  if (activeRange === '3M') dataToUse = monthlyData.slice(-3);
  if (activeRange === '6M') dataToUse = monthlyData.slice(-6);
  if (activeRange === '1Y') dataToUse = monthlyData.slice(-12);

  const combinedData = dataToUse.map((d, i) => {
    const isLast = i === dataToUse.length - 1;
    const isSecondLast = i === dataToUse.length - 2;

    return {
      month: d.month,
      histIncome: isLast ? null : d.income,
      histExpense: isLast ? null : d.expense,
      projIncome: (isLast || isSecondLast) ? d.income : null,
      projExpense: (isLast || isSecondLast) ? d.expense : null,
      income: d.income,
      expense: d.expense,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
     <GlowCard style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Flow Overview</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: 6, padding: 2 }}>
            {['1M', '3M', '6M', '1Y'].map(range => (
              <button 
                key={range} 
                onClick={() => setActiveRange(range)}
                style={{ 
                  padding: '4px 12px', 
                  fontSize: '0.75rem', 
                  fontWeight: 500,
                  color: activeRange === range ? 'var(--bg-primary)' : 'var(--text-tertiary)',
                  background: activeRange === range ? 'var(--text-primary)' : 'transparent',
                  borderRadius: 4,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                {range}
              </button>
            ))}
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
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={combinedData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--text-primary)" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="var(--text-primary)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--border-secondary)" stopOpacity={0.25}/>
              <stop offset="95%" stopColor="var(--border-secondary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
            axisLine={{ stroke: 'var(--border-primary)' }}
            tickLine={false}
            dy={10}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--text-tertiary)', fontFamily: "'Clash Display', sans-serif" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="histIncome" stroke="var(--text-primary)" strokeWidth={1.5} fillOpacity={1} fill="url(#colorIncome)" connectNulls={false} activeDot={{ fill: 'var(--bg-primary)', stroke: 'var(--text-primary)', strokeWidth: 2, r: 4 }} />
          <Area type="monotone" dataKey="projIncome" stroke="var(--text-primary)" strokeWidth={1.5} strokeDasharray="5 5" fillOpacity={0.5} fill="url(#colorIncome)" connectNulls={false} activeDot={{ fill: 'var(--bg-primary)', stroke: 'var(--text-primary)', strokeWidth: 2, r: 4 }} />
          <Area type="monotone" dataKey="histExpense" stroke="var(--border-secondary)" strokeWidth={1.5} fillOpacity={1} fill="url(#colorExpense)" connectNulls={false} activeDot={{ fill: 'var(--bg-primary)', stroke: 'var(--border-secondary)', strokeWidth: 2, r: 4 }} />
          <Area type="monotone" dataKey="projExpense" stroke="var(--border-secondary)" strokeWidth={1.5} strokeDasharray="5 5" fillOpacity={0.5} fill="url(#colorExpense)" connectNulls={false} activeDot={{ fill: 'var(--bg-primary)', stroke: 'var(--border-secondary)', strokeWidth: 2, r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
     </GlowCard>
    </motion.div>
  );
}

export function SpendingBreakdownChart({ categorySpending }: ChartsProps) {
  const PieAny = Pie as any;
  const [activeIndex, setActiveIndex] = useState(-1);

  const top6 = categorySpending.slice(0, 5);
  const data = top6.map((item) => ({
    ...item,
    fill: categoryColors[item.category] || 'var(--border-secondary)',
  }));

  const totalAmount = categorySpending.reduce((sum, item) => sum + item.amount, 0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
     <GlowCard style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Distribution
        </h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                <tspan x="50%" dy="-8" fontSize="0.75rem" fill="var(--text-tertiary)">Total Spend</tspan>
                <tspan x="50%" dy="16" fontSize="1rem" fontWeight="600" className="mono" fill="var(--text-primary)">
                  {formatCurrency(totalAmount)}
                </tspan>
              </text>
              <PieAny
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="amount"
                strokeWidth={0}
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </PieAny>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {data.map((item) => (
            <div
              key={item.category}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '0.75rem',
              }}
              onMouseEnter={() => {
                const index = data.findIndex(d => d.category === item.category);
                if(index !== -1) setActiveIndex(index);
              }}
              onMouseLeave={() => setActiveIndex(-1)}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: item.fill,
                  flexShrink: 0,
                  transition: 'transform 0.2s',
                  transform: activeIndex !== -1 && data[activeIndex]?.category === item.category ? 'scale(1.5)' : 'scale(1)'
                }}
              />
              <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', gap: '4px' }}>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.category}</span>
                <span>&middot;</span>
                <span className="mono">{formatCurrency(item.amount)}</span>
                <span>&middot;</span>
                <span>{Math.round(item.percentage)}%</span>
              </span>
            </div>
          ))}
        </div>
      </div>
     </GlowCard>
    </motion.div>
  );
}

export function IncomeExpenseBarChart() {
  const [viewMode, setViewMode] = useState<'All' | 'Income' | 'Expenses' | 'Net'>('All');

  // Compute MoM % change and max values to position the label
  const chartData = monthlyData.map((d, i, arr) => {
    const prev = i > 0 ? arr[i - 1] : null;
    let currentVal = 0;
    let prevVal = 0;

    if (viewMode === 'All' || viewMode === 'Net') {
      currentVal = d.balance;
      prevVal = prev ? prev.balance : 0;
    } else if (viewMode === 'Income') {
      currentVal = d.income;
      prevVal = prev ? prev.income : 0;
    } else if (viewMode === 'Expenses') {
      currentVal = d.expense;
      prevVal = prev ? prev.expense : 0;
    }

    let percentChange = 0;
    if (prevVal !== 0) {
      percentChange = ((currentVal - prevVal) / Math.abs(prevVal)) * 100;
    }

    const changeText = i === 0 ? '' : `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%`;
    const changeColor = percentChange > 0 ? 'var(--text-primary)' : 'var(--text-tertiary)';

    return {
      ...d,
      net: d.balance,
      percentChange: changeText,
      changeColor: changeColor,
      // determine the highest point for the label to sit above the bars
      labelY: viewMode === 'All' 
        ? Math.max(d.income, d.expense) + (Math.max(d.income, d.expense) * 0.05) 
        : currentVal + (currentVal * 0.05)
    };
  });

  const renderCustomLabel = (props: any) => {
    const { x, y, value, index } = props;
    const d = chartData[index];
    if (!value || index === 0) return null;
    const isPositive = value.startsWith('+');
    return (
      <text
        x={x}
        y={y - 10}
        fill={isPositive ? '#10b981' : 'var(--text-tertiary)'}
        fontSize={10}
        fontWeight={600}
        textAnchor="middle"
      >
        {value}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
     <GlowCard style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Monthly Comparison
          </h3>
        </div>
        <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: 6, padding: 2 }}>
          {['All', 'Income', 'Expenses', 'Net'].map(mode => (
            <button 
              key={mode} 
              onClick={() => setViewMode(mode as any)}
              style={{ 
                padding: '4px 12px', 
                fontSize: '0.75rem', 
                fontWeight: 500,
                color: viewMode === mode ? 'var(--bg-primary)' : 'var(--text-tertiary)',
                background: viewMode === mode ? 'var(--text-primary)' : 'transparent',
                borderRadius: 4,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
              {mode}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }} barGap={2} barSize={12}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
            axisLine={{ stroke: 'var(--border-primary)' }}
            tickLine={false}
            dy={10}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--text-tertiary)', fontFamily: "'Clash Display', sans-serif" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-tertiary)' }} />
          
          {(viewMode === 'All' || viewMode === 'Income') && (
            <Bar dataKey="income" name="Income" fill="var(--text-primary)" radius={[2, 2, 0, 0]} />
          )}
          {(viewMode === 'All' || viewMode === 'Expenses') && (
            <Bar dataKey="expense" name="Expenses" fill="var(--border-secondary)" radius={[2, 2, 0, 0]} />
          )}
          {(viewMode === 'Net') && (
            <Bar dataKey="net" name="Net" fill="#10b981" radius={[2, 2, 0, 0]} />
          )}

          <Line type="monotone" dataKey="labelY" stroke="none" isAnimationActive={false} dot={false}>
            <LabelList dataKey="percentChange" content={renderCustomLabel} />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>
     </GlowCard>
    </motion.div>
  );
}

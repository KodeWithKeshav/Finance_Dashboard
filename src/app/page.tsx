'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatCards from '@/components/StatCards';
import { BalanceTrendChart, SpendingBreakdownChart, IncomeExpenseBarChart } from '@/components/Charts';
import RecentTransactions from '@/components/RecentTransactions';
import TransactionTable from '@/components/TransactionTable';
import InsightsPanel from '@/components/InsightsPanel';
import { useStore, getSummaryStats, getCategorySpending } from '@/store/useStore';
import LiquidEther from '@/components/LiquidEther';

const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

export default function Home() {
  const { activePage, setActivePage, sidebarOpen, theme, transactions } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('finance-dashboard-storage');
    if (storedTheme) {
      try {
        const parsed = JSON.parse(storedTheme);
        const t = parsed?.state?.theme || 'dark';
        document.documentElement.setAttribute('data-theme', t);
      } catch {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  if (!mounted) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, margin: '0 auto 16px', borderRadius: '8px', background: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="var(--bg-primary)" />
            </svg>
          </div>
          <div className="shimmer" style={{ width: 120, height: 12, margin: '0 auto' }} />
        </div>
      </div>
    );
  }

  const stats = getSummaryStats(transactions);
  const categorySpending = getCategorySpending(transactions);
  const sortedByDate = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className={`dashboard-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Background Effect layer */}
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          zIndex: 0, 
          pointerEvents: 'none',
          opacity: theme === 'dark' ? 0.35 : 0.12 
        }}
      >
        <LiquidEther
          colors={theme === 'dark' ? ['#5227FF', '#FF9FFC', '#B19EEF'] : ['#FFB703', '#FB8500', '#FFD166']}
          mouseForce={20}
          cursorSize={80}
          isViscous={true}
          viscous={30}
          iterationsViscous={8}
          iterationsPoisson={8}
          resolution={0.15}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>



      <main className="main-content">
        <Header />

        <AnimatePresence mode="wait">
          {activePage === 'dashboard' && (
            <motion.div
              key="dashboard"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="page-content"
            >
              <StatCards
                totalBalance={stats.totalBalance}
                totalIncome={stats.totalIncome}
                totalExpenses={stats.totalExpenses}
                savingsRate={stats.savingsRate}
                transactionCount={stats.transactionCount}
              />

              <div className="charts-grid-main">
                <BalanceTrendChart />
                <SpendingBreakdownChart categorySpending={categorySpending} />
              </div>

              <div className="charts-grid-bottom">
                <IncomeExpenseBarChart />
                <RecentTransactions transactions={sortedByDate} />
              </div>
            </motion.div>
          )}

          {activePage === 'transactions' && (
            <motion.div
              key="transactions"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="page-content"
            >
              <TransactionTable />
            </motion.div>
          )}

          {activePage === 'insights' && (
            <motion.div
              key="insights"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="page-content"
            >
              <InsightsPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background: transparent;
        }
        .main-content {
          flex: 1;
          position: relative;
          z-index: 1;
          min-width: 0;
        }
        .page-content {
          padding: 28px 32px 40px;
          max-width: 1440px;
          margin: 0 auto;
        }
        .charts-grid-main {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 20px;
          margin-top: 24px;
        }
        .charts-grid-bottom {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 24px;
        }

        @media (max-width: 900px) {
          .charts-grid-main,
          .charts-grid-bottom {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            padding-bottom: 88px; /* space for bottom floating dock */
          }
          .page-content {
            padding: 20px 16px 32px;
          }
        }
      `}</style>
    </div>
  );
}

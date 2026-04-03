'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { EyeIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import ShinyText from './ShinyText';
import GooeyNav from './GooeyNav';

const navItems = [
  { id: 'dashboard' as const, label: 'Overview' },
  { id: 'transactions' as const, label: 'Transactions' },
  { id: 'insights' as const, label: 'Analytics' },
];

export default function Header() {
  const { role, setRole, theme, toggleTheme, activePage, setActivePage } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeNavIndex = navItems.findIndex(item => item.id === activePage);

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M8 12L12 8L16 12M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <ShinyText 
          text="FinanceFlow" 
          speed={3} 
          color="var(--text-tertiary)" 
          shineColor="var(--text-primary)" 
          spread={100}
          className="brand-name font-heading" 
        />
      </div>

      {/* GooeyNav Navigation */}
      <GooeyNav
        items={navItems.map(item => ({ label: item.label }))}
        activeIndex={activeNavIndex >= 0 ? activeNavIndex : 0}
        onItemClick={(index) => setActivePage(navItems[index].id)}
        particleCount={15}
        particleDistances={[90, 10]}
        particleR={100}
        animationTime={600}
        timeVariance={300}
        colors={[1, 2, 3, 1, 2, 3, 1, 4]}
      />

      <div className="header-right">
        {/* Role Switcher */}
        <div className="role-switcher">
          <button
            className={`role-btn ${role === 'viewer' ? 'active' : ''}`}
            onClick={() => setRole('viewer')}
          >
            <EyeIcon style={{ width: 14, height: 14, marginRight: 4 }} />
            Viewer
          </button>
          <button
            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
            onClick={() => setRole('admin')}
          >
            <ShieldCheckIcon style={{ width: 14, height: 14, marginRight: 4 }} />
            Admin
          </button>
        </div>

        <div className="divider" />

        {/* Celestial Eclipse Theme Toggle */}
        {mounted && (
          <button 
            className="eclipse-toggle"
            onClick={toggleTheme}
            title="Toggle Theme"
          >
            <div className={`eclipse-sky ${theme}`}>
              <div className="stars">
                <span className="star s1" />
                <span className="star s2" />
                <span className="star s3" />
              </div>
              
              <div className="eclipse-sun" />
              
              <motion.div 
                className="eclipse-moon"
                initial={false}
                animate={{
                  x: theme === 'dark' ? 6 : 40,
                  y: theme === 'dark' ? -6 : -20,
                  scale: theme === 'dark' ? 1 : 0.5
                }}
                transition={{ type: "spring", stiffness: 80, damping: 15 }}
              />
            </div>
          </button>
        )}
      </div>

      <style jsx>{`
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 56px;
          margin-bottom: 16px;
          border-bottom: 1px solid var(--border-primary);
          background: color-mix(in srgb, var(--bg-primary), transparent 60%);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .logo-box {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background: var(--text-primary);
          color: var(--bg-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-name {
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--text-primary);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          justify-content: flex-end;
        }

        .role-switcher {
          display: flex;
          background: color-mix(in srgb, var(--bg-tertiary), transparent 40%);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: var(--radius-sm);
          padding: 2px;
        }

        .role-btn {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          padding: 6px 12px;
          border: none;
          border-radius: calc(var(--radius-sm) - 2px);
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: 'Inter', sans-serif;
        }

        .role-btn.active {
          background: var(--bg-primary);
          color: var(--text-primary);
          box-shadow: var(--shadow-sm);
          font-weight: 600;
        }

        .divider {
          width: 1px;
          height: 24px;
          background: var(--border-primary);
        }

        /* Celestial Eclipse Toggle */
        .eclipse-toggle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid var(--border-primary);
          padding: 0;
          cursor: pointer;
          background: transparent;
          outline: none;
          overflow: hidden;
          position: relative;
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);
        }

        .eclipse-sky {
          position: absolute;
          inset: 0;
          transition: background 0.6s ease;
        }

        .eclipse-sky.light { background: #38bdf8; }
        .eclipse-sky.dark { background: #0f172a; }

        .eclipse-sun {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fde047;
          top: 11px;
          left: 11px;
          box-shadow: 0 0 10px rgba(253, 224, 71, 0.4);
          transition: transform 0.5s ease;
        }

        .eclipse-sky.dark .eclipse-sun {
          transform: scale(0.9);
          background: #e2e8f0;
          box-shadow: 0 0 15px rgba(226, 232, 240, 0.4);
        }

        .eclipse-moon {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #0f172a;
          top: 11px;
          left: 11px;
          z-index: 2;
        }

        .stars {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.8s ease;
        }

        .eclipse-sky.dark .stars { opacity: 1; }

        .star {
          position: absolute;
          background: #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 3px #ffffff;
        }
        
        .star.s1 { width: 2px; height: 2px; top: 12px; left: 10px; animation: twinkle 2s infinite; }
        .star.s2 { width: 1.5px; height: 1.5px; top: 20px; left: 32px; animation: twinkle 3s infinite 1s; }
        .star.s3 { width: 2px; height: 2px; top: 30px; left: 20px; animation: twinkle 2.5s infinite 0.5s; }

        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @media (max-width: 900px) {
          .header-left .brand-name {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}

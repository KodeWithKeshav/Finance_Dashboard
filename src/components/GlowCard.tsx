'use client';

import { useStore } from '@/store/useStore';
import BorderGlow from './BorderGlow';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const DARK_CONFIG = {
  backgroundColor: '#0a0a0a',
  colors: ['#7c3aed', '#ec4899', '#06b6d4'],
  glowColor: '270 70 65',
  glowIntensity: 0.7,
  fillOpacity: 0.25,
};

const LIGHT_CONFIG = {
  backgroundColor: '#ffffff',
  colors: ['#e2e8f0', '#e2e8f0', '#e2e8f0'],
  glowColor: '210 20 85',
  glowIntensity: 0,
  fillOpacity: 0,
};

export default function GlowCard({ children, className = '', style }: GlowCardProps) {
  const { theme } = useStore();
  const config = theme === 'dark' ? DARK_CONFIG : LIGHT_CONFIG;

  return (
    <BorderGlow
      backgroundColor={config.backgroundColor}
      colors={config.colors}
      glowColor={config.glowColor}
      glowIntensity={config.glowIntensity}
      fillOpacity={config.fillOpacity}
      borderRadius={12}
      glowRadius={25}
      coneSpread={25}
      edgeSensitivity={30}
      className={className}
    >
      <div style={style}>
        {children}
      </div>
    </BorderGlow>
  );
}

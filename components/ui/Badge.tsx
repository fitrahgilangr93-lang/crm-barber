import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'silver' | 'platinum' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className,
}) => {
  const variantStyles = {
    gold: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    silver: 'bg-slate-400/15 text-slate-200 border border-slate-400/30',
    platinum: 'bg-cyan-500/15 text-cyan-200 border border-cyan-400/40 shadow-sm shadow-cyan-500/20',
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30',
    danger: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    info: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
    neutral: 'bg-dark-700/60 text-slate-300 border border-slate-700/60',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 rounded-full font-medium',
    md: 'text-sm px-3 py-1 rounded-full font-medium',
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5 transition-colors', variantStyles[variant], sizeStyles[size], className)}>
      {children}
    </span>
  );
};

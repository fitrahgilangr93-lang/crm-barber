import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconColor = 'text-gold-400',
  className,
}) => {
  return (
    <div className={cn('glass-card rounded-2xl p-5 relative overflow-hidden', className)}>
      {/* Decorative Gold Glow accent in top right */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl font-bold tracking-tight text-white">{value}</h4>
        </div>
        <div className="w-12 h-12 rounded-xl bg-dark-750 border border-slate-700/60 flex items-center justify-center shadow-inner">
          <Icon className={cn('w-6 h-6', iconColor)} />
        </div>
      </div>

      {(trend || subtitle) && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          {trend && (
            <div className="flex items-center gap-1.5 font-medium">
              {trend.isPositive ? (
                <span className="flex items-center text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  {trend.value}
                </span>
              ) : (
                <span className="flex items-center text-rose-400">
                  <TrendingDown className="w-3.5 h-3.5 mr-1" />
                  {trend.value}
                </span>
              )}
              <span className="text-slate-500">vs bulan lalu</span>
            </div>
          )}
          {subtitle && (
            <span className="text-slate-400 font-medium ml-auto">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};

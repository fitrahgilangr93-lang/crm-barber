import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'gold',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variantStyles = {
    gold: 'bg-gold-gradient text-dark-950 font-semibold shadow-md shadow-gold-500/20 hover:brightness-110 active:scale-[0.98] focus:ring-gold-400 border border-gold-300/40',
    secondary: 'bg-dark-750 text-slate-100 hover:bg-dark-700 active:scale-[0.98] border border-slate-700/60 focus:ring-slate-500',
    outline: 'border border-gold-500/40 text-gold-400 hover:bg-gold-500/10 active:scale-[0.98] focus:ring-gold-400',
    danger: 'bg-rose-600/90 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 active:scale-[0.98] focus:ring-rose-500',
    ghost: 'text-slate-400 hover:text-white hover:bg-white/5 active:scale-[0.98] focus:ring-slate-600',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
    lg: 'text-base px-6 py-3.5 rounded-xl gap-2.5',
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};

import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

export default function Badge({ label, variant = 'info' }: BadgeProps) {
  const styles = {
    success: 'bg-green-50 text-green-700 ring-green-600/20',
    warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    error: 'bg-red-50 text-red-700 ring-red-600/20',
    info: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    neutral: 'bg-zinc-100 text-zinc-600 ring-zinc-500/10',
  };

  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[variant]}`}>
      {label}
    </span>
  );
}
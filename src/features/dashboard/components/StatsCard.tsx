import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { StatItem } from '../types';

export default function StatsCard({ item }: { item: StatItem }) {
  const isIncrease = item.changeType === 'increase';
  const isDecrease = item.changeType === 'decrease';

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-zinc-500 truncate">{item.name}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-3xl font-semibold tracking-tight text-zinc-950">
          {item.value}
        </span>
        
        {/* Индикатор изменений */}
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            isIncrease
              ? 'bg-green-50 text-green-700'
              : isDecrease
              ? 'bg-red-50 text-red-700'
              : 'bg-zinc-50 text-zinc-700'
          }`}
        >
          {isIncrease && <ArrowUpRight className="h-3 w-3" />}
          {isDecrease && <ArrowDownRight className="h-3 w-3" />}
          {!isIncrease && !isDecrease && <Minus className="h-3 w-3" />}
          {item.change}
        </span>
      </div>
    </div>
  );
}
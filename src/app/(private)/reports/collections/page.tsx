'use client';

import React from 'react';
import { ShieldAlert, TrendingUp, DollarSign, Activity } from 'lucide-react';

export default function CollectionReportsPage() {
  const metrics = {
    recoveryRate: 88.4,
    collectionEfficiency: 92.1,
    ptpRate: 84.0, // Promise to Pay rate
  };

  const buckets = [
    { range: '1-30 дней (Soft Collection)', volume: 145000000, count: 24, percentage: 70 },
    { range: '31-90 дней (Hard Collection)', volume: 55000000, count: 9, percentage: 20 },
    { range: '91-180 дней (Pre-Legal)', volume: 22000000, count: 3, percentage: 8 },
    { range: '181+ дней (Legal / Write-off)', volume: 5000000, count: 1, percentage: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-zinc-950">Показатели эффективности взыскания</h2>
        <p className="text-xs text-zinc-500">Статистика по стадиям просрочки (Collection Aging Buckets) и контроль выполнения обещаний оплаты (PTP).</p>
      </div>

      {/* Ключевые показатели эффективности */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <span className="text-xs text-zinc-500 block uppercase font-semibold">Recovery Rate (Уровень возврата)</span>
          <span className="text-2xl font-bold text-green-700 block mt-1">{metrics.recoveryRate}%</span>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <span className="text-xs text-zinc-500 block uppercase font-semibold">Collection Efficiency (КПД Взыскания)</span>
          <span className="text-2xl font-bold text-zinc-950 block mt-1">{metrics.collectionEfficiency}%</span>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <span className="text-xs text-zinc-500 block uppercase font-semibold">Promise to pay (Исполнение обещаний)</span>
          <span className="text-2xl font-bold text-indigo-600 block mt-1">{metrics.ptpRate}%</span>
        </div>
      </div>

      {/* Распределение по корзинам старения */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
          <ShieldAlert className="h-4.5 w-4.5 text-zinc-500" /> Стадийная классификация просрочки (Aging Buckets)
        </h3>
        <div className="space-y-4">
          {buckets.map((b) => (
            <div key={b.range} className="space-y-1 text-xs">
              <div className="flex justify-between font-semibold text-zinc-700">
                <span>{b.range} ({b.count} договоров)</span>
                <span>{b.volume.toLocaleString()} сум ({b.percentage}%)</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden border">
                <div className="bg-amber-500 h-full" style={{ width: `${b.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
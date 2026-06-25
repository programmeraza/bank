'use client';

import React from 'react';
import { ShieldAlert, Percent, Landmark, Coins } from 'lucide-react';

// Импорты UI Kit (сохраняя макет кабинета руководителя)
import PageTransition from '@/shared/ui/PageTransition';
import Badge from '@/shared/ui/Badge';
import CountUp from '@/shared/ui/CountUp';

export default function ExecutiveDashboardPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Шапка */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-bold text-zinc-950">Кабинет руководителя (Executive Dashboard)</h2>
          <p className="text-xs text-zinc-500">Консолидированная панорама бизнес-показателей, рисков и операционной эффективности банка ABU BANK.</p>
        </div>

        {/* KPI карточки руководителя */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-zinc-200 bg-zinc-900 text-white p-6 shadow-sm">
            <p className="text-xs font-semibold text-zinc-400 uppercase flex items-center gap-1.5"><Coins className="h-4 w-4" /> Портфель</p>
            <span className="text-2xl font-bold block mt-2">
              <CountUp target={4500000000} /> сум
            </span>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-1.5"><ShieldAlert className="h-4 w-4 text-amber-500" /> Риск PAR &gt; 30</p>
            <span className="text-2xl font-bold text-amber-600 block mt-2">4.8%</span>
            <div className="mt-1"><Badge label="Норматив соблюден" variant="success" /></div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-1.5"><Percent className="h-4 w-4 text-zinc-500" /> Взыскание</p>
            <span className="text-2xl font-bold text-zinc-900 block mt-2">92.1%</span>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-1.5"><Landmark className="h-4 w-4 text-green-600" /> Комплаенс</p>
            <span className="text-2xl font-bold text-green-700 block mt-2">100% OK</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2">Финансовое состояние</h3>
            <ul className="text-xs space-y-3 font-mono">
              <li className="flex justify-between"><span>Доходы от комиссий:</span> <span className="font-bold">135,000,000 сум</span></li>
              <li className="flex justify-between"><span>Резервы МСФО-9:</span> <span className="font-bold text-indigo-600">112,500,000 сум</span></li>
            </ul>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
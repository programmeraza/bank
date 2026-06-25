'use client';

import React from 'react';
import { Scale, ShieldCheck, Database, Calendar } from 'lucide-react';

export default function ReservesPage() {
  const reserveData = {
    calculationId: 'RES-2025-01-A',
    methodology: 'IFRS-9 Expected Credit Loss (ECL)',
    publishDate: '22.01.2025',
    totalPortfolioReserve: 112500000, // 112.5 млн сум резервов по всему портфелю
    stage1Reserve: 45000000,           // Резерв по стандартным кредитам
    stage2Reserve: 33750000,           // Резерв по кредитам с повышенным риском
    stage3Reserve: 33750000,           // Резерв по дефолтным (просроченным) кредитам
  };

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-zinc-950">Резервирование под кредитные потери</h2>
        <p className="text-xs text-zinc-500">Мониторинг объема сформированных резервов по портфелю согласно стандартам IFRS-9 (ECL).</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Сводный баланс резерва */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm md:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
            <Scale className="h-4.5 w-4.5 text-zinc-500" /> Консолидированные резервы портфеля
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-center text-xs">
            <div className="bg-green-50/50 p-4 rounded border border-green-200">
              <span className="font-semibold text-green-800">Stage 1 (Стандартные)</span>
              <p className="text-lg font-bold text-green-950 mt-1">{reserveData.stage1Reserve.toLocaleString()} сум</p>
            </div>
            <div className="bg-amber-50/50 p-4 rounded border border-amber-200">
              <span className="font-semibold text-amber-800">Stage 2 (Повышенный риск)</span>
              <p className="text-lg font-bold text-amber-950 mt-1">{reserveData.stage2Reserve.toLocaleString()} сум</p>
            </div>
            <div className="bg-red-50/50 p-4 rounded border border-red-200">
              <span className="font-semibold text-red-800">Stage 3 (Дефолтные)</span>
              <p className="text-lg font-bold text-red-950 mt-1">{reserveData.stage3Reserve.toLocaleString()} сум</p>
            </div>
          </div>
        </div>

        {/* Методология и ID */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4 text-xs">
          <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
            <Database className="h-4.5 w-4.5 text-zinc-500" /> Аудит методологии расчета
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-zinc-500">ID Расчета:</span>
              <span className="font-mono font-bold text-zinc-900">{reserveData.calculationId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Методика:</span>
              <span className="font-semibold text-zinc-800">{reserveData.methodology}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Дата расчета:</span>
              <span className="font-semibold text-zinc-800">{reserveData.publishDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

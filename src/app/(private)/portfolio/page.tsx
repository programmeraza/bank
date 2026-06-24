'use client';

import React from 'react';
import { 
  TrendingUp, Percent, ShieldAlert, Landmark, Users, Briefcase, 
  ArrowUpRight, Coins, LayoutGrid, CheckCircle, 
  LayoutDashboard
} from 'lucide-react';

export default function PortfolioDashboardPage() {
  // Имитируем консолидированные портфельные показатели банка ABU BANK
  const portfolioStats = {
    totalVolume: 4500000000,      // Общий объем портфеля (4.5 млрд сум)
    totalLoansCount: 248,          // Всего активных займов
    activeLoansCount: 212,         // Из них обслуживаются в срок
    overdueLoansCount: 36,         // Из них находятся на просрочке
    parRate: 4.8,                  // PAR (Portfolio At Risk % — долги с просрочкой > 30 дней)
    nplRate: 1.2,                  // NPL (Non-Performing Loans % — безнадежные долги > 90 дней)
  };

  // Распределение портфеля по филиалам
  const branchBreakdown = [
    { name: 'Центральный офис', volume: 2700000000, count: 120, percentage: 60 },
    { name: 'Филиал Север', volume: 1125000000, count: 78, percentage: 25 },
    { name: 'Филиал Юг', volume: 675000000, count: 50, percentage: 15 },
  ];

  // Распределение по продуктам
  const productBreakdown = [
    { name: 'Автокредит Стандарт', volume: 2250000000, rate: '18%', percentage: 50 },
    { name: 'Потребительский без залога', volume: 1350000000, rate: '22%', percentage: 30 },
    { name: 'Микрозайм Экспресс', volume: 900000000, rate: '24%', percentage: 20 },
  ];

  // Распределение по менеджерам
  const managerBreakdown = [
    { name: 'Иван Иванов (Admin)', volume: 2025000000, count: 110, status: 'Top' },
    { name: 'Ольга Кузнецова (Manager)', volume: 1575000000, count: 88, status: 'Strong' },
    { name: 'Дмитрий Иванов (Operator)', volume: 900000000, count: 50, status: 'Normal' },
  ];

  return (
    <div className="space-y-6">
      {/* Шапка дашборда */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-zinc-950">Аналитика кредитного портфеля</h2>
        <p className="text-xs text-zinc-500">Ключевые показатели эффективности (KPI), риски (PAR/NPL) и распределение активов банка в реальном времени.</p>
      </div>

      {/* Grid 1: Ключевые метрики (KPI) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Карточка 1: Общий объем */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-zinc-500 uppercase">Объем портфеля</p>
            <Coins className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-950">
              {portfolioStats.totalVolume.toLocaleString()} сум
            </span>
            <span className="text-[10px] text-green-600 font-semibold flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="h-3 w-3" /> +14.2% за месяц
            </span>
          </div>
        </div>

        {/* Карточка 2: Всего кредитов */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-zinc-500 uppercase">Всего договоров</p>
            <LayoutDashboard className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-950">
              {portfolioStats.totalLoansCount} ед.
            </span>
            <span className="text-[10px] text-zinc-500 block mt-1">
              Активных: <span className="font-bold text-zinc-800">{portfolioStats.activeLoansCount}</span> | Просрочка: <span className="font-bold text-red-600">{portfolioStats.overdueLoansCount}</span>
            </span>
          </div>
        </div>

        {/* Карточка 3: PAR % */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-zinc-500 uppercase">Portfolio At Risk (PAR)</p>
            <ShieldAlert className="h-5 w-5 text-amber-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-950">
              {portfolioStats.parRate}%
            </span>
            <span className="text-[10px] text-zinc-500 block mt-1">
              Допустимый лимит комплаенса: <span className="font-bold text-zinc-800">&lt; 5.0%</span>
            </span>
          </div>
        </div>

        {/* Карточка 4: NPL % */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-zinc-500 uppercase">Non-Performing Loans (NPL)</p>
            <Percent className="h-5 w-5 text-red-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-950">
              {portfolioStats.nplRate}%
            </span>
            <span className="text-[10px] text-red-600 font-semibold block mt-1">
              Просрочка свыше 90 дней (списание)
            </span>
          </div>
        </div>
      </div>

      {/* Grid 2: Распределения и графики */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Виджет 1: Распределение по филиалам */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
            <Landmark className="h-4.5 w-4.5 text-zinc-500" /> Финансовые потоки по филиалам
          </h3>
          <div className="space-y-4">
            {branchBreakdown.map((branch) => (
              <div key={branch.name} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold text-zinc-800">
                  <span>{branch.name} ({branch.count} дог.)</span>
                  <span>{branch.volume.toLocaleString()} сум</span>
                </div>
                {/* Горизонтальный график-шкала */}
                <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden border">
                  <div className="bg-indigo-600 h-full" style={{ width: `${branch.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Виджет 2: Распределение по продуктам */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
            <Briefcase className="h-4.5 w-4.5 text-zinc-500" /> Популярность кредитных продуктов
          </h3>
          <div className="space-y-4">
            {productBreakdown.map((product) => (
              <div key={product.name} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold text-zinc-800">
                  <span>{product.name} ({product.rate})</span>
                  <span>{product.volume.toLocaleString()} сум</span>
                </div>
                <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden border">
                  <div className="bg-green-500 h-full" style={{ width: `${product.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Виджет 3: Эффективность кредитных менеджеров */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
            <Users className="h-4.5 w-4.5 text-zinc-500" /> Выработка кредитных менеджеров
          </h3>
          <ul className="divide-y divide-zinc-100 text-xs">
            {managerBreakdown.map((mgr) => (
              <li key={mgr.name} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-zinc-900">{mgr.name}</p>
                  <p className="text-[10px] text-zinc-500">Портфель: {mgr.count} активных сделок</p>
                </div>
                <div className="text-right space-y-1">
                  <span className="font-bold text-zinc-800 block">
                    {mgr.volume.toLocaleString()} сум
                  </span>
                  <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                    mgr.status === 'Top' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {mgr.status === 'Top' ? 'Лучший результат' : 'Высокий темп'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
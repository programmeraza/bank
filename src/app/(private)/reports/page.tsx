'use client';

import React, { useState } from 'react';
import { BarChart3, FileSpreadsheet, FileDown, Landmark, ShieldAlert, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';

// Импорты UI Kit (сохраняя структуру вкладок и экспорта)
import PageTransition from '@/shared/ui/PageTransition';
import Button from '@/shared/ui/Button';
import CountUp from '@/shared/ui/CountUp';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'bi' | 'financial'>('bi');
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportReason, setExportReason] = useState('');
  const [targetReport, setTargetReport] = useState('');

  const handleOpenExport = (reportName: string) => {
    setTargetReport(reportName);
    setExportReason('');
    setExportModalOpen(true);
  };

  const handleConfirmExport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exportReason.trim()) {
      toast.error('Укажите причину экспорта');
      return;
    }
    console.log(`[SECURITY AUDIT] Экспорт: "${targetReport}". Причина: "${exportReason}"`);
    toast.success(`Отчет успешного экспортирован`);
    setExportModalOpen(false);
  };

  const productsData = [
    { name: 'Автокредит Стандарт', volume: 2250000000, percentage: 50, color: 'bg-indigo-600' },
    { name: 'Потребительский без залога', volume: 1350000000, percentage: 30, color: 'bg-emerald-500' },
    { name: 'Микрозайм Экспресс', volume: 900000000, percentage: 20, color: 'bg-amber-500' },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Шапка */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-bold text-zinc-950">Аналитический центр и отчетность</h2>
          <p className="text-xs text-zinc-500">Мониторинг кредитной активности банка, аудит прибыльности и экспорт финансовых выгрузок.</p>
        </div>

        {/* Переключатель вкладок */}
        <div className="flex border-b border-zinc-200 gap-6">
          <button
            onClick={() => setActiveTab('bi')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors focus:outline-none ${
              activeTab === 'bi' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'
            }`}
          >
            BI Панель (Аналитика)
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors focus:outline-none ${
              activeTab === 'financial' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'
            }`}
          >
            Управленческая отчетность (Экспорт)
          </button>
        </div>

        {/* ВКЛАДКА 1: BI DASHBOARD */}
        {activeTab === 'bi' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <span className="text-xs text-zinc-500 block uppercase font-semibold">Общие выдачи</span>
                <span className="text-xl font-bold text-zinc-950 block mt-1">
                  <CountUp target={4500000000} /> сум
                </span>
                <span className="text-[10px] text-green-600 font-semibold block mt-1">▲ +14% к прошлому месяцу</span>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <span className="text-xs text-zinc-500 block uppercase font-semibold">Сумма погашений</span>
                <span className="text-xl font-bold text-zinc-950 block mt-1">
                  <CountUp target={1120000000} /> сум
                </span>
                <span className="text-[10px] text-zinc-400 block mt-1">Уровень возврата: 98.4%</span>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <span className="text-xs text-zinc-500 block uppercase font-semibold">Доходы от комиссий</span>
                <span className="text-xl font-bold text-indigo-600 block mt-1">
                  <CountUp target={135000000} /> сум
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                  <BarChart3 className="h-4.5 w-4.5 text-zinc-500" /> Продуктовая структура
                </h3>
                <div className="space-y-4">
                  {productsData.map((p) => (
                    <div key={p.name} className="space-y-1 text-xs">
                      <div className="flex justify-between text-zinc-700 font-medium">
                        <span>{p.name}</span>
                        <span>{p.volume.toLocaleString()} сум</span>
                      </div>
                      <div className="w-full bg-zinc-150 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full ${p.color}`} style={{ width: `${p.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ВКЛАДКА 2: ЭКСПОРТ */}
        {activeTab === 'financial' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2">Бухгалтерские балансы</h3>
              <p className="text-xs text-zinc-500">Выгрузка книги проводок General Ledger по счетам зачисления.</p>
              <Button variant="secondary" onClick={() => handleOpenExport('Portfolio Financial Report')}>
                <FileDown className="h-4 w-4 mr-1.5" /> Выгрузить отчет в Excel
              </Button>
            </div>
          </div>
        )}

        {/* Модалка подтверждения экспорта */}
        {exportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setExportModalOpen(false)} />
            <form onSubmit={handleConfirmExport} className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-1.5 border-b pb-2">
                <ShieldAlert className="h-5 w-5 text-amber-600" /> Подтверждение экспорта
              </h3>
              <p className="text-xs text-zinc-500">Выгрузка подлежит обязательному согласованию. Укажите причину экспорта:</p>
              <textarea
                value={exportReason}
                onChange={(e) => setExportReason(e.target.value)}
                placeholder="Причина экспорта..."
                className="w-full rounded border border-zinc-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none h-16 resize-none bg-white"
                required
              />
              <div className="flex gap-2 justify-end border-t pt-3">
                <Button variant="secondary" type="button" onClick={() => setExportModalOpen(false)}>Отмена</Button>
                <Button variant="primary" type="submit">Выгрузить</Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
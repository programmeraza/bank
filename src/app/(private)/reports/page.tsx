'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, Coins, BarChart3, FileSpreadsheet, FileDown, 
  Landmark, Users, ShieldAlert, CheckCircle2, AlertOctagon, HelpCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'bi' | 'financial'>('bi');
  
  // Контролируемый экспорт (Этап 6)
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
      toast.error('Укажите обоснованную причину экспорта конфиденциальных данных');
      return;
    }

    // Логируем экспорт в аудит безопасности
    console.log(`[SECURITY AUDIT] Экспорт отчета: "${targetReport}". Исполнитель: Иван Иванов. Причина: "${exportReason}"`);
    toast.success(`Отчет "${targetReport}" успешно выгружен в формате Excel`);
    setExportModalOpen(false);
  };

  // Имитируем аналитику по продуктам
  const productsData = [
    { name: 'Автокредит Стандарт', volume: 2250000000, percentage: 50, color: 'bg-indigo-600' },
    { name: 'Потребительский без залога', volume: 1350000000, percentage: 30, color: 'bg-emerald-500' },
    { name: 'Микрозайм Экспресс', volume: 900000000, percentage: 20, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-950">Аналитический центр и отчетность</h2>
          <p className="text-xs text-zinc-500">Мониторинг кредитной активности банка, аудит прибыльности и экспорт финансовых выгрузок.</p>
        </div>
      </div>

      {/* Переключатель разделов */}
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
          {/* Сводные показатели */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <span className="text-xs text-zinc-500 block uppercase font-semibold">Общие выдачи</span>
              <span className="text-xl font-bold text-zinc-950 block mt-1">4,500,000,000 сум</span>
              <span className="text-[10px] text-green-600 font-semibold block mt-1">▲ +14% к прошлому месяцу</span>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <span className="text-xs text-zinc-500 block uppercase font-semibold">Сумма погашений</span>
              <span className="text-xl font-bold text-zinc-950 block mt-1">1,120,000,000 сум</span>
              <span className="text-[10px] text-zinc-400 block mt-1">Уровень возврата: 98.4%</span>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <span className="text-xs text-zinc-500 block uppercase font-semibold">Доходность от комиссий</span>
              <span className="text-xl font-bold text-indigo-600 block mt-1">135,000,000 сум</span>
              <span className="text-[10px] text-zinc-400 block mt-1">Средняя комиссия: 2.2%</span>
            </div>
          </div>

          {/* Интерактивные графики распределения */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Доли кредитных продуктов */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                <BarChart3 className="h-4.5 w-4.5 text-zinc-500" /> Структура кредитного портфеля
              </h3>
              <div className="space-y-4">
                {productsData.map((prod) => (
                  <div key={prod.name} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold text-zinc-700">
                      <span>{prod.name}</span>
                      <span>{prod.volume.toLocaleString()} сум ({prod.percentage}%)</span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden border">
                      <div className={`${prod.color} h-full`} style={{ width: `${prod.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Распределение по регионам */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                <Landmark className="h-4.5 w-4.5 text-zinc-500" /> Распределение по филиалам
              </h3>
              <div className="space-y-4">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold text-zinc-700">
                    <span>Центральный офис</span>
                    <span>2,700,000,000 сум (60%)</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden border">
                    <div className="bg-indigo-600 h-full" style={{ width: '60%' }} />
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold text-zinc-700">
                    <span>Филиал Север</span>
                    <span>1,125,000,000 сум (25%)</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden border">
                    <div className="bg-indigo-600 h-full" style={{ width: '25%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ВКЛАДКА 2: УПРАВЛЕНЧЕСКАЯ ОТЧЕТНОСТЬ (КОНТРОЛИРУЕМЫЙ ЭКСПОРТ) */}
      {activeTab === 'financial' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Отчет 1 */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <FileSpreadsheet className="h-8 w-8 text-green-600 mb-2" />
              <h4 className="font-bold text-zinc-900">Portfolio Financial Report</h4>
              <p className="text-xs text-zinc-500 mt-1">Подробная финансовая ведомость выданных кредитов, начисленных процентов, удержанных комиссий и суммарных зачислений клиентов.</p>
            </div>
            <button
              onClick={() => handleOpenExport('Portfolio Financial Report')}
              className="inline-flex items-center justify-center gap-1.5 rounded-md border border-zinc-300 bg-white p-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <FileDown className="h-4 w-4" /> Выгрузить в Excel
            </button>
          </div>

          {/* Отчет 2 */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <ShieldAlert className="h-8 w-8 text-amber-500 mb-2" />
              <h4 className="font-bold text-zinc-900">Collection & Recovery Report</h4>
              <p className="text-xs text-zinc-500 mt-1">Выгрузка результатов работы департаментов Soft и Hard Collection: количество совершенных звонков, сумма возвращенных средств из просрочки.</p>
            </div>
            <button
              onClick={() => handleOpenExport('Collection & Recovery Report')}
              className="inline-flex items-center justify-center gap-1.5 rounded-md border border-zinc-300 bg-white p-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <FileDown className="h-4 w-4" /> Выгрузить в Excel
            </button>
          </div>
        </div>
      )}

      {/* МОДАЛЬНОЕ ОКНО ЭКСПОРТА (ЭТАП 6) */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setExportModalOpen(false)} />
          <form onSubmit={handleConfirmExport} className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-1.5 border-b pb-2">
              <ShieldAlert className="h-5 w-5 text-amber-600" /> Подтверждение экспорта данных
            </h3>
            
            <p className="text-xs text-zinc-500">
              Вы запрашиваете выгрузку конфиденциальной информации отчета <span className="font-semibold text-zinc-950">«{targetReport}»</span>. Согласно политике безопасности банка, выгрузка подлежит обязательному согласованию.
            </p>

            <div>
              <label className="block text-xs font-semibold text-zinc-700">Укажите обоснованную причину выгрузки</label>
              <textarea
                value={exportReason}
                onChange={(e) => setExportReason(e.target.value)}
                placeholder="Например: Предоставление еженедельной сводки руководителю департамента рисков..."
                className="mt-1.5 block w-full rounded border border-zinc-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none h-16 resize-none bg-white"
                required
              />
            </div>

            <div className="flex gap-2 justify-end border-t pt-3">
              <button
                type="button"
                onClick={() => setExportModalOpen(false)}
                className="rounded bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-700"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="rounded bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                Выгрузить документ
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
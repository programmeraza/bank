'use client';

import React, { useState } from 'react';
import { Search, Clock, Cpu, User, CheckCircle2, AlertTriangle, ShieldCheck, Database } from 'lucide-react';

interface OperationalEvent {
  id: string;
  correlationId: string;
  timestamp: string;
  user: string;
  event: 'Payment_Created' | 'Contract_Overdue' | 'Collection_Logged' | 'Contract_Closed' | 'Reserve_Updated';
  details: string;
  status: 'Success' | 'Warning' | 'Info';
}

const MOCK_OPERATIONS: LogMessage[] = [ // Используем локальный тип или импортируем
  {
    id: 'REQ-91024',
    correlationId: 'CID-8812-X902',
    timestamp: '22.01.2025, 14:32:10',
    user: 'Иван Иванов (Admin)',
    event: 'Payment_Created',
    details: 'Проведен плановый платеж по договору CTR-5014 на сумму 1 250 000 сум. Баланс основного долга уменьшен.',
    status: 'Success',
  },
  {
    id: 'REQ-91025',
    correlationId: 'CID-8812-X903',
    timestamp: '22.01.2025, 00:05:00',
    user: 'Система (Автобатч)',
    event: 'Contract_Overdue',
    details: 'Автоматический перевод договора CTR-5014 в статус Overdue (Просрочка). DPD увеличен до 14 дней.',
    status: 'Warning',
  },
  {
    id: 'REQ-91026',
    correlationId: 'CID-8812-X904',
    timestamp: '21.01.2025, 17:10:45',
    user: 'Ольга Кузнецова (Collection)',
    event: 'Collection_Logged',
    details: 'Зафиксировано действие Soft Collection по клиенту Петров С. Н.: совершён звонок, получено обещание оплаты.',
    status: 'Info',
  },
  {
    id: 'REQ-91027',
    correlationId: 'CID-8812-X905',
    timestamp: '20.01.2025, 00:05:00',
    user: 'Система (Резервирование)',
    event: 'Reserve_Updated',
    details: 'Корректировка резервов по договору CTR-5015. Резерв увеличен до 25% в связи с ростом DPD до 95 дней.',
    status: 'Warning',
  },
];

interface LogMessage {
  id: string;
  correlationId: string;
  timestamp: string;
  user: string;
  event: string;
  details: string;
  status: 'Success' | 'Warning' | 'Info';
}

export default function OperationsLogPage() {
  const [search, setSearch] = useState('');
  const [filterEvent, setFilterEvent] = useState<string>('');

  const filteredOperations = MOCK_OPERATIONS.filter((op) => {
    const matchesSearch =
      op.id.toLowerCase().includes(search.toLowerCase()) ||
      op.correlationId.toLowerCase().includes(search.toLowerCase()) ||
      op.details.toLowerCase().includes(search.toLowerCase()) ||
      op.user.toLowerCase().includes(search.toLowerCase());

    const matchesEvent = filterEvent ? op.event === filterEvent : true;

    return matchesSearch && matchesEvent;
  });

  const getEventBadge = (event: string) => {
    const labels: Record<string, string> = {
      Payment_Created: 'Платеж проведен',
      Contract_Overdue: 'Перевод в просрочку',
      Collection_Logged: 'Soft Collection',
      Contract_Closed: 'Кредит закрыт',
      Reserve_Updated: 'Резервы изменены',
    };
    return (
      <span className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-800">
        {labels[event] || event}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-zinc-950">Реестр операционных событий</h2>
        <p className="text-xs text-zinc-500">Системный финансовый аудит, прохождение транзакций зачисления и изменения статусов договоров.</p>
      </div>

      {/* Панель фильтров */}
      <div className="grid grid-cols-1 gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-2">
        {/* Поиск */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по ID, Correlation ID, деталям или автору..."
            className="w-full rounded border border-zinc-300 pl-10 pr-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Фильтр по типу события */}
        <div className="relative">
          <select
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
            className="w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none bg-white"
          >
            <option value="">Все типы событий</option>
            <option value="Payment_Created">Платеж проведен</option>
            <option value="Contract_Overdue">Перевод в просрочку</option>
            <option value="Collection_Logged">Soft Collection</option>
            <option value="Reserve_Updated">Резервы изменены</option>
          </select>
        </div>
      </div>

      {/* Таблица логов */}
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm font-mono">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-6 py-3 font-semibold text-zinc-700">Дата / Время</th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Request ID</th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Correlation ID</th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Событие</th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Оператор</th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Детали действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 text-xs">
            {filteredOperations.length > 0 ? (
              filteredOperations.map((op) => (
                <tr key={op.id} className="hover:bg-zinc-50/50">
                  <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">{op.timestamp}</td>
                  <td className="px-6 py-4 font-bold text-zinc-700">{op.id}</td>
                  <td className="px-6 py-4 text-zinc-500">{op.correlationId}</td>
                  <td className="px-6 py-4">{getEventBadge(op.event)}</td>
                  <td className="px-6 py-4 text-zinc-600 font-semibold">{op.user}</td>
                  <td className="px-6 py-4 text-zinc-600 font-sans max-w-sm" title={op.details}>
                    <div className="flex items-start gap-1.5">
                      {op.status === 'Success' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                      ) : op.status === 'Warning' ? (
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <Database className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      )}
                      <span className="truncate">{op.details}</span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                  Операционных событий безопасности по выбранным фильтрам не обнаружено.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { Search, ShieldAlert, CheckCircle, AlertTriangle, XCircle, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { AuditLog, AuditStatus } from '@/features/audit/types';

// Демонстрационный набор логов системного аудита
const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: '1',
    timestamp: '19.01.2025, 14:32:10',
    user: { name: 'Константин Смирнов', email: 'k.smirnov@platform.ru' },
    action: 'Вход в систему',
    ipAddress: '192.168.1.120',
    status: 'success',
    description: 'Успешная авторизация по паролю',
  },
  {
    id: '2',
    timestamp: '19.01.2025, 14:15:02',
    user: { name: 'Неизвестно', email: 'o.kuznecova@platform.ru' },
    action: 'Попытка авторизации',
    ipAddress: '95.105.12.34',
    status: 'failed',
    description: 'Неверный пароль при входе в систему',
  },
  {
    id: '3',
    timestamp: '19.01.2025, 13:05:45',
    user: { name: 'Ольга Кузнецова', email: 'o.kuznecova@platform.ru' },
    action: 'Удаление пользователя',
    ipAddress: '192.168.1.122',
    status: 'warning',
    description: 'Удален профиль сотрудника id: 104',
  },
  {
    id: '4',
    timestamp: '19.01.2025, 11:24:15',
    user: { name: 'Дмитрий Иванов', email: 'd.ivanov@platform.ru' },
    action: 'Изменение настроек филиала',
    ipAddress: '10.0.4.89',
    status: 'success',
    description: 'Изменен физический адрес филиала "HQ"',
  },
  {
    id: '5',
    timestamp: '18.01.2025, 18:40:00',
    user: { name: 'Система', email: 'system-agent' },
    action: 'Резервное копирование',
    ipAddress: 'localhost',
    status: 'success',
    description: 'Ежедневный бэкап базы данных выполнен успешно',
  },
];

export default function AuditLogsPage() {
  const [logs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  // Логика фильтрации
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.name.toLowerCase().includes(search.toLowerCase()) ||
      log.user.email.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus ? log.status === filterStatus : true;

    return matchesSearch && matchesStatus;
  });

  // Вспомогательный хелпер для стилизации статусов
  const getStatusBadge = (status: AuditStatus) => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
            <CheckCircle className="h-3.5 w-3.5" />
            Успешно
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
            <XCircle className="h-3.5 w-3.5" />
            Ошибка
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
            <AlertTriangle className="h-3.5 w-3.5" />
            Предупреждение
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-zinc-950">Журнал аудита событий</h2>
        <p className="text-xs text-zinc-500">
          Логирование действий пользователей, изменений прав доступа и критических системных предупреждений.
        </p>
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
            placeholder="Поиск по ФИО, действию, IP или описанию..."
            className="w-full rounded border border-zinc-300 pl-10 pr-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Фильтр по статусу */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none bg-white"
          >
            <option value="">Все события</option>
            <option value="success">Успешно</option>
            <option value="failed">Ошибки</option>
            <option value="warning">Предупреждения</option>
          </select>
        </div>
      </div>

      {/* Таблица журналов */}
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-6 py-3 font-semibold text-zinc-700 whitespace-nowrap">
                Дата / Время
              </th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Инициатор</th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Действие</th>
              <th className="px-6 py-3 font-semibold text-zinc-700">IP-Адрес</th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Статус</th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Описание</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50/50">
                  <td className="px-6 py-4 whitespace-nowrap text-zinc-500 font-mono text-xs">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-900">{log.user.name}</div>
                    <div className="text-xs text-zinc-500">{log.user.email}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-800 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 text-zinc-500 font-mono text-xs">
                    {log.ipAddress}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(log.status)}
                  </td>
                  <td className="px-6 py-4 text-zinc-600 max-w-xs truncate" title={log.description}>
                    {log.description}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-zinc-500">
                  Событий безопасности за указанный период по выбранным фильтрам не найдено.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Простая пагинация */}
        <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-4">
          <span className="text-xs text-zinc-500">
            Показано {filteredLogs.length} из {logs.length} записей логов
          </span>
          <div className="flex gap-2">
            <button
              disabled
              className="inline-flex items-center justify-center rounded border p-1 text-zinc-400 disabled:opacity-50 hover:bg-zinc-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled
              className="inline-flex items-center justify-center rounded border p-1 text-zinc-400 disabled:opacity-50 hover:bg-zinc-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
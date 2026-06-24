'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, ArrowUpDown, ChevronLeft, ChevronRight, UserCheck, ShieldAlert, Ban } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Client, ClientStatus, KYCStatus, RiskLevel } from '@/features/clients/types';
import { useDebounce } from '@/hooks/useDebounce';
import ClientsTableSkeleton from '@/features/clients/components/ClientsTableSkeleton';
import ClientsErrorState from '@/features/clients/components/ClientsErrorState';
import toast from 'react-hot-toast';

// Демонстрационный список клиентов (mock data)
const MOCK_CLIENTS: Client[] = [
  {
    id: 'CL-0891',
    name: 'Абдуллаев Сардорбек Рустамович',
    phone: '+998 90 123 45 67',
    email: 's.abdullaev@mail.uz',
    pinfl: '31204953940129',
    passport: 'FA1029485',
    birthDate: '12.04.1995',
    branchId: 'b1',
    branchName: 'Центральный офис',
    status: 'Active',
    kycStatus: 'Passed',
    riskLevel: 'Low',
    managerName: 'Иван Иванов',
    createdAt: '15.01.2025',
    income: 12000000,
    jobTitle: 'Старший разработчик',
    citizenship: 'Узбекистан'
  },
  {
    id: 'CL-0892',
    name: 'Каримова Мадина Бахтияровна',
    phone: '+998 93 987 65 43',
    email: 'madina.k@inbox.uz',
    pinfl: '40203912830114',
    passport: 'KA3928491',
    birthDate: '28.09.1991',
    branchId: 'b2',
    branchName: 'Филиал Север',
    status: 'Pending',
    kycStatus: 'Pending',
    riskLevel: 'Medium',
    managerName: 'Ольга Кузнецова',
    createdAt: '16.01.2025',
    income: 8500000,
    jobTitle: 'Маркетолог',
    citizenship: 'Узбекистан'
  },
  {
    id: 'CL-0893',
    name: 'Петров Сергей Николаевич',
    phone: '+998 97 456 12 34',
    email: 's.petrov@yandex.ru',
    pinfl: '31405893049104',
    passport: 'TR4928104',
    birthDate: '05.11.1984',
    branchId: 'b1',
    branchName: 'Центральный офис',
    status: 'Blocked',
    kycStatus: 'Required',
    riskLevel: 'High',
    managerName: 'Иван Иванов',
    createdAt: '17.01.2025',
    income: 25000000,
    jobTitle: 'Директор филиала',
    citizenship: 'Российская Федерация'
  },
  {
    id: 'CL-0894',
    name: 'Юсупова Феруза Анваровна',
    phone: '+998 99 333 44 55',
    email: 'feruza.y@gmail.com',
    pinfl: '40105943910492',
    passport: 'AB5928103',
    birthDate: '22.01.2001',
    branchId: 'b3',
    branchName: 'Филиал Юг',
    status: 'Suspended',
    kycStatus: 'Failed',
    riskLevel: 'High',
    managerName: 'Дмитрий Иванов',
    createdAt: '18.01.2025',
    income: 4500000,
    jobTitle: 'Администратор',
    citizenship: 'Узбекистан'
  }
];

export default function ClientsListPage() {
  const router = useRouter();

  // Состояния фильтрации и поиска
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterBranch, setFilterBranch] = useState<string>('');
  const [filterRisk, setFilterRisk] = useState<string>('');

  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Дебаунс для поисковой строки (300 мс задержки перед фильтрацией)
  const debouncedSearch = useDebounce(search, 300);

  // Имитация первичной загрузки данных списка
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setIsError(false);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Данные списка клиентов успешно обновлены');
    }, 1000);
  };

  // Имитация возникновения ошибок по кодам (для демонстрации комплаенс-офицеру)
  const handleTriggerError = (code: 403 | 500 | 'timeout') => {
    setIsError(true);
    if (code === 403) {
      setErrorMessage('Код ошибки: 403 (Forbidden). Доступ к базе клиентов ограничен политикой безопасности вашего аккаунта.');
      toast.error('Доступ запрещен (403)');
    } else if (code === 'timeout') {
      setErrorMessage('Превышено время ожидания ответа от сервера (Gateway Timeout).');
      toast.error('Превышен лимит ожидания сети');
    } else {
      setErrorMessage('Внутренняя ошибка сервера (500 Internal Server Error). Наша техническая служба уже уведомлена.');
      toast.error('Ошибка сервера (500)');
    }
  };

  // Логика сортировки и фильтрации данных
  const filteredClients = MOCK_CLIENTS.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      client.phone.includes(debouncedSearch) ||
      client.pinfl.includes(debouncedSearch) ||
      client.id.toLowerCase().includes(debouncedSearch.toLowerCase());

    const matchesStatus = filterStatus ? client.status === filterStatus : true;
    const matchesBranch = filterBranch ? client.branchId === filterBranch : true;
    const matchesRisk = filterRisk ? client.riskLevel === filterRisk : true;

    return matchesSearch && matchesStatus && matchesBranch && matchesRisk;
  }).sort((a, b) => {
    const factor = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name) * factor;
    }
    return a.createdAt.localeCompare(b.createdAt) * factor;
  });

  const handleSort = (field: 'name' | 'createdAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Бейджи статусов клиента
  const getStatusBadge = (status: ClientStatus) => {
    const styles: Record<ClientStatus, string> = {
      Active: 'bg-green-50 text-green-700 ring-green-600/20',
      Pending: 'bg-blue-50 text-blue-700 ring-blue-600/20',
      Suspended: 'bg-amber-50 text-amber-700 ring-amber-600/20',
      Blocked: 'bg-red-50 text-red-700 ring-red-600/20',
    };
    const labels: Record<ClientStatus, string> = {
      Active: 'Активен',
      Pending: 'На проверке',
      Suspended: 'Приостановлен',
      Blocked: 'Блокирован',
    };
    return (
      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  // Бейджи KYC статусов
  const getKYCBadge = (status: KYCStatus) => {
    const styles: Record<KYCStatus, string> = {
      Passed: 'text-green-700 bg-green-50',
      Failed: 'text-red-700 bg-red-50',
      Pending: 'text-blue-700 bg-blue-50',
      Required: 'text-amber-700 bg-amber-50',
    };
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {status}
      </span>
    );
  };

  if (isLoading) {
    return <ClientsTableSkeleton />;
  }

  if (isError) {
    return <ClientsErrorState message={errorMessage} onRetry={handleRetry} />;
  }

  return (
    <div className="space-y-6">
      {/* Панель симуляции UX состояний (для тестирования) */}
      <div className="flex flex-wrap gap-2 justify-end rounded-lg bg-zinc-100 p-1.5 w-fit ml-auto text-[10px]">
        <button
          onClick={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 800); }}
          className="px-2.5 py-1 rounded bg-white font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
        >
          Скелетон загрузки
        </button>
        <button
          onClick={() => handleTriggerError(403)}
          className="px-2.5 py-1 rounded text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200"
        >
          Симулировать 403
        </button>
        <button
          onClick={() => handleTriggerError(500)}
          className="px-2.5 py-1 rounded text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200"
        >
          Симулировать 500
        </button>
        <button
          onClick={() => handleTriggerError('timeout')}
          className="px-2.5 py-1 rounded text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200"
        >
          Имитировать таймаут
        </button>
      </div>
      
      {/* Шапка списка */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-950">База клиентов</h2>
          <p className="text-xs text-zinc-500">Поиск, KYC/AML верификация и управление юридическими согласиями клиентов.</p>
        </div>
        <button
          onClick={() => router.push('/clients/create')}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          <Plus className="h-4 w-4" /> Создать клиента
        </button>
      </div>

      {/* Фильтры */}
      <div className="grid grid-cols-1 gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-4">
        {/* Поисковая строка */}
        <div className="relative col-span-1 sm:col-span-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ФИО, Телефон, ПИНФЛ или ID..."
            className="w-full rounded border border-zinc-300 pl-10 pr-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Статус */}
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none bg-white"
          >
            <option value="">Все статусы</option>
            <option value="Active">Активен</option>
            <option value="Pending">На проверке</option>
            <option value="Suspended">Приостановлен</option>
            <option value="Blocked">Блокирован</option>
          </select>
        </div>

        {/* Филиал */}
        <div>
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none bg-white"
          >
            <option value="">Все филиалы</option>
            <option value="b1">Центральный офис</option>
            <option value="b2">Филиал Север</option>
            <option value="b3">Филиал Юг</option>
          </select>
        </div>

        {/* Риск-уровень */}
        <div>
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none bg-white"
          >
            <option value="">Все риски</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>
        </div>
      </div>

      {/* Таблица */}
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-6 py-3 font-semibold text-zinc-700">ID Клиента</th>
              <th className="px-6 py-3 font-semibold text-zinc-700 cursor-pointer select-none" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  ФИО / Контакты <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
                </div>
              </th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Документы (ПИНФЛ / Паспорт)</th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Филиал / Менеджер</th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Статус</th>
              <th className="px-6 py-3 font-semibold text-zinc-700">KYC</th>
              <th className="px-6 py-3 font-semibold text-zinc-700">AML Риск</th>
              <th className="px-6 py-3 font-semibold text-zinc-700 cursor-pointer select-none" onClick={() => handleSort('createdAt')}>
                <div className="flex items-center gap-1">
                  Дата регистрации <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-zinc-50/50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/clients/${client.id}`)}
                >
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-zinc-600">{client.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-zinc-950">{client.name}</div>
                    <div className="text-xs text-zinc-500">{client.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-zinc-700 font-medium">ПИНФЛ: {client.pinfl}</div>
                    <div className="text-xs text-zinc-500 font-mono">Паспорт: {client.passport}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-medium text-zinc-800">{client.branchName}</div>
                    <div className="text-xs text-zinc-500">{client.managerName}</div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(client.status)}</td>
                  <td className="px-6 py-4">{getKYCBadge(client.kycStatus)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${client.riskLevel === 'High'
                      ? 'bg-red-50 text-red-700'
                      : client.riskLevel === 'Medium'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-green-50 text-green-700'
                      }`}>
                      {client.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-500">{client.createdAt}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-sm text-zinc-500">
                  Совпадений в базе клиентов не найдено.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Простая пагинация */}
        <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-4">
          <span className="text-xs text-zinc-500">
            Показано {filteredClients.length} из {MOCK_CLIENTS.length} записей
          </span>
          <div className="flex gap-2">
            <button disabled className="inline-flex items-center justify-center rounded border p-1 text-zinc-400 disabled:opacity-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button disabled className="inline-flex items-center justify-center rounded border p-1 text-zinc-400 disabled:opacity-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
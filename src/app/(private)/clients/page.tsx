'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Client, ClientStatus, KYCStatus } from '@/features/clients/types';
import { useDebounce } from '@/hooks/useDebounce';

// Импорты UI Kit (сохраняя структуру)
import PageTransition from '@/shared/ui/PageTransition';
import Button from '@/shared/ui/Button';
import Badge from '@/shared/ui/Badge';
import ClientsTableSkeleton from '@/features/clients/components/ClientsTableSkeleton';
import ClientsErrorState from '@/features/clients/components/ClientsErrorState';
import toast from 'react-hot-toast';

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
  }
];

export default function ClientsListPage() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterBranch, setFilterBranch] = useState<string>('');
  const [filterRisk, setFilterRisk] = useState<string>('');

  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const debouncedSearch = useDebounce(search, 300);

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
      toast.success('Данные успешно обновлены');
    }, 1000);
  };

  const handleTriggerError = (code: 403 | 500) => {
    setIsError(true);
    if (code === 403) {
      setErrorMessage('Код ошибки: 403 (Forbidden). Доступ ограничен.');
      toast.error('Доступ ограничен');
    } else {
      setErrorMessage('Ошибка сервера (500 Internal Server Error).');
      toast.error('Ошибка сервера');
    }
  };

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

  const getStatusBadge = (status: ClientStatus) => {
    switch (status) {
      case 'Active': return <Badge label="Активен" variant="success" />;
      case 'Pending': return <Badge label="На проверке" variant="info" />;
      case 'Suspended': return <Badge label="Приостановлен" variant="warning" />;
      case 'Blocked': return <Badge label="Блокирован" variant="error" />;
    }
  };

  const getKYCBadge = (status: KYCStatus) => {
    switch (status) {
      case 'Passed': return <Badge label="KYC Passed" variant="success" />;
      case 'Failed': return <Badge label="KYC Failed" variant="error" />;
      case 'Pending': return <Badge label="KYC Pending" variant="info" />;
      case 'Required': return <Badge label="KYC Required" variant="warning" />;
    }
  };

  if (isLoading) return <ClientsTableSkeleton />;
  if (isError) return <ClientsErrorState message={errorMessage} onRetry={handleRetry} />;

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Тест-панель для комплаенса */}
        <div className="flex justify-end gap-2 rounded-lg bg-zinc-100 p-1.5 w-fit ml-auto text-[10px]">
          <button onClick={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 800); }} className="px-2 py-0.5 rounded bg-white font-medium text-zinc-700 shadow-sm">Скелетон</button>
          <button onClick={() => handleTriggerError(403)} className="px-2 py-0.5 rounded text-zinc-600">Тест 403</button>
          <button onClick={() => handleTriggerError(500)} className="px-2 py-0.5 rounded text-zinc-600">Тест 500</button>
        </div>

        {/* Шапка списка */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-950">База клиентов</h2>
            <p className="text-xs text-zinc-500 font-medium">Управление карточками заемщиков, скоринг и верификация согласий.</p>
          </div>
          <Button variant="primary" onClick={() => router.push('/clients/create')}>
            <Plus className="h-4 w-4 mr-1.5" /> Создать клиента
          </Button>
        </div>

        {/* Исходная сетка фильтров из Спринта 2 (Без обертки в Card) */}
        <div className="grid grid-cols-1 gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ФИО, Телефон, ПИНФЛ..."
              className="w-full rounded border border-zinc-300 pl-10 pr-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none bg-white"
            />
          </div>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded border border-zinc-300 px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none bg-white">
            <option value="">Все статусы</option>
            <option value="Active">Активен</option>
            <option value="Pending">На проверке</option>
            <option value="Blocked">Блокирован</option>
          </select>

          <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} className="rounded border border-zinc-300 px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none bg-white">
            <option value="">Все филиалы</option>
            <option value="b1">Центральный офис</option>
            <option value="b2">Филиал Север</option>
          </select>

          <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)} className="rounded border border-zinc-300 px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none bg-white">
            <option value="">Все уровни риска</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>
        </div>

        {/* Таблица */}
        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
            <thead className="bg-zinc-50 font-semibold text-zinc-700 text-xs">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3 cursor-pointer select-none" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">ФИО / Контакты <ArrowUpDown className="h-3 w-3 text-zinc-400" /></div>
                </th>
                <th className="px-6 py-3">ПИНФЛ / Паспорт</th>
                <th className="px-6 py-3">Филиал</th>
                <th className="px-6 py-3">Статус</th>
                <th className="px-6 py-3">KYC</th>
                <th className="px-6 py-3 cursor-pointer select-none" onClick={() => handleSort('createdAt')}>
                  <div className="flex items-center gap-1">Регистрация <ArrowUpDown className="h-3 w-3 text-zinc-400" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-xs text-zinc-600">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-zinc-50/50 cursor-pointer transition-colors" onClick={() => router.push(`/clients/${client.id}`)}>
                  <td className="px-6 py-4 font-mono text-zinc-500 font-semibold">{client.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-zinc-900">{client.name}</div>
                    <div className="text-zinc-500 text-[11px] mt-0.5">{client.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-700">ПИНФЛ: {client.pinfl}</div>
                    <div className="text-zinc-500 font-mono text-[11px] mt-0.5">Паспорт: {client.passport}</div>
                  </td>
                  <td className="px-6 py-4">{client.branchName}</td>
                  <td className="px-6 py-4">{getStatusBadge(client.status)}</td>
                  <td className="px-6 py-4">{getKYCBadge(client.kycStatus)}</td>
                  <td className="px-6 py-4 font-mono text-zinc-500">{client.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageTransition>
  );
}
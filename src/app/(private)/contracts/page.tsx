'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Landmark, AlertTriangle } from 'lucide-react';
import { CreditContract, ContractStatus } from '@/features/contracts/types';

// Демонстрационный набор действующих кредитных договоров
const MOCK_CONTRACTS: CreditContract[] = [
  {
    id: 'CTR-5012',
    clientName: 'Абдуллаев Сардорбек Рустамович',
    clientPhone: '+998 90 123 45 67',
    productName: 'Микрозайм Экспресс',
    principalAmount: 15000000,
    remainingBalance: 12500000,
    status: 'Active',
    issueDate: '15.01.2025',
    endDate: '15.01.2026',
    dpd: 0,
  },
  {
    id: 'CTR-5013',
    clientName: 'Каримова Мадина Бахтияровна',
    clientPhone: '+998 93 987 65 43',
    productName: 'Потребительский без залога',
    principalAmount: 50000000,
    remainingBalance: 48000000,
    status: 'Active',
    issueDate: '10.01.2025',
    endDate: '10.01.2027',
    dpd: 0,
  },
  {
    id: 'CTR-5014',
    clientName: 'Петров Сергей Николаевич',
    clientPhone: '+998 97 456 12 34',
    productName: 'Микрозайм Экспресс',
    principalAmount: 10000000,
    remainingBalance: 8500000,
    status: 'Overdue',
    issueDate: '01.12.2024',
    endDate: '01.06.2025',
    dpd: 14, // 14 дней просрочки
  },
  {
    id: 'CTR-5015',
    clientName: 'Юсупова Феруза Анваровна',
    clientPhone: '+998 99 333 44 55',
    productName: 'Автокредит Стандарт',
    principalAmount: 120000000,
    remainingBalance: 110000000,
    status: 'Overdue',
    issueDate: '15.10.2024',
    endDate: '15.10.2027',
    dpd: 95, // Критическая просрочка (NPL)
  },
];

export default function ContractsListPage() {
  const router = useRouter();

  // Состояния фильтрации
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const [sortBy, setSortBy] = useState<'id' | 'remainingBalance' | 'dpd'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Логика фильтрации и сортировки
  const filteredContracts = MOCK_CONTRACTS.filter((contract) => {
    const matchesSearch =
      contract.id.toLowerCase().includes(search.toLowerCase()) ||
      contract.clientName.toLowerCase().includes(search.toLowerCase()) ||
      contract.clientPhone.includes(search);

    const matchesStatus = filterStatus ? contract.status === filterStatus : true;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const factor = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'remainingBalance') {
      return (a.remainingBalance - b.remainingBalance) * factor;
    }
    if (sortBy === 'dpd') {
      return (a.dpd - b.dpd) * factor;
    }
    return a.id.localeCompare(b.id) * factor;
  });

  const handleSort = (field: 'id' | 'remainingBalance' | 'dpd') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Цветовая разметка статусов договоров
  const getStatusBadge = (status: ContractStatus, dpd: number) => {
    if (status === 'Overdue') {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-600/10">
          <AlertTriangle className="h-3.5 w-3.5" /> Просрочка ({dpd} дн.)
        </span>
      );
    }

    const styles: Record<Exclude<ContractStatus, 'Overdue'>, string> = {
      Draft: 'bg-zinc-100 text-zinc-800 ring-zinc-600/10',
      Approved: 'bg-blue-50 text-blue-700 ring-blue-700/10',
      Active: 'bg-green-50 text-green-700 ring-green-600/20',
      Restructured: 'bg-amber-50 text-amber-700 ring-amber-600/10',
      Closed: 'bg-zinc-100 text-zinc-600 ring-zinc-600/20',
      Written_Off: 'bg-red-100 text-red-800 ring-red-600/20',
    };

    const labels: Record<ContractStatus, string> = {
      Draft: 'Черновик',
      Approved: 'Одобрен',
      Active: 'Активен',
      Overdue: 'Просрочен',
      Restructured: 'Реструктурирован',
      Closed: 'Закрыт',
      Written_Off: 'Списан',
    };

    return (
      <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-950">Реестр активных договоров</h2>
          <p className="text-xs text-zinc-500">Мониторинг действующих кредитов, остатков долга и контроль просроченной задолженности.</p>
        </div>
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
            placeholder="Номер договора, ФИО или телефон..."
            className="w-full rounded border border-zinc-300 pl-10 pr-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Статус договора */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none bg-white"
          >
            <option value="">Все статусы</option>
            <option value="Active">Активен</option>
            <option value="Overdue">Просрочен</option>
            <option value="Restructured">Реструктурирован</option>
            <option value="Closed">Закрыт</option>
          </select>
        </div>
      </div>

      {/* Таблица */}
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-6 py-3 font-semibold text-zinc-700 cursor-pointer select-none" onClick={() => handleSort('id')}>
                <div className="flex items-center gap-1">
                  Номер договора <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
                </div>
              </th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Клиент / Контакты</th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Продукт</th>
              <th className="px-6 py-3 font-semibold text-zinc-700 cursor-pointer select-none" onClick={() => handleSort('remainingBalance')}>
                <div className="flex items-center gap-1">
                  Остаток долга <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
                </div>
              </th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Статус</th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Дата выдачи</th>
              <th className="px-6 py-3 font-semibold text-zinc-700 cursor-pointer select-none" onClick={() => handleSort('dpd')}>
                <div className="flex items-center gap-1">
                  DPD <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {filteredContracts.length > 0 ? (
              filteredContracts.map((contract) => (
                <tr
                  key={contract.id}
                  className="hover:bg-zinc-50/50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/contracts/${contract.id}`)}
                >
                  <td className="px-6 py-4 font-mono text-xs font-bold text-zinc-700">{contract.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-zinc-950">{contract.clientName}</div>
                    <div className="text-xs text-zinc-500">{contract.clientPhone}</div>
                  </td>
                  <td className="px-6 py-4 text-zinc-700 font-medium">{contract.productName}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-zinc-900">{contract.remainingBalance.toLocaleString()} сум</div>
                    <div className="text-xs text-zinc-400">из {contract.principalAmount.toLocaleString()} сум</div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(contract.status, contract.dpd)}</td>
                  <td className="px-6 py-4 text-zinc-500 text-xs">{contract.issueDate}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${
                      contract.dpd > 90
                        ? 'bg-red-50 text-red-700'
                        : contract.dpd > 0
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-green-50 text-green-700'
                    }`}>
                      {contract.dpd} дней
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-zinc-500">
                  Активных договоров по выбранным фильтрам не найдено.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Пагинация */}
        <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-4">
          <span className="text-xs text-zinc-500">
            Показано {filteredContracts.length} из {MOCK_CONTRACTS.length} записей
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
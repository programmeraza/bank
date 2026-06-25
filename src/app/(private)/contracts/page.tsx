'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { CreditContract, ContractStatus } from '@/features/contracts/types';

// Импорты UI Kit (сохраняя структуру реестра)
import PageTransition from '@/shared/ui/PageTransition';
import Badge from '@/shared/ui/Badge';

const MOCK_CONTRACTS: CreditContract[] = [
  { id: 'CTR-5012', clientName: 'Абдуллаев Сардорбек Рустамович', clientPhone: '+998 90 123 45 67', productName: 'Микрозайм Экспресс', principalAmount: 15000000, remainingBalance: 12500000, status: 'Active', issueDate: '15.01.2025', endDate: '15.01.2026', dpd: 0 },
  { id: 'CTR-5013', clientName: 'Каримова Мадина Бахтияровна', clientPhone: '+998 93 987 65 43', productName: 'Потребительский без залога', principalAmount: 50000000, remainingBalance: 48000000, status: 'Active', issueDate: '10.01.2025', endDate: '10.01.2027', dpd: 0 },
  { id: 'CTR-5014', clientName: 'Петров Сергей Николаевич', clientPhone: '+998 97 456 12 34', productName: 'Микрозайм Экспресс', principalAmount: 10000000, remainingBalance: 8500000, status: 'Overdue', issueDate: '01.12.2024', endDate: '01.06.2025', dpd: 14 },
  { id: 'CTR-5015', clientName: 'Юсупова Феруза Анваровна', clientPhone: '+998 99 333 44 55', productName: 'Автокредит Стандарт', principalAmount: 120000000, remainingBalance: 110000000, status: 'Overdue', issueDate: '15.10.2024', endDate: '15.10.2027', dpd: 95 },
];

export default function ContractsListPage() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const [sortBy, setSortBy] = useState<'id' | 'remainingBalance' | 'dpd'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredContracts = MOCK_CONTRACTS.filter((contract) => {
    const matchesSearch =
      contract.id.toLowerCase().includes(search.toLowerCase()) ||
      contract.clientName.toLowerCase().includes(search.toLowerCase()) ||
      contract.clientPhone.includes(search);

    const matchesStatus = filterStatus ? contract.status === filterStatus : true;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const factor = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'remainingBalance') return (a.remainingBalance - b.remainingBalance) * factor;
    if (sortBy === 'dpd') return (a.dpd - b.dpd) * factor;
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

  const getStatusBadge = (status: ContractStatus, dpd: number) => {
    if (status === 'Overdue') {
      return <Badge label={`Просрочка (${dpd} дн.)`} variant="error" />;
    }
    switch (status) {
      case 'Active': return <Badge label="Активен" variant="success" />;
      case 'Restructured': return <Badge label="Реструктурирован" variant="warning" />;
      case 'Closed': return <Badge label="Закрыт" variant="neutral" />;
      default: return <Badge label="Черновик" variant="neutral" />;
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Шапка */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-950">Реестр активных договоров</h2>
            <p className="text-xs text-zinc-500 font-medium">Мониторинг действующих кредитов, остатков долга и контроль просрочек.</p>
          </div>
        </div>

        {/* Панель фильтров */}
        <div className="grid grid-cols-1 gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-2">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Номер договора, ФИО или телефон..."
              className="w-full rounded border border-zinc-300 pl-10 pr-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none bg-white"
            />
          </div>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none bg-white">
            <option value="">Все статусы</option>
            <option value="Active">Активен</option>
            <option value="Overdue">Просрочен</option>
            <option value="Closed">Закрыт</option>
          </select>
        </div>

        {/* Таблица */}
        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
            <thead className="bg-zinc-50 font-semibold text-zinc-700 text-xs">
              <tr>
                <th className="px-6 py-3 cursor-pointer select-none" onClick={() => handleSort('id')}>Номер</th>
                <th className="px-6 py-3">Заемщик</th>
                <th className="px-6 py-3">Кредит</th>
                <th className="px-6 py-3 cursor-pointer select-none" onClick={() => handleSort('remainingBalance')}>Остаток долга</th>
                <th className="px-6 py-3">Статус</th>
                <th className="px-6 py-3">Дата выдачи</th>
                <th className="px-6 py-3 cursor-pointer select-none" onClick={() => handleSort('dpd')}>DPD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-xs text-zinc-600">
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-zinc-50/50 cursor-pointer transition-colors" onClick={() => router.push(`/contracts/${contract.id}`)}>
                  <td className="px-6 py-4 font-mono text-zinc-700 font-bold">{contract.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-zinc-950">{contract.clientName}</div>
                    <div className="text-zinc-500 text-[11px] mt-0.5">{contract.clientPhone}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">{contract.productName}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-zinc-900">{contract.remainingBalance.toLocaleString()} сум</div>
                    <div className="text-zinc-400 text-[10px] mt-0.5">из {contract.principalAmount.toLocaleString()} сум</div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(contract.status, contract.dpd)}</td>
                  <td className="px-6 py-4 text-zinc-500">{contract.issueDate}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${
                      contract.dpd > 90 ? 'bg-red-50 text-red-700' : contract.dpd > 0 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                    }`}>
                      {contract.dpd} дней
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageTransition>
  );
}
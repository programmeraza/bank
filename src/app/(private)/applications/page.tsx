'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, Plus, FileText, ArrowUpDown, 
  ChevronLeft, ChevronRight, Eye, ShieldAlert 
} from 'lucide-react';
import { Application, ApplicationStatus } from '@/features/applications/types/index';

// Демонстрационный набор кредитных заявок на разных этапах конвейера
const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'APP-1024',
    clientId: 'CL-0891',
    clientName: 'Абдуллаев Сардорбек Рустамович',
    clientPhone: '+998 90 123 45 67',
    productId: 'p1',
    productName: 'Микрозайм Онлайн',
    amount: 15000000,
    term: 12,
    status: 'Completed',
    createdAt: '18.01.2025',
    branchName: 'Центральный офис',
    managerName: 'Иван Иванов',
  },
  {
    id: 'APP-1025',
    clientId: 'CL-0892',
    clientName: 'Каримова Мадина Бахтияровна',
    clientPhone: '+998 93 987 65 43',
    productId: 'p2',
    productName: 'Потребительский без залога',
    amount: 50000000,
    term: 24,
    status: 'Review',
    createdAt: '19.01.2025',
    branchName: 'Филиал Север',
    managerName: 'Ольга Кузнецова',
  },
  {
    id: 'APP-1026',
    clientId: 'CL-0893',
    clientName: 'Петров Сергей Николаевич',
    clientPhone: '+998 97 456 12 34',
    productId: 'p1',
    productName: 'Микрозайм Онлайн',
    amount: 10000000,
    term: 6,
    status: 'KATM_Check',
    createdAt: '20.01.2025',
    branchName: 'Центральный офис',
    managerName: 'Иван Иванов',
  },
  {
    id: 'APP-1027',
    clientId: 'CL-0894',
    clientName: 'Юсупова Феруза Анваровна',
    clientPhone: '+998 99 333 44 55',
    productId: 'p3',
    productName: 'Автокредит Стандарт',
    amount: 120000000,
    term: 36,
    status: 'Rejected',
    createdAt: '21.01.2025',
    branchName: 'Филиал Юг',
    managerName: 'Дмитрий Иванов',
  },
];

export default function ApplicationsListPage() {
  const router = useRouter();

  // Состояния фильтрации
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterBranch, setFilterBranch] = useState<string>('');

  const [sortBy, setSortBy] = useState<'id' | 'amount' | 'createdAt'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Логика фильтрации и сортировки
  const filteredApplications = MOCK_APPLICATIONS.filter((app) => {
    const matchesSearch =
      app.id.toLowerCase().includes(search.toLowerCase()) ||
      app.clientName.toLowerCase().includes(search.toLowerCase()) ||
      app.clientPhone.includes(search);

    const matchesStatus = filterStatus ? app.status === filterStatus : true;
    const matchesBranch = filterBranch ? app.branchName === filterBranch : true;

    return matchesSearch && matchesStatus && matchesBranch;
  }).sort((a, b) => {
    const factor = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'amount') {
      return (a.amount - b.amount) * factor;
    }
    if (sortBy === 'createdAt') {
      return a.createdAt.localeCompare(b.createdAt) * factor;
    }
    return a.id.localeCompare(b.id) * factor;
  });

  const handleSort = (field: 'id' | 'amount' | 'createdAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Бейджи статусов заявки (Кредитный конвейер)
  const getStatusBadge = (status: ApplicationStatus) => {
    const styles: Record<ApplicationStatus, string> = {
      Draft: 'bg-zinc-100 text-zinc-800 ring-zinc-600/10',
      Created: 'bg-blue-50 text-blue-700 ring-blue-700/10',
      KATM_Check: 'bg-amber-50 text-amber-800 ring-amber-600/10',
      Debt_Check: 'bg-orange-50 text-orange-800 ring-orange-600/10',
      Review: 'bg-indigo-50 text-indigo-700 ring-indigo-700/10',
      Approved: 'bg-green-50 text-green-700 ring-green-600/20',
      Rejected: 'bg-red-50 text-red-700 ring-red-600/10',
      Contract_Generated: 'bg-cyan-50 text-cyan-800 ring-cyan-600/10',
      Completed: 'bg-emerald-50 text-green-700 ring-emerald-600/20',
    };

    const labels: Record<ApplicationStatus, string> = {
      Draft: 'Черновик',
      Created: 'Создана',
      KATM_Check: 'Проверка KATM',
      Debt_Check: 'Долговая нагрузка',
      Review: 'Андеррайтинг',
      Approved: 'Одобрена',
      Rejected: 'Отклонена',
      Contract_Generated: 'Договор сформирован',
      Completed: 'Выдан',
    };

    return (
      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Шапка списка */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-950">Кредитные заявки</h2>
          <p className="text-xs text-zinc-500">Управление конвейером кредитования, кредитным скорингом и выдачей.</p>
        </div>
        <button
          onClick={() => router.push('/applications/create')}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          <Plus className="h-4 w-4" /> Создать заявку
        </button>
      </div>

      {/* Фильтры */}
      <div className="grid grid-cols-1 gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-3">
        {/* Поиск */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Номер заявки или ФИО клиента..."
            className="w-full rounded border border-zinc-300 pl-10 pr-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Статус */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none bg-white"
          >
            <option value="">Все статусы</option>
            <option value="Draft">Черновик</option>
            <option value="Created">Создана</option>
            <option value="KATM_Check">Проверка KATM</option>
            <option value="Review">Андеррайтинг</option>
            <option value="Approved">Одобрена</option>
            <option value="Rejected">Отклонена</option>
            <option value="Completed">Выдана</option>
          </select>
        </div>

        {/* Филиал */}
        <div className="relative">
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none bg-white"
          >
            <option value="">Все филиалы</option>
            <option value="Центральный офис">Центральный офис</option>
            <option value="Филиал Север">Филиал Север</option>
            <option value="Филиал Юг">Филиал Юг</option>
          </select>
        </div>
      </div>

      {/* Таблица заявок */}
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-6 py-3 font-semibold text-zinc-700 cursor-pointer select-none" onClick={() => handleSort('id')}>
                <div className="flex items-center gap-1">
                  Номер заявки <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
                </div>
              </th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Клиент</th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Кредитный продукт</th>
              <th className="px-6 py-3 font-semibold text-zinc-700 cursor-pointer select-none" onClick={() => handleSort('amount')}>
                <div className="flex items-center gap-1">
                  Сумма / Срок <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
                </div>
              </th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Филиал / Исполнитель</th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Статус</th>
              <th className="px-6 py-3 font-semibold text-zinc-700 cursor-pointer select-none" onClick={() => handleSort('createdAt')}>
                <div className="flex items-center gap-1">
                  Создана <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-zinc-50/50">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-zinc-700">{app.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-zinc-950">{app.clientName}</div>
                    <div className="text-xs text-zinc-500">{app.clientPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-800 flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-zinc-400" />
                      {app.productName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-zinc-900">{app.amount.toLocaleString()} сум</div>
                    <div className="text-xs text-zinc-500">{app.term} месяцев</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-medium text-zinc-800">{app.branchName}</div>
                    <div className="text-xs text-zinc-500">{app.managerName}</div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                  <td className="px-6 py-4 text-xs text-zinc-500">{app.createdAt}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-zinc-500">
                  Заявок по выбранным фильтрам не обнаружено.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Простая пагинация */}
        <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-4">
          <span className="text-xs text-zinc-500">
            Показано {filteredApplications.length} из {MOCK_APPLICATIONS.length} записей
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
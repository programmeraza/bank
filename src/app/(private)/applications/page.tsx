'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, FileText, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Application, ApplicationStatus } from '@/features/applications/types';

// Импорты UI Kit (без изменения верстки)
import PageTransition from '@/shared/ui/PageTransition';
import Button from '@/shared/ui/Button';
import Badge from '@/shared/ui/Badge';

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

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterBranch, setFilterBranch] = useState<string>('');

  const [sortBy, setSortBy] = useState<'id' | 'amount' | 'createdAt'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

  // Маппинг кредитных статусов на общий UI Badge
  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Draft': return <Badge label="Черновик" variant="neutral" />;
      case 'Created': return <Badge label="Создана" variant="info" />;
      case 'KATM_Check': return <Badge label="Проверка КАТМ" variant="warning" />;
      case 'Debt_Check': return <Badge label="Долговая нагрузка" variant="warning" />;
      case 'Review': return <Badge label="Андеррайтинг" variant="info" />;
      case 'Approved': return <Badge label="Одобрена" variant="success" />;
      case 'Rejected': return <Badge label="Отклонена" variant="error" />;
      case 'Contract_Generated': return <Badge label="Договор готов" variant="info" />;
      case 'Completed': return <Badge label="Выдан" variant="success" />;
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Шапка списка */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-950">Кредитные заявки</h2>
            <p className="text-xs text-zinc-500">Управление конвейером кредитования, кредитным скорингом и выдачей.</p>
          </div>
          <Button variant="primary" onClick={() => router.push('/applications/create')}>
            <Plus className="h-4 w-4 mr-1.5" /> Создать заявку
          </Button>
        </div>

        {/* Фильтры в исходной верстке */}
        <div className="grid grid-cols-1 gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-3">
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
            <thead className="bg-zinc-50 font-semibold text-zinc-700 text-xs">
              <tr>
                <th className="px-6 py-3 cursor-pointer select-none" onClick={() => handleSort('id')}>
                  <div className="flex items-center gap-1">Номер заявки <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" /></div>
                </th>
                <th className="px-6 py-3">Клиент</th>
                <th className="px-6 py-3">Кредитный продукт</th>
                <th className="px-6 py-3 cursor-pointer select-none" onClick={() => handleSort('amount')}>
                  <div className="flex items-center gap-1">Сумма / Срок <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" /></div>
                </th>
                <th className="px-6 py-3">Филиал / Исполнитель</th>
                <th className="px-6 py-3">Статус</th>
                <th className="px-6 py-3 cursor-pointer select-none" onClick={() => handleSort('createdAt')}>
                  <div className="flex items-center gap-1">Создана <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-xs text-zinc-600">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-zinc-50/50 cursor-pointer transition-colors" onClick={() => router.push(`/applications/${app.id}`)}>
                  <td className="px-6 py-4 font-mono text-zinc-700 font-bold">{app.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-zinc-950">{app.clientName}</div>
                    <div className="text-zinc-500 text-[11px] mt-0.5">{app.clientPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-800 flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-zinc-400" />
                      {app.productName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-zinc-900">{app.amount.toLocaleString()} сум</div>
                    <div className="text-zinc-500 text-[11px] mt-0.5">{app.term} месяцев</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-zinc-800 font-medium">{app.branchName}</div>
                    <div className="text-zinc-500 text-[11px] mt-0.5">{app.managerName}</div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                  <td className="px-6 py-4 text-zinc-500">{app.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageTransition>
  );
}
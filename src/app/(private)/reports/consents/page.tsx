'use client';

import React, { useState } from 'react';
import { ArrowLeft, Filter, ShieldCheck, AlertTriangle, FileSpreadsheet, Eye } from 'lucide-react';

interface ConsentReportItem {
  clientName: string;
  consentType: string;
  status: 'Active' | 'Expired' | 'Revoked' | 'Missing';
  version: string;
  lastUpdated: string;
  branchName: string;
}

export default function ConsentReportsPage() {
  const [filterBranch, setFilterBranch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [consentLogs] = useState<ConsentReportItem[]>([
    { clientName: 'Абдуллаев Сардорбек', consentType: 'Согласие на обработку ПД', status: 'Active', version: 'v1.2', lastUpdated: '15.01.2025', branchName: 'Центральный офис' },
    { clientName: 'Каримова Мадина', consentType: 'Запрос данных в Кредитное бюро', status: 'Active', version: 'v2.0', lastUpdated: '10.01.2025', branchName: 'Филиал Север' },
    { clientName: 'Петров Сергей', consentType: 'Согласие на обработку ПД', status: 'Revoked', version: 'v1.2', lastUpdated: '19.01.2025', branchName: 'Центральный офис' },
    { clientName: 'Юсупова Феруза', consentType: 'Запрос данных в Кредитное бюро', status: 'Missing', version: 'v1.0', lastUpdated: '—', branchName: 'Филиал Юг' },
  ]);

  const filteredLogs = consentLogs.filter((log) => {
    const matchesBranch = filterBranch ? log.branchName === filterBranch : true;
    const matchesStatus = filterStatus ? log.status === filterStatus : true;
    return matchesBranch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="flex items-center gap-3 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-950">Отчет по согласиям клиентов</h2>
          <p className="text-xs text-zinc-500">Комплаенс-контроль активных, истекших и отозванных согласий в разрезе филиалов.</p>
        </div>
      </div>

      {/* Фильтры */}
      <div className="grid grid-cols-1 gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-2">
        <select
          value={filterBranch}
          onChange={(e) => setFilterBranch(e.target.value)}
          className="rounded border border-zinc-300 px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-indigo-500"
        >
          <option value="">Все филиалы</option>
          <option value="Центральный офис">Центральный офис</option>
          <option value="Филиал Север">Филиал Север</option>
          <option value="Филиал Юг">Филиал Юг</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded border border-zinc-300 px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-indigo-500"
        >
          <option value="">Все статусы согласий</option>
          <option value="Active">Подписано (Active)</option>
          <option value="Revoked">Отозвано (Revoked)</option>
          <option value="Missing">Отсутствует (Missing)</option>
        </select>
      </div>

      {/* Таблица согласий */}
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm font-sans">
          <thead className="bg-zinc-50 font-semibold text-zinc-700">
            <tr>
              <th className="px-6 py-3">ФИО Клиента</th>
              <th className="px-6 py-3">Тип согласия</th>
              <th className="px-6 py-3">Версия</th>
              <th className="px-6 py-3">Филиал</th>
              <th className="px-6 py-3">Дата изменения</th>
              <th className="px-6 py-3">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-150 text-xs text-zinc-600">
            {filteredLogs.map((log, index) => (
              <tr key={index} className="hover:bg-zinc-50/50">
                <td className="px-6 py-4 font-semibold text-zinc-900">{log.clientName}</td>
                <td className="px-6 py-4">{log.consentType}</td>
                <td className="px-6 py-4 font-mono">{log.version}</td>
                <td className="px-6 py-4">{log.branchName}</td>
                <td className="px-6 py-4 font-mono">{log.lastUpdated}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    log.status === 'Active'
                      ? 'bg-green-50 text-green-700'
                      : log.status === 'Revoked'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
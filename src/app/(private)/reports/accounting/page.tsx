'use client';

import React from 'react';
import { Landmark, CheckCircle, FileSpreadsheet, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

interface PostingRow {
  accountDeb: string;
  accountCred: string;
  amount: number;
  description: string;
  txId: string;
}

export default function AccountingReportsPage() {
  const postLogs: PostingRow[] = [
    { accountDeb: '20206810900010001001', accountCred: '10101810300000000001', amount: 15000000, description: 'Выдача кредитных средств по договору CTR-5012', txId: 'TX-90214' },
    { accountDeb: '10101810300000000001', accountCred: '20206810900010001001', amount: 1250000, description: 'Погашение основного долга по договору CTR-5014', txId: 'TX-90215' },
    { accountDeb: '10101810300000000001', accountCred: '47422810500000000002', amount: 250000, description: 'Погашение процентов по договору CTR-5014', txId: 'TX-90216' },
  ];

  const handleExport = () => {
    toast.success('Бухгалтерский балансовый отчет выгружен');
  };

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-950">Бухгалтерский аудит и проводки (GL)</h2>
          <p className="text-xs text-zinc-500">Сверка балансовых счетов зачисления, проводки двойной записи и статус операционного дня.</p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm"
        >
          <FileSpreadsheet className="h-4 w-4" /> Скачать балансовый отчет
        </button>
      </div>

      {/* Операционный день */}
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-xs text-green-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <span className="font-bold">Статус операционного дня:</span> Баланс сверен, операционный день закрыт успешно. Проводки зафиксированы в АБС.
          </div>
        </div>
        <span className="font-mono text-[10px] bg-green-100 px-2 py-0.5 rounded border border-green-200">
          CLOSED
        </span>
      </div>

      {/* Таблица проводок */}
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm font-mono">
          <thead className="bg-zinc-50 font-semibold text-zinc-700 text-xs">
            <tr>
              <th className="px-6 py-3">Дебет счёт</th>
              <th className="px-6 py-3">Кредит счёт</th>
              <th className="px-6 py-3 text-right">Сумма проводки</th>
              <th className="px-6 py-3">Назначение платежа</th>
              <th className="px-6 py-3">Транзакция ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-150 text-xs text-zinc-600">
            {postLogs.map((log) => (
              <tr key={log.txId} className="hover:bg-zinc-50/50">
                <td className="px-6 py-4 text-zinc-900">{log.accountDeb}</td>
                <td className="px-6 py-4 text-zinc-900">{log.accountCred}</td>
                <td className="px-6 py-4 text-right font-bold text-zinc-950">{log.amount.toLocaleString()} сум</td>
                <td className="px-6 py-4 font-sans max-w-xs truncate" title={log.description}>{log.description}</td>
                <td className="px-6 py-4 font-bold text-zinc-700">{log.txId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
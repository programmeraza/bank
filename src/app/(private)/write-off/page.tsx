'use client';

import React, { useState } from 'react';
import { AlertCircle, ShieldAlert, FileDown, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface WriteOffCandidate {
  id: string;
  clientName: string;
  dpd: number;
  principal: number;
  interest: number;
  penalty: number;
  legalCosts: number;
}

export default function WriteOffPage() {
  const [candidates, setCandidates] = useState<WriteOffCandidate[]>([
    { id: 'CTR-5015', clientName: 'Юсупова Феруза Анваровна', dpd: 195, principal: 110000000, interest: 14500000, penalty: 2500000, legalCosts: 1200000 },
  ]);

  const handleInitiateWriteOff = (id: string) => {
    if (confirm(`Вы уверены, что хотите инициировать процедуру списания долга ${id} за счет резервов?`)) {
      setCandidates((prev) => prev.filter((c) => c.id !== id));
      toast.success('Заявка на списание направлена на утверждение Кредитному комитету');
    }
  };

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-zinc-950">Списание безнадежной задолженности (Write-Off)</h2>
        <p className="text-xs text-zinc-500">Реестр договоров с просрочкой 181+ дней, подлежащих списанию за счет резервов банка.</p>
      </div>

      {/* Список кандидатов на списание */}
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm font-mono">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-6 py-3 font-semibold text-zinc-700">Номер договора</th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Заемщик</th>
              <th className="px-6 py-3 font-semibold text-zinc-700 text-right">Основной долг</th>
              <th className="px-6 py-3 font-semibold text-zinc-700 text-right">Проценты</th>
              <th className="px-6 py-3 font-semibold text-zinc-700 text-right">Пени/Штрафы</th>
              <th className="px-6 py-3 font-semibold text-zinc-700 text-right">Судебные расходы</th>
              <th className="px-6 py-3 text-right font-semibold text-zinc-700">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 text-xs">
            {candidates.length > 0 ? (
              candidates.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50/50">
                  <td className="px-6 py-4 font-bold text-zinc-950">{c.id}</td>
                  <td className="px-6 py-4 font-sans font-semibold text-zinc-900">{c.clientName} (DPD {c.dpd})</td>
                  <td className="px-6 py-4 text-right text-zinc-900">{c.principal.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-zinc-500">{c.interest.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-zinc-500">{c.penalty.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-zinc-500">{c.legalCosts.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleInitiateWriteOff(c.id)}
                      className="rounded bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
                    >
                      Инициировать списание
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 font-sans">
                  Кандидатов на списание с просрочкой 181+ дней не обнаружено.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
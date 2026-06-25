'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Check, ShieldCheck, FileCheck, History, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface ContractVersion {
  version: string;
  publishDate: string;
  status: 'Active' | 'Archived';
  description: string;
}

export default function DisclosurePage() {
  const router = useRouter();
  const { id } = useParams();

  // Состояния ознакомления (Этап FE-S6-01)
  const [readPassport, setReadPassport] = useState(false);
  const [readContract, setReadContract] = useState(false);
  const [readSchedule, setReadSchedule] = useState(false);

  // Обязательные чекбоксы должны быть отмечены
  const isDisclosureConfirmed = readPassport && readContract && readSchedule;

  // История версий договора (Этап FE-S6-02)
  const [versions] = useState<ContractVersion[]>([
    { version: 'v1.2', publishDate: '20.01.2025', status: 'Active', description: 'Корректировка ПСК и уточнение форс-мажорных обстоятельств.' },
    { version: 'v1.1', publishDate: '10.01.2025', status: 'Archived', description: 'Обновление реквизитов платежных агентов и КАТМ.' },
    { version: 'v1.0', publishDate: '15.12.2024', status: 'Archived', description: 'Базовая публикация шаблона потребительского кредитования.' },
  ]);

  const handleConfirmDisclosure = () => {
    if (!isDisclosureConfirmed) {
      toast.error('Необходимо подтвердить ознакомление со всеми документами');
      return;
    }
    toast.success('Раскрытие информации подтверждено. Перенаправление к договору.');
    router.push(`/applications/${id}/contract`);
  };

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="flex items-center gap-3 border-b pb-4">
        <button
          onClick={() => router.back()}
          className="rounded p-1 hover:bg-zinc-100 transition-colors"
          title="Назад"
        >
          <ArrowLeft className="h-5 w-5 text-zinc-500" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-zinc-950">Раскрытие информации и аудит версий</h2>
          <p className="text-xs text-zinc-500">Процедура обязательного подтверждения условий сделки перед подписанием договора № {id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Панель чекбоксов раскрытия (FE-S6-01) */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm md:col-span-2 space-y-6">
          <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
            <FileCheck className="h-4.5 w-4.5 text-indigo-500" /> Подтверждение ознакомления
          </h3>

          <div className="space-y-4">
            {/* Чекбокс 1 */}
            <label className="flex items-start gap-3.5 p-4 rounded-lg border border-zinc-200 hover:bg-zinc-50/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={readPassport}
                onChange={(e) => setReadPassport(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="text-xs">
                <span className="font-bold text-zinc-900 block">Я подтверждаю ознакомление с Паспортом продукта</span>
                <p className="text-zinc-500 mt-0.5">Клиент ознакомлен с полной процентной ставкой (ПСК), комиссиями и полной стоимостью выплат по кредиту.</p>
              </div>
            </label>

            {/* Чекбокс 2 */}
            <label className="flex items-start gap-3.5 p-4 rounded-lg border border-zinc-200 hover:bg-zinc-50/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={readContract}
                onChange={(e) => setReadContract(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="text-xs">
                <span className="font-bold text-zinc-900 block">Я подтверждаю ознакомление с условиями Договора займа</span>
                <p className="text-zinc-500 mt-0.5">Клиент согласен со всеми пунктами юридического соглашения, правами и обязанностями сторон.</p>
              </div>
            </label>

            {/* Чекбокс 3 */}
            <label className="flex items-start gap-3.5 p-4 rounded-lg border border-zinc-200 hover:bg-zinc-50/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={readSchedule}
                onChange={(e) => setReadSchedule(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="text-xs">
                <span className="font-bold text-zinc-900 block">Я подтверждаю ознакомление с Графиком аннуитетных платежей</span>
                <p className="text-zinc-500 mt-0.5">Клиент согласен с датами и суммами ежемесячных списаний, указанных в календарном плане погашения.</p>
              </div>
            </label>
          </div>

          <button
            onClick={handleConfirmDisclosure}
            disabled={!isDisclosureConfirmed}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:bg-zinc-150 disabled:text-zinc-400"
          >
            Подтвердить раскрытие и продолжить <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Журнал версионирования договоров (FE-S6-02) */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
            <History className="h-4.5 w-4.5 text-zinc-500" /> Версионирование шаблонов договора
          </h3>

          <div className="space-y-4">
            {versions.map((ver) => (
              <div key={ver.version} className="border-b border-dashed pb-3 last:border-0 last:pb-0 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-zinc-900">{ver.version}</span>
                  <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                    ver.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {ver.status === 'Active' ? 'Действующий' : 'Архив'}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500">Дата публикации: {ver.publishDate}</div>
                <p className="text-zinc-600 leading-relaxed">{ver.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
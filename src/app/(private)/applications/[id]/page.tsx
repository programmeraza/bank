'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, FileText, User, CreditCard, ChevronRight, Landmark } from 'lucide-react';
import KatmVerification from '@/features/katm/components/KatmVerification';
import { KatmStatus } from '@/features/katm/types';
import DebtBurdenCheck from '@/features/debt-burden/components/DebtBurdenCheck';
import DecisionBoard from '@/features/underwriting/components/DecisionBoard';
import CollateralForm from '@/features/collateral/components/CollateralForm';
import NasiyaPartnerForm from '@/features/hamroh-nasiya/components/NasiyaPartnerForm';
import IntegrationLogs from '@/features/integrations/components/IntegrationLogs';

export default function ApplicationProcessingPage() {
  const router = useRouter();
  const { id } = useParams();
  const [dbrPassed, setDbrPassed] = useState<boolean>(true);
  const [currentDbr, setCurrentDbr] = useState<number>(0);
  // Стейты прохождения проверок
  const [katmResult, setKatmResult] = useState<'Success' | 'Rejected' | 'Error' | 'Manual_Review' | null>(null);
  // Добавьте стейт для отслеживания финального статуса решения кредитного комитета
  const [finalDecision, setFinalDecision] = useState<'Approved' | 'Rejected' | null>(null);
  // Локальный стейт заявки для прохождения конвейера
  const [appStatus, setAppStatus] = useState<'Created' | 'KATM_Check' | 'Review'>('Created');

  const handleKatmVerificationComplete = (status: KatmStatus, score: number) => {
    if (status === 'Success') {
      setAppStatus('Review');
    } else if (status === 'Rejected') {
      setAppStatus('Created'); // Или оставляем заблокированной
    }
  };

  // Разместите рядом с другими стейтами в начале компонента
  const handleDbrComplete = (passed: boolean, dbr: number) => {
    setDbrPassed(passed);
    setCurrentDbr(dbr);
  };

  // const handleKatmVerificationComplete = (status: KatmStatus, score: number) => {
  //   setKatmResult(status);
  //   if (status === 'Success') {
  //     setAppStatus('Review');
  //   }
  // };

  const handleFinalDecisionComplete = (decision: 'Approved' | 'Rejected') => {
    setFinalDecision(decision);
    if (decision === 'Approved') {
      setAppStatus('Review'); // Переводим в финальную стадию для договора
    }
  };

  return (
    <div className="space-y-6">
      {/* Шапка заявки */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/applications')}
            className="rounded p-1 hover:bg-zinc-100 transition-colors"
            title="Назад"
          >
            <ArrowLeft className="h-5 w-5 text-zinc-500" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-zinc-950">Обработка кредитной заявки</h2>
            <div className="mt-1 flex flex-wrap gap-2 text-xs font-mono text-zinc-500">
              <span>Заявка ID: {id}</span>
              <span>|</span>
              <span>Клиент ID: CL-0891</span>
            </div>
          </div>
        </div>

        {/* Текущий этап на конвейере */}
        <span className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
          Этап конвейера: {appStatus === 'Created' ? 'Первичная обработка' : 'Принятие решения'}
        </span>
      </div>

      {/* Сетка рабочих модулей */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Левая колонка: Основная сводка по заявке */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-zinc-500" /> Сводка параметров кредита
            </h3>

            <div className="text-xs space-y-3">
              <div className="flex justify-between">
                <span className="text-zinc-500">Клиент:</span>
                <span className="font-semibold text-zinc-900">Абдуллаев Сардорбек</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Продукт:</span>
                <span className="font-semibold text-zinc-900">Микрозайм Экспресс</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Сумма кредита:</span>
                <span className="font-bold text-indigo-600">15 000 000 сум</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Срок погашения:</span>
                <span className="font-semibold text-zinc-900">12 месяцев</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Процентная ставка:</span>
                <span className="font-semibold text-zinc-900">24% годовых</span>
              </div>
            </div>
          </div>
        </div>

        {/* НОВЫЙ БЛОК: Кнопка перехода к договору при одобрении */}
        {finalDecision === 'Approved' && (
          <button
            onClick={() => router.push(`/applications/${id}/contract`)}
            className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-green-500 transition-colors"
          >
            <Landmark className="h-4 w-4" /> Оформить договор и график
          </button>
        )}

        {/* Правая колонка: Интеграционные модули проверок */}
        <div className="lg:col-span-2 space-y-6">
          {/* Модуль 1: КАТМ шлюз */}
          <KatmVerification
            clientId="CL-0891"
            clientName="Абдуллаев Сардорбек Рустамович"
            pinfl="31204953940129"
            onVerificationComplete={handleKatmVerificationComplete}
          />
          {/* НОВЫЙ БЛОК: Модуль 2: Проверка долговой нагрузки DBR */}
          <DebtBurdenCheck
            clientIncome={12000000}          // Имитируем доход 12 млн сум
            newMonthlyPayment={1500000}      // Имитируем новый ежемесячный платеж 1.5 млн сум
            onValidationComplete={handleDbrComplete}
          />
          {/* НОВЫЙ БЛОК: Модуль 3: Экран кредитного решения Underwriting */}
          <DecisionBoard
            katmStatus={katmResult}
            dbrPassed={dbrPassed}
            dbrRatio={currentDbr}
            proposedAmount={15000000}
            proposedTerm={12}
            onDecisionFinalized={handleFinalDecisionComplete}
          />
          {/* НОВЫЙ БЛОК: Модуль 4: Работа с залогом (Collateral) */}
          <CollateralForm />
          {/* НОВЫЙ БЛОК: Модуль 5: Оформление партнерской рассрочки Nasiya */}
          <NasiyaPartnerForm />

        </div>
          <IntegrationLogs />
      </div>
    </div>
  );
}
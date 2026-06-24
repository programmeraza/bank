'use client';

import React, { useState, useEffect } from 'react';
import { Award, Ban, HelpCircle, Send, Check, AlertOctagon } from 'lucide-react';
import toast from 'react-hot-toast';

interface DecisionBoardProps {
  katmStatus: 'Success' | 'Rejected' | 'Error' | 'Manual_Review' | null;
  dbrPassed: boolean;
  dbrRatio: number;
  proposedAmount: number;
  proposedTerm: number;
  onDecisionFinalized?: (status: 'Approved' | 'Rejected') => void;
}

export default function DecisionBoard({
  katmStatus,
  dbrPassed,
  dbrRatio,
  proposedAmount,
  proposedTerm,
  onDecisionFinalized,
}: DecisionBoardProps) {
  // Вычисляемое системное решение на основе проверок КАТМ и DBR
  const [systemDecision, setSystemDecision] = useState<'Approved' | 'Rejected' | 'Manual_Review'>('Manual_Review');
  const [rejectCode, setRejectCode] = useState<string>('');
  const [rejectReason, setRejectReason] = useState<string>('');
  
  // Вводимые сотрудником данные при ручном решении
  const [underwriterComment, setComment] = useState('');
  const [approvedAmount, setApprovedAmount] = useState(proposedAmount);
  const [approvedTerm, setApprovedTerm] = useState(proposedTerm);

  useEffect(() => {
    // 1. Сценарий Авто-Отказа (KATM отклонен или долговая нагрузка > 70%)
    if (katmStatus === 'Rejected' || !dbrPassed) {
      setSystemDecision('Rejected');
      if (katmStatus === 'Rejected') {
        setRejectCode('ERR-KATM-450');
        setRejectReason('Отрицательное решение КАТМ (плохая кредитная история).');
      } else {
        setRejectCode('ERR-DBR-HIGH');
        setRejectReason(`Критический показатель долговой нагрузки (${dbrRatio}%). Лимит превышен.`);
      }
    } 
    // 2. Сценарий Ручного Разбора (KATM требует проверки или DBR в зоне риска 50-70%)
    else if (katmStatus === 'Manual_Review' || (dbrRatio > 50 && dbrRatio <= 70) || !katmStatus) {
      setSystemDecision('Manual_Review');
    } 
    // 3. Сценарий Одобрения
    else {
      setSystemDecision('Approved');
    }
  }, [katmStatus, dbrPassed, dbrRatio]);

  const handleFinalize = (decision: 'Approved' | 'Rejected') => {
    if (systemDecision === 'Manual_Review' && !underwriterComment.trim()) {
      toast.error('При ручном разборе комментарий андеррайтера обязателен');
      return;
    }

    if (onDecisionFinalized) {
      onDecisionFinalized(decision);
    }
    
    if (decision === 'Approved') {
      toast.success('Заявка одобрена кредитным комитетом');
    } else {
      toast.error('По заявке вынесен окончательный отказ');
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-6">
      {/* Шапка */}
      <div className="border-b pb-3 flex justify-between items-center">
        <h4 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
          <Award className="h-4 w-4 text-indigo-500" /> Решение кредитного комитета (Underwriting)
        </h4>
        <span className="text-xs text-zinc-500">Комплаенс скоринг</span>
      </div>

      {/* Отображение авто-вердикта */}
      <div className="space-y-4">
        <span className="text-xs text-zinc-500">Системное авто-решение:</span>
        
        {/* КЕЙС 1: АВТО-ОТКЛОНЕНО */}
        {systemDecision === 'Rejected' && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 space-y-3">
            <div className="flex items-center gap-2 font-bold text-red-800 text-sm">
              <Ban className="h-5 w-5" /> ОТКЛОНЕНО СИСТЕМОЙ (Auto-Reject)
            </div>
            <div className="text-xs text-red-700 space-y-1.5 font-medium">
              <div>Код ошибки: <span className="font-mono bg-red-100 px-1 py-0.5 rounded">{rejectCode}</span></div>
              <div>Причина: {rejectReason}</div>
              <div>Дата решения: {new Date().toLocaleDateString('ru-RU')}</div>
            </div>
            <button
              onClick={() => handleFinalize('Rejected')}
              className="w-full mt-2 rounded bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
            >
              Подтвердить отказ и закрыть заявку
            </button>
          </div>
        )}

        {/* КЕЙС 2: РУЧНОЙ АНАЛИЗ */}
        {systemDecision === 'Manual_Review' && (
          <div className="rounded-md border border-amber-200 bg-amber-50/50 p-4 space-y-4">
            <div className="flex items-center gap-2 font-bold text-amber-800 text-sm">
              <HelpCircle className="h-5 w-5" /> ТРЕБУЕТСЯ РУЧНОЙ РАЗБОР (Manual Review)
            </div>
            <p className="text-xs text-amber-700">
              Система не смогла вынести автоматическое решение. Измените параметры кредита (при необходимости) и примите решение вручную.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700">Одобрить сумму (сум)</label>
                <input
                  type="number"
                  value={approvedAmount}
                  onChange={(e) => setApprovedAmount(Number(e.target.value))}
                  className="mt-1 block w-full rounded border border-zinc-300 px-3 py-1.5 focus:border-indigo-500 focus:outline-none bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-700">Одобрить срок (мес)</label>
                <input
                  type="number"
                  value={approvedTerm}
                  onChange={(e) => setApprovedTerm(Number(e.target.value))}
                  className="mt-1 block w-full rounded border border-zinc-300 px-3 py-1.5 focus:border-indigo-500 focus:outline-none bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700">Обоснование андеррайтера (обязательно)</label>
              <textarea
                value={underwriterComment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Укажите аргументы принятия решения по повышенному риску..."
                className="mt-1 block w-full rounded border border-zinc-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none h-16 resize-none bg-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleFinalize('Rejected')}
                className="flex-1 rounded border border-red-300 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                Отклонить
              </button>
              <button
                onClick={() => handleFinalize('Approved')}
                className="flex-1 rounded bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                Одобрить заявку
              </button>
            </div>
          </div>
        )}

        {/* КЕЙС 3: АВТО-ОДОБРЕНО */}
        {systemDecision === 'Approved' && (
          <div className="rounded-md border border-green-200 bg-green-50 p-4 space-y-3">
            <div className="flex items-center gap-2 font-bold text-green-800 text-sm">
              <Check className="h-5 w-5" /> ОДОБРЕНО СИСТЕМОЙ (Auto-Approve)
            </div>
            <div className="text-xs text-green-700 space-y-1.5 font-medium">
              <div>Одобренная сумма: <span className="font-bold">{approvedAmount.toLocaleString()} сум</span></div>
              <div>Срок кредитования: <span className="font-bold">{approvedTerm} мес.</span></div>
              <div>Ставка: <span className="font-bold">24% годовых</span></div>
            </div>
            <button
              onClick={() => handleFinalize('Approved')}
              className="w-full mt-2 rounded bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
            >
              Подтвердить одобрение и перейти к договору
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

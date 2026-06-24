'use client';

import React, { useState, useEffect } from 'react';
import { Percent, AlertTriangle, CheckCircle2, XCircle, Calculator } from 'lucide-react';
import toast from 'react-hot-toast';

interface DebtBurdenCheckProps {
  clientIncome: number;           // Доход клиента из анкеты
  newMonthlyPayment: number;      // Новый платеж по кредиту из калькулятора
  onValidationComplete?: (passed: boolean, dbr: number) => void;
}

export default function DebtBurdenCheck({
  clientIncome,
  newMonthlyPayment,
  onValidationComplete,
}: DebtBurdenCheckProps) {
  // Интерактивные стейты для симуляции и ручной регулировки (для тестов)
  const [income, setIncome] = useState<number>(clientIncome);
  const [existingDebts, setExistingDebts] = useState<number>(2500000); // Текущие платежи клиента по базам КАТМ

  // Вычисляемые параметры DBR
  const [totalDebts, setTotalDebts] = useState<number>(0);
  const [dbr, setDbr] = useState<number>(0);

  useEffect(() => {
    const total = existingDebts + newMonthlyPayment;
    const ratio = income > 0 ? (total / income) * 100 : 0;
    
    setTotalDebts(total);
    setDbr(Number(ratio.toFixed(1)));

    // Передаем результаты наверх (заявка считается допустимой, если нагрузка <= 70%)
    if (onValidationComplete) {
      onValidationComplete(ratio <= 70, Number(ratio.toFixed(1)));
    }
  }, [income, existingDebts, newMonthlyPayment, onValidationComplete]);

  // Стилизация карточки решения на основе DBR
  const getDbrBadgeStyle = (ratio: number) => {
    if (ratio <= 50) {
      return {
        bg: 'bg-green-50 border-green-200 text-green-800',
        text: 'Риск-нагрузка в норме (Допустимо)',
        icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
      };
    }
    if (ratio > 50 && ratio <= 70) {
      return {
        bg: 'bg-amber-50 border-amber-200 text-amber-800',
        text: 'Предупреждение: Повышенный риск (Требуется анализ)',
        icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
      };
    }
    return {
      bg: 'bg-red-50 border-red-200 text-red-800',
      text: 'Критический уровень! Автоматический отказ (Reject)',
      icon: <XCircle className="h-5 w-5 text-red-600" />,
    };
  };

  const statusStyle = getDbrBadgeStyle(dbr);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
      {/* Шапка */}
      <div className="flex items-center justify-between border-b pb-3">
        <h4 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
          <Calculator className="h-4 w-4 text-indigo-500" /> Анализ долговой нагрузки (Debt Burden Ratio)
        </h4>
        <span className="text-xs text-zinc-500">Порог отсечки: 70%</span>
      </div>

      {/* Оценка DBR */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Инпут Доходов */}
        <div>
          <label className="block text-[11px] font-semibold text-zinc-500">Чистый доход клиента (сум)</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="mt-1 block w-full rounded border border-zinc-300 px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Инпут Существующих кредитов */}
        <div>
          <label className="block text-[11px] font-semibold text-zinc-500">Текущие кредиты КАТМ (сум/мес)</label>
          <input
            type="number"
            value={existingDebts}
            onChange={(e) => setExistingDebts(Number(e.target.value))}
            className="mt-1 block w-full rounded border border-zinc-300 px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Нагрузка нового кредита */}
        <div>
          <label className="block text-[11px] font-semibold text-zinc-500">Платеж по новой заявке (сум/мес)</label>
          <div className="mt-2.5 text-xs font-bold text-zinc-800">
            {newMonthlyPayment.toLocaleString()} сум
          </div>
        </div>
      </div>

      {/* Шкала уровня DBR */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-semibold text-zinc-700">
          <span>Показатель DBR</span>
          <span className="text-indigo-600 font-bold">{dbr}%</span>
        </div>
        
        {/* Прогресс-бар DBR */}
        <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden border">
          <div
            className={`h-full transition-all duration-300 ${
              dbr <= 50 ? 'bg-green-500' : dbr <= 70 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${dbr > 100 ? 100 : dbr}%` }}
          />
        </div>
      </div>

      {/* Системный вердикт комплаенса */}
      <div className={`rounded-md border p-4 text-xs flex items-start gap-2.5 ${statusStyle.bg}`}>
        <div className="shrink-0 mt-0.5">{statusStyle.icon}</div>
        <div className="space-y-1">
          <span className="font-bold block">{statusStyle.text}</span>
          <p className="text-zinc-600">
            Общий ежемесячный расход на погашение обязательств: <span className="font-semibold">{totalDebts.toLocaleString()} сум</span> при подтвержденном доходе <span className="font-semibold">{income.toLocaleString()} сум</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
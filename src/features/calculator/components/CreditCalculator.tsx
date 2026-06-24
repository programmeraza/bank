'use client';

import React, { useState, useEffect } from 'react';
import { LoanProduct } from '@/features/applications/types';

interface CreditCalculatorProps {
  product: LoanProduct;
  onCalculationChange?: (data: {
    amount: number;
    term: number;
    downPayment: number;
    monthlyPayment: number;
    overpayment: number;
    totalPayout: number;
    psk: number;
  }) => void;
}

export default function CreditCalculator({
  product,
  onCalculationChange,
}: CreditCalculatorProps) {
  // Параметры калькулятора
  const [amount, setAmount] = useState<number>(product.minAmount);
  const [term, setTerm] = useState<number>(product.term);
  const [downPayment, setDownPayment] = useState<number>(0);

  // Результаты расчета
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [overpayment, setOverpayment] = useState<number>(0);
  const [totalPayout, setTotalPayout] = useState<number>(0);
  const [psk, setPsk] = useState<number>(0);

  // Сброс параметров при смене продукта
  useEffect(() => {
    setAmount(product.minAmount);
    setTerm(product.term);
    setDownPayment(0);
  }, [product]);

  // Мгновенный пересчет параметров кредита
  useEffect(() => {
    const principal = amount - downPayment;
    
    if (principal <= 0 || term <= 0) {
      setMonthlyPayment(0);
      setOverpayment(0);
      setTotalPayout(0);
      setPsk(0);
      return;
    }

    // Месячная процентная ставка
    const monthlyRate = product.rate / 12 / 100;

    // Формула аннуитетного платежа: PMT = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    let payment = 0;
    if (monthlyRate === 0) {
      payment = principal / term;
    } else {
      payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    }

    const total = payment * term;
    const over = total - principal;

    // Расчет ПСК (Полной стоимости кредита) по упрощенной банковской формуле с учетом комиссии
    const commissionCost = amount * (product.commission / 100);
    const totalWithCommission = total + commissionCost;
    const pskValue = (((totalWithCommission - principal) / principal) / (term / 12)) * 100;

    setMonthlyPayment(Math.round(payment));
    setOverpayment(Math.round(over));
    setTotalPayout(Math.round(totalWithCommission));
    setPsk(Number(pskValue.toFixed(2)));

    // Передаем результаты наверх в родительский компонент-мастер
    if (onCalculationChange) {
      onCalculationChange({
        amount,
        term,
        downPayment,
        monthlyPayment: Math.round(payment),
        overpayment: Math.round(over),
        totalPayout: Math.round(totalWithCommission),
        psk: Number(pskValue.toFixed(2)),
      });
    }
  }, [amount, term, downPayment, product, onCalculationChange]);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      {/* Левая колонка: Настройка параметров (Ползунки и Инпуты) */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-zinc-900 border-b pb-2">Параметры кредита</h4>

        {/* 1. Настройка суммы */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-zinc-700">
            <span>Сумма кредита (сум)</span>
            <span className="text-indigo-600 font-bold">{amount.toLocaleString()} сум</span>
          </div>
          <input
            type="range"
            min={product.minAmount}
            max={product.maxAmount}
            step={500000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
            <span>Мин: {product.minAmount.toLocaleString()}</span>
            <span>Макс: {product.maxAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* 2. Настройка первоначального взноса */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700">Первоначальный взнос (сум)</label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => {
              const val = Number(e.target.value);
              // Первоначальный взнос не может превышать сумму кредита
              setDownPayment(val > amount ? amount : val);
            }}
            className="mt-1.5 block w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
            placeholder="0"
          />
        </div>

        {/* 3. Настройка срока */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-zinc-700">
            <span>Срок кредитования (месяцев)</span>
            <span className="text-indigo-600 font-bold">{term} мес.</span>
          </div>
          <input
            type="range"
            min={3}
            max={product.term}
            step={3}
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
            <span>Мин: 3 мес.</span>
            <span>Макс: {product.term} мес.</span>
          </div>
        </div>
      </div>

      {/* Правая колонка: Результаты расчетов (Сводная финансовая панель) */}
      <div className="rounded-lg bg-zinc-50 p-6 border border-zinc-150 flex flex-col justify-between">
        <h4 className="text-sm font-semibold text-zinc-900 border-b pb-2 mb-4">Предварительный расчет выплат</h4>

        <div className="space-y-4 flex-1">
          {/* Ежемесячный платеж */}
          <div className="flex justify-between items-baseline border-b border-dashed border-zinc-200 pb-2">
            <span className="text-xs text-zinc-500">Ежемесячный платеж:</span>
            <span className="text-xl font-bold text-zinc-950">{monthlyPayment.toLocaleString()} сум/мес</span>
          </div>

          {/* Общая сумма ПСК */}
          <div className="flex justify-between items-baseline border-b border-dashed border-zinc-200 pb-2">
            <span className="text-xs text-zinc-500">ПСК (Полная стоимость):</span>
            <span className="text-sm font-bold text-indigo-600">{psk}% годовых</span>
          </div>

          {/* Начисленные проценты / переплата */}
          <div className="flex justify-between items-baseline border-b border-dashed border-zinc-200 pb-2">
            <span className="text-xs text-zinc-500">Переплата за весь срок:</span>
            <span className="text-xs font-semibold text-zinc-700">{overpayment.toLocaleString()} сум</span>
          </div>

          {/* Ставка продукта */}
          <div className="flex justify-between items-baseline border-b border-dashed border-zinc-200 pb-2">
            <span className="text-xs text-zinc-500">Процентная ставка:</span>
            <span className="text-xs font-semibold text-zinc-700">{product.rate}%</span>
          </div>

          {/* Итого к возврату с комиссией */}
          <div className="flex justify-between items-baseline pb-2">
            <span className="text-xs text-zinc-500">Всего к возврату (с комиссией):</span>
            <span className="text-sm font-bold text-zinc-800">{totalPayout.toLocaleString()} сум</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-200 text-[10px] text-zinc-400">
          *Данный расчет является предварительным и формируется на основе базовой аннуитетной ставки без учета индивидуальной кредитной истории.
        </div>
      </div>
    </div>
  );
}
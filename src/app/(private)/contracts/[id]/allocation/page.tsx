'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Calculator, Coins, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Импорты UI Kit (сохраняя верстку)
import PageTransition from '@/shared/ui/PageTransition';
import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button';

export default function PaymentAllocationPage() {
  const router = useRouter();
  const { id } = useParams();

  const [paymentAmount, setPaymentAmount] = useState<number>(2500000);

  const calculateAllocation = (totalAmount: number) => {
    let remaining = totalAmount;
    const penaltyFee = Math.min(remaining, 150000);
    remaining -= penaltyFee;
    const overdueInterest = Math.min(remaining, 450000);
    remaining -= overdueInterest;
    const overduePrincipal = Math.min(remaining, 1000000);
    remaining -= overduePrincipal;
    const plannedInterest = Math.min(remaining, 500000);
    remaining -= plannedInterest;
    const plannedPrincipal = Math.max(0, remaining);

    return {
      penaltyFee,
      overdueInterest,
      overduePrincipal,
      plannedInterest,
      plannedPrincipal,
    };
  };

  const allocation = calculateAllocation(paymentAmount);

  const handleConfirmPayment = () => {
    toast.success(`Платеж на сумму ${paymentAmount.toLocaleString()} сум проведен.`);
    router.push(`/contracts/${id}`);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Шапка */}
        <div className="flex items-center gap-3 border-b pb-4">
          <button onClick={() => router.back()} className="rounded p-1 hover:bg-zinc-100 transition-colors">
            <ArrowLeft className="h-5 w-5 text-zinc-500" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-zinc-950">Симулятор распределения средств</h2>
            <p className="text-xs text-zinc-500">Предварительный расчет гашения задолженности по договору № {id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Левая колонка - ввод */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
              <Calculator className="h-4.5 w-4.5 text-indigo-500" /> Ввод суммы гашения
            </h3>

            {/* Используем наш Input */}
            <Input 
              label="Вносимая сумма (сум)" 
              type="number" 
              value={paymentAmount} 
              onChange={(e) => setPaymentAmount(Math.max(0, Number(e.target.value)))} 
            />

            <Button variant="primary" onClick={handleConfirmPayment} className="w-full">
              <CheckCircle2 className="h-4 w-4 mr-1.5" /> Провести платеж
            </Button>
          </div>

          {/* Правая колонка - таблица распределения */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm md:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
              <Coins className="h-4.5 w-4.5 text-indigo-500" /> Ведомость распределения платежа
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center border-b pb-2 border-dashed">
                <div>
                  <span className="font-bold text-zinc-800">1. Начислено пени и штрафов:</span>
                  <p className="text-[10px] text-zinc-400">Гасится в первую очередь</p>
                </div>
                <span className="font-bold text-red-600 font-mono">-{allocation.penaltyFee.toLocaleString()} сум</span>
              </div>

              <div className="flex justify-between items-center border-b pb-2 border-dashed">
                <div>
                  <span className="font-bold text-zinc-800">2. Просроченные проценты:</span>
                  <p className="text-[10px] text-zinc-400">Начисленные за период просрочки</p>
                </div>
                <span className="font-bold text-red-600 font-mono">-{allocation.overdueInterest.toLocaleString()} сум</span>
              </div>

              <div className="flex justify-between items-center border-b pb-2 border-dashed">
                <div>
                  <span className="font-bold text-zinc-800">3. Просроченный основной долг:</span>
                  <p className="text-[10px] text-zinc-400">Тело кредита в просрочке</p>
                </div>
                <span className="font-bold text-red-600 font-mono">-{allocation.overduePrincipal.toLocaleString()} сум</span>
              </div>

              <div className="flex justify-between items-center border-b pb-2 border-dashed">
                <div>
                  <span className="font-bold text-zinc-800">4. Текущие плановые проценты:</span>
                  <p className="text-[10px] text-zinc-400">Регулярные проценты по графику</p>
                </div>
                <span className="font-bold text-zinc-900 font-mono">-{allocation.plannedInterest.toLocaleString()} сум</span>
              </div>

              <div className="flex justify-between items-center pb-2">
                <div>
                  <span className="font-bold text-zinc-800">5. Текущий основной долг:</span>
                  <p className="text-[10px] text-zinc-400">Остаток суммы направляется на снижение тела кредита</p>
                </div>
                <span className="font-bold text-green-600 font-mono">-{allocation.plannedPrincipal.toLocaleString()} сум</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
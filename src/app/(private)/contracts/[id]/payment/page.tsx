'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentFormSchema, PaymentFormInput } from '@/features/payments/schemas/payment.schema';

export default function RegisterPaymentPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentFormSchema) as any,
    defaultValues: {
      amount: 1250000,
      date: new Date().toISOString().split('T')[0],
      type: 'Planned' as 'Planned' | 'Early' | 'Partial' | 'Full',
      comment: '',
    },
  });

  const selectedType = watch('type');

  // Логика автоматической корректировки сумм в зависимости от типа транзакции
  const handleTypeChange = (type: 'Planned' | 'Early' | 'Partial' | 'Full') => {
    setValue('type', type);
    if (type === 'Full') {
      setValue('amount', 8500000); // Закрытие всего остатка долга
    } else if (type === 'Planned') {
      setValue('amount', 1250000); // Стандартный аннуитет
    } else if (type === 'Partial') {
      setValue('amount', 5000000); // ИСПРАВЛЕНО: передаем два обязательных параметра
    }
  };

  const onSubmit = async (data: PaymentFormInput) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.log('Проведен платеж по заявке:', id, data);
      toast.success(`Платеж на сумму ${data.amount.toLocaleString()} сум проведен успешно!`);
      router.push(`/contracts`);
    } catch (e) {
      toast.error('Сбой проведения транзакции процессинга');
    } finally {
      setIsSubmitting(false);
    }
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
          <h2 className="text-xl font-bold text-zinc-950">Регистрация входящего платежа</h2>
          <p className="text-xs text-zinc-500">Зачисление денежных средств на кредитный счет по договору № {id}</p>
        </div>
      </div>

      {/* Форма проведения оплаты */}
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto space-y-6">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
            <CreditCard className="h-4.5 w-4.5 text-indigo-500" /> Проводка по счету зачисления
          </h3>

          {/* 1. Тип совершаемого платежа */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700">Тип платежного зачисления</label>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(['Planned', 'Partial', 'Early', 'Full'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTypeChange(t)}
                  className={`py-2 px-1 text-center rounded border text-xs font-semibold transition-all ${
                    selectedType === t
                      ? 'border-indigo-500 bg-indigo-50/30 text-indigo-600 font-bold'
                      : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                  }`}
                >
                  {t === 'Planned' && 'Плановый'}
                  {t === 'Partial' && 'Частичный'}
                  {t === 'Early' && 'Досрочный'}
                  {t === 'Full' && 'Полный досрочный'}
                </button>
              ))}
            </div>
            {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>}
          </div>

          {/* 2. Сумма платежа */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700">Вносимая сумма (сум)</label>
            <input
              {...register('amount')}
              disabled={isSubmitting || selectedType === 'Full'}
              type="number"
              className="mt-1.5 block w-full rounded border border-zinc-300 px-3 py-1.5 text-sm font-semibold focus:border-indigo-500 focus:outline-none disabled:bg-zinc-50"
              placeholder="1250000"
            />
            {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>}
          </div>

          {/* 3. Дата платежа */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700">Фактическая дата проведения</label>
            <div className="relative mt-1.5">
              <input
                {...register('date')}
                disabled={isSubmitting}
                type="date"
                className="block w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none disabled:bg-zinc-50"
              />
            </div>
            {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>}
          </div>

          {/* 4. Комментарий */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700">Основание платежа / Примечание</label>
            <textarea
              {...register('comment')}
              disabled={isSubmitting}
              className="mt-1.5 block w-full rounded border border-zinc-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none h-20 resize-none disabled:bg-zinc-50"
              placeholder="Внесение средств через терминал кассы..."
            />
            {errors.comment && <p className="mt-1 text-xs text-red-600">{errors.comment.message}</p>}
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => router.back()}
            className="rounded bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-200 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:bg-indigo-400"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Проведение по счетам...
              </>
            ) : (
              'Провести платеж'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
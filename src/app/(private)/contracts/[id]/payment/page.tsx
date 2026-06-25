'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentFormSchema, PaymentFormInput } from '@/features/payments/schemas/payment.schema';

// Импорты UI Kit (сохраняя форму и селекторы)
import PageTransition from '@/shared/ui/PageTransition';
import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button';

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

  const handleTypeChange = (type: 'Planned' | 'Early' | 'Partial' | 'Full') => {
    setValue('type', type);
    if (type === 'Full') {
      setValue('amount', 8500000);
    } else if (type === 'Planned') {
      setValue('amount', 1250000);
    } else if (type === 'Partial') {
      setValue('amount', 5000000);
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
    <PageTransition>
      <div className="space-y-6">
        {/* Шапка */}
        <div className="flex items-center gap-3 border-b pb-4">
          <button onClick={() => router.back()} className="rounded p-1 hover:bg-zinc-100 transition-colors">
            <ArrowLeft className="h-5 w-5 text-zinc-500" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-zinc-950">Регистрация входящего платежа</h2>
            <p className="text-xs text-zinc-500">Зачисление денежных средств на кредитный счет по договору № {id}</p>
          </div>
        </div>

        {/* Форма проведения оплаты в оригинальном виде */}
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto space-y-6">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
              <CreditCard className="h-4.5 w-4.5 text-indigo-500" /> Проводка по счету зачисления
            </h3>

            {/* Тип совершенного платежа */}
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

            {/* Поля ввода заменены на Floating Label Input */}
            <Input label="Вносимая сумма (сум)" type="number" disabled={selectedType === 'Full'} {...register('amount')} error={errors.amount?.message} />
            <Input label="Фактическая дата проведения" type="date" {...register('date')} error={errors.date?.message} />

            {/* Оставляем комментарий в исходном виде */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700">Основание платежа / Примечание</label>
              <textarea
                {...register('comment')}
                disabled={isSubmitting}
                className="mt-1.5 block w-full rounded border border-zinc-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none h-20 resize-none disabled:bg-zinc-50 bg-white"
                placeholder="Внесение средств через терминал кассы..."
              />
              {errors.comment && <p className="mt-1 text-xs text-red-600">{errors.comment.message}</p>}
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button variant="secondary" type="button" onClick={() => router.back()}>Отмена</Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>Провести платеж</Button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}
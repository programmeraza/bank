'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { clientFormSchema, ClientFormInput } from '@/features/clients/validation/client.schema';

// Импорты UI Kit (сохраняя структуру HTML в неприкосновенности)
import PageTransition from '@/shared/ui/PageTransition';
import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button';

export default function CreateClientPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clientFormSchema) as any,
    defaultValues: {
      name: '',
      birthDate: '',
      pinfl: '',
      passport: '',
      phone: '+998',
      email: '',
      citizenship: 'Узбекистан',
      country: 'Узбекистан',
      region: '',
      city: '',
      address: '',
      jobTitle: '',
      income: 0,
    },
  });

  const onSubmit = async (data: ClientFormInput) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Создан профиль клиента:', data);
      toast.success('Профиль клиента успешно зарегистрирован');
      router.push('/clients');
    } catch (error) {
      toast.error('Ошибка сохранения данных');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Шапка формы */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="rounded p-1 hover:bg-zinc-100 transition-colors"
              title="Назад"
            >
              <ArrowLeft className="h-5 w-5 text-zinc-500" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-zinc-950">Регистрация нового клиента</h2>
              <p className="text-xs text-zinc-500">Заполните анкетные данные для прохождения первичного комплаенс-контроля.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Раздел 1: Личные данные (Изначальная верстка) */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 mb-4">
              1. Основные идентификационные данные
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Input label="ФИО клиента (полностью)" {...register('name')} error={errors.name?.message} />
              <Input label="Номер телефона" {...register('phone')} error={errors.phone?.message} />
              <Input label="Электронная почта" type="email" {...register('email')} error={errors.email?.message} />
              <Input label="Дата рождения" type="date" {...register('birthDate')} error={errors.birthDate?.message} />
              <Input label="ПИНФЛ (14 цифр)" maxLength={14} {...register('pinfl')} error={errors.pinfl?.message} />
              <Input label="Паспортные данные (Серия, номер)" maxLength={9} {...register('passport')} error={errors.passport?.message} />
              <Input label="Гражданство" {...register('citizenship')} error={errors.citizenship?.message} />
            </div>
          </div>

          {/* Раздел 2: Адресные данные (Изначальная верстка) */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 mb-4">
              2. Адрес постоянной регистрации
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <Input label="Страна проживания" {...register('country')} error={errors.country?.message} />
              <Input label="Область / Регион" {...register('region')} error={errors.region?.message} />
              <Input label="Город / Район" {...register('city')} error={errors.city?.message} />
              <Input label="Улица, дом, квартира" {...register('address')} error={errors.address?.message} />
            </div>
          </div>

          {/* Раздел 3: Сведения о доходах (Изначальная верстка) */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 mb-4">
              3. Финансовое состояние и занятость
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input label="Должность / Род деятельности" {...register('jobTitle')} error={errors.jobTitle?.message} />
              <Input label="Ежемесячный доход (сум)" type="number" {...register('income', { valueAsNumber: true })} error={errors.income?.message} />
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button variant="secondary" type="button" onClick={() => router.push('/clients')}>
              Отмена
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              <Save className="h-4 w-4 mr-1.5" /> Зарегистрировать клиента
            </Button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}
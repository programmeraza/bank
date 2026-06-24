'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { clientFormSchema, ClientFormInput } from '@/features/clients/validation/client.schema';

export default function CreateClientPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        // Приводим резолвер к типу any, чтобы обойти конфликт версий пакетов в node_modules
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

    // 2. В функции onSubmit мы по-прежнему строго типизируем получаемые данные
    const onSubmit = async (data: ClientFormInput) => {
        setIsSubmitting(true);
        try {
            // Имитация задержки отправки данных на сервер
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
                {/* Раздел 1: Личные данные */}
                <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 mb-4">
                        1. Основные идентификационные данные
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* ФИО */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-700">ФИО клиента (полностью)</label>
                            <input
                                {...register('name')}
                                disabled={isSubmitting}
                                type="text"
                                className="mt-1 block w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none disabled:bg-zinc-50"
                                placeholder="Иванов Иван Иванович"
                            />
                            {errors.name && <p className="mt-1 text-[11px] text-red-600">{errors.name.message}</p>}
                        </div>

                        {/* Телефон */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-700">Номер телефона</label>
                            <input
                                {...register('phone')}
                                disabled={isSubmitting}
                                type="text"
                                className="mt-1 block w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none disabled:bg-zinc-50"
                                placeholder="+998901234567"
                            />
                            {errors.phone && <p className="mt-1 text-[11px] text-red-600">{errors.phone.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-700">Электронная почта</label>
                            <input
                                {...register('email')}
                                disabled={isSubmitting}
                                type="email"
                                className="mt-1 block w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none disabled:bg-zinc-50"
                                placeholder="client@mail.uz"
                            />
                            {errors.email && <p className="mt-1 text-[11px] text-red-600">{errors.email.message}</p>}
                        </div>

                        {/* Дата рождения */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-700">Дата рождения</label>
                            <input
                                {...register('birthDate')}
                                disabled={isSubmitting}
                                type="date"
                                className="mt-1 block w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none disabled:bg-zinc-50"
                            />
                            {errors.birthDate && <p className="mt-1 text-[11px] text-red-600">{errors.birthDate.message}</p>}
                        </div>

                        {/* ПИНФЛ */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-700">ПИНФЛ (14 цифр)</label>
                            <input
                                {...register('pinfl')}
                                disabled={isSubmitting}
                                type="text"
                                maxLength={14}
                                className="mt-1 block w-full rounded border border-zinc-300 px-3 py-1.5 text-sm font-mono focus:border-indigo-500 focus:outline-none disabled:bg-zinc-50"
                                placeholder="31204953940129"
                            />
                            {errors.pinfl && <p className="mt-1 text-[11px] text-red-600">{errors.pinfl.message}</p>}
                        </div>

                        {/* Серия и номер паспорта */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-700">Паспортные данные (Серия, номер)</label>
                            <input
                                {...register('passport')}
                                disabled={isSubmitting}
                                type="text"
                                maxLength={9}
                                className="mt-1 block w-full rounded border border-zinc-300 px-3 py-1.5 text-sm font-mono focus:border-indigo-500 focus:outline-none disabled:bg-zinc-50"
                                placeholder="AA1234567"
                            />
                            {errors.passport && <p className="mt-1 text-[11px] text-red-600">{errors.passport.message}</p>}
                        </div>

                        {/* Гражданство */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-700">Гражданство</label>
                            <input
                                {...register('citizenship')}
                                disabled={isSubmitting}
                                type="text"
                                className="mt-1 block w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none disabled:bg-zinc-50"
                                placeholder="Узбекистан"
                            />
                            {errors.citizenship && <p className="mt-1 text-[11px] text-red-600">{errors.citizenship.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Раздел 2: Адресные данные */}
                <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 mb-4">
                        2. Адрес постоянной регистрации
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                        {/* Страна */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-700">Страна проживания</label>
                            <input
                                {...register('country')}
                                disabled={isSubmitting}
                                type="text"
                                className="mt-1 block w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none disabled:bg-zinc-50"
                            />
                            {errors.country && <p className="mt-1 text-[11px] text-red-600">{errors.country.message}</p>}
                        </div>

                        {/* Область */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-700">Область / Регион</label>
                            <input
                                {...register('region')}
                                disabled={isSubmitting}
                                type="text"
                                className="mt-1 block w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none disabled:bg-zinc-50"
                                placeholder="Ташкентская область"
                            />
                            {errors.region && <p className="mt-1 text-[11px] text-red-600">{errors.region.message}</p>}
                        </div>

                        {/* Город */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-700">Город / Район</label>
                            <input
                                {...register('city')}
                                disabled={isSubmitting}
                                type="text"
                                className="mt-1 block w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none disabled:bg-zinc-50"
                                placeholder="г. Ташкент"
                            />
                            {errors.city && <p className="mt-1 text-[11px] text-red-600">{errors.city.message}</p>}
                        </div>

                        {/* Улица/Дом */}
                        <div className="col-span-1 md:col-span-1">
                            <label className="block text-xs font-semibold text-zinc-700">Улица, дом, квартира</label>
                            <input
                                {...register('address')}
                                disabled={isSubmitting}
                                type="text"
                                className="mt-1 block w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none disabled:bg-zinc-50"
                                placeholder="ул. Амира Темура, д. 45, кв. 12"
                            />
                            {errors.address && <p className="mt-1 text-[11px] text-red-600">{errors.address.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Раздел 3: Сведения о доходах и работе */}
                <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 mb-4">
                        3. Финансовое состояние и занятость
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Должность / Сфера занятости */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-700">Должность / Род деятельности</label>
                            <input
                                {...register('jobTitle')}
                                disabled={isSubmitting}
                                type="text"
                                className="mt-1 block w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none disabled:bg-zinc-50"
                                placeholder="Инженер автоматизации производства"
                            />
                            {errors.jobTitle && <p className="mt-1 text-[11px] text-red-600">{errors.jobTitle.message}</p>}
                        </div>

                        {/* Доход */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-700">Ежемесячный доход (сум)</label>
                            <input
                                {...register('income', { valueAsNumber: true })} // <-- Добавили valueAsNumber
                                disabled={isSubmitting}
                                type="number"
                                className="mt-1 block w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none disabled:bg-zinc-50"
                                placeholder="8000000"
                            />
                            {errors.income && <p className="mt-1 text-[11px] text-red-600">{errors.income.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Кнопки действий */}
                <div className="flex justify-end gap-3 border-t pt-4">
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => router.push('/clients')}
                        className="rounded bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-200 transition-colors disabled:opacity-50"
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
                                Сохранение...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Зарегистрировать клиента
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
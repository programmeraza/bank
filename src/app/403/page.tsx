'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6 text-center">
      <div className="max-w-md space-y-6">
        {/* Иконка предупреждения */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldX className="h-10 w-10" />
        </div>

        {/* Информационный блок */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight sm:text-4xl">
            Доступ ограничен
          </h1>
          <p className="text-sm text-zinc-500">
            Код ошибки: 403 Forbidden. У вашего аккаунта недостаточно прав для просмотра содержимого этой страницы.
          </p>
        </div>

        {/* Кнопки действий */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Назад
          </button>
          
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            <Home className="h-4 w-4" /> На главную
          </button>
        </div>
      </div>
    </div>
  );
}
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6 text-center">
      <div className="max-w-md space-y-6">
        {/* Иконка отсутствия страницы */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
          <FileQuestion className="h-10 w-10" />
        </div>

        {/* Текстовое описание */}
        <div className="space-y-2">
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">Ошибка 404</span>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight sm:text-4xl">
            Страница не найдена
          </h1>
          <p className="text-sm text-zinc-500">
            К сожалению, запрашиваемый адрес недоступен, был удален или никогда не существовал. Проверьте правильность URL.
          </p>
        </div>

        {/* Действия */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors focus:outline-none"
          >
            <ArrowLeft className="h-4 w-4" /> Назад
          </button>
          
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 transition-colors focus:outline-none"
          >
            <Home className="h-4 w-4" /> На главную
          </button>
        </div>
      </div>
    </div>
  );
}
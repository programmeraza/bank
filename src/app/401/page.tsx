'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, LogIn } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6 text-center">
      <div className="max-w-md space-y-6">
        {/* Иконка авторизации */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <KeyRound className="h-10 w-10" />
        </div>

        {/* Сообщение */}
        <div className="space-y-2">
          <span className="text-xs font-bold tracking-widest text-amber-600 uppercase">Ошибка 401</span>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight sm:text-3xl">
            Сессия авторизации истекла
          </h1>
          <p className="text-sm text-zinc-500">
            Для продолжения безопасной работы с платформой необходимо выполнить вход в учетную запись заново.
          </p>
        </div>

        {/* Действия */}
        <div className="flex justify-center">
          <button
            onClick={() => router.push('/login')}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors focus:outline-none"
          >
            <LogIn className="h-4 w-4" /> Перейти к авторизации
          </button>
        </div>
      </div>
    </div>
  );
}
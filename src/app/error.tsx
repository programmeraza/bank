'use client';

import React, { useEffect } from 'react';
import { ShieldAlert, RotateCcw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // В реальной системе здесь отправляются логи в Sentry, Logrocket или на собственный сервер
    console.error('Captured Runtime Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6 text-center">
      <div className="max-w-md space-y-6">
        {/* Иконка аварийного предупреждения */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldAlert className="h-10 w-10" />
        </div>

        {/* Сообщение */}
        <div className="space-y-2">
          <span className="text-xs font-bold tracking-widest text-red-600 uppercase">Ошибка 500</span>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight sm:text-3xl">
            Произошел сбой системы
          </h1>
          <p className="text-sm text-zinc-500">
            На стороне приложения возникла непредвиденная ошибка рендеринга. Мы уже работаем над устранением неполадки.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-zinc-400">ID события: {error.digest}</p>
          )}
        </div>

        {/* Действия */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors focus:outline-none"
          >
            <RotateCcw className="h-4 w-4" /> Повторить попытку
          </button>
          
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors focus:outline-none"
          >
            <Home className="h-4 w-4" /> На главную
          </button>
        </div>
      </div>
    </div>
  );
}
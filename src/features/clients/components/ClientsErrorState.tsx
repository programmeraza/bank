'use client';

import React from 'react';
import { WifiOff, RotateCcw } from 'lucide-react';

interface ClientsErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export default function ClientsErrorState({
  message = 'Не удалось загрузить список клиентов. Проверьте соединение с сервером.',
  onRetry,
}: ClientsErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-red-100 bg-red-50/30 p-12 text-center shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
        <WifiOff className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-zinc-900">Ошибка получения данных</h3>
      <p className="mt-1 text-xs text-zinc-500 max-w-sm">{message}</p>
      <div className="mt-6">
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Повторить попытку
        </button>
      </div>
    </div>
  );
}
import React from 'react';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white p-16 text-center shadow-sm">
      <PackageOpen className="mx-auto h-12 w-12 text-zinc-400" />
      <h3 className="mt-4 text-sm font-semibold text-zinc-900">Информационные данные отсутствуют</h3>
      <p className="mt-1 text-sm text-zinc-500">
        Системе не удалось обнаружить активную статистику для вывода на панель управления.
      </p>
      <div className="mt-6">
        <button
          onClick={onRefresh}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Загрузить повторно
        </button>
      </div>
    </div>
  );
}
import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function RolesPage() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center shadow-sm">
      <ShieldAlert className="mx-auto h-12 w-12 text-zinc-400" />
      <h3 className="mt-4 text-sm font-semibold text-zinc-900">Настройка ролей</h3>
      <p className="mt-1 text-sm text-zinc-500">
        Управление уровнями доступа и конфигурацией матрицы разрешений.
      </p>
    </div>
  );
}
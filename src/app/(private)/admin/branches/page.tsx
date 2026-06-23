import React from 'react';
import { MapPin } from 'lucide-react';

export default function BranchesPage() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center shadow-sm">
      <MapPin className="mx-auto h-12 w-12 text-zinc-400" />
      <h3 className="mt-4 text-sm font-semibold text-zinc-900">Настройка филиалов</h3>
      <p className="mt-1 text-sm text-zinc-500">
        Управление филиальной структурой, регионами присутствия и добавление подразделений.
      </p>
    </div>
  );
}
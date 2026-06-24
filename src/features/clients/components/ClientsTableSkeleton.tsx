'use client';

import React from 'react';

export default function ClientsTableSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Скелетон фильтров */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-9 rounded bg-zinc-200" />
        ))}
      </div>

      {/* Скелетон таблицы */}
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 bg-zinc-50 px-6 py-4">
          <div className="h-4 w-32 rounded bg-zinc-200" />
        </div>
        <div className="divide-y divide-zinc-200 px-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between py-6">
              <div className="space-y-2 w-1/4">
                <div className="h-4 w-3/4 rounded bg-zinc-200" />
                <div className="h-3 w-1/2 rounded bg-zinc-200" />
              </div>
              <div className="h-4 w-20 rounded bg-zinc-200" />
              <div className="h-4 w-28 rounded bg-zinc-200" />
              <div className="h-4 w-12 rounded bg-zinc-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
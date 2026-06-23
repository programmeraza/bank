import React from 'react';

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 4 Карточки Статистики */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-lg border border-zinc-200 bg-white p-6">
            <div className="h-4 w-1/3 rounded bg-zinc-200" />
            <div className="mt-4 h-8 w-1/2 rounded bg-zinc-200" />
          </div>
        ))}
      </div>

      {/* Основные виджеты */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-96 rounded-lg border border-zinc-200 bg-white p-6">
          <div className="h-5 w-1/4 rounded bg-zinc-200" />
          <div className="mt-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-zinc-200" />
                  <div className="h-3 w-20 rounded bg-zinc-200" />
                </div>
                <div className="h-6 w-12 rounded bg-zinc-200" />
              </div>
            ))}
          </div>
        </div>

        <div className="h-96 rounded-lg border border-zinc-200 bg-white p-6">
          <div className="h-5 w-1/4 rounded bg-zinc-200" />
          <div className="mt-6 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-zinc-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full rounded bg-zinc-200" />
                  <div className="h-3 w-1/2 rounded bg-zinc-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
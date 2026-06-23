'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Пользователи', href: '/admin/users' },
    { name: 'Журнал аудита', href: '/admin/audit' },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-6 text-zinc-900">Администрирование</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Управление правами доступа пользователей, филиалами и просмотр системных событий безопасности.
          </p>
        </div>
      </div>

      {/* Вкладки навигации администратора */}
      <div className="border-b border-zinc-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700'
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}
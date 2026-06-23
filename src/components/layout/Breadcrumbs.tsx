'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

// Словарь локализации путей для вывода понятных названий
const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'Панель управления',
  admin: 'Администрирование',
  users: 'Пользователи',
  audit: 'Журнал аудита',
  settings: 'Настройки',
  branches: 'Филиалы',
  roles: 'Роли',
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // Разбиваем путь и убираем пустые сегменты
  const pathSegments = pathname.split('/').filter((segment) => segment);

  if (pathSegments.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-zinc-500" aria-label="Breadcrumb">
      {/* Ссылка на главную / панель управления */}
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-zinc-800 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        
        // Строим накопительный путь для ссылки (например: /admin, затем /admin/users)
        const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
        
        // Получаем русское название из словаря или выводим исходный сегмент
        const label = ROUTE_LABELS[segment] || decodeURIComponent(segment);

        return (
          <React.Fragment key={href}>
            <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" />
            {isLast ? (
              <span className="font-semibold text-zinc-800 truncate" aria-current="page">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-zinc-800 transition-colors truncate"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
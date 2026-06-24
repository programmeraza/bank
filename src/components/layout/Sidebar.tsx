'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ShieldAlert, Settings, FolderTree, X } from 'lucide-react';
import { usePermission } from '@/features/auth/hooks/usePermission';
import { Permission } from '@/features/auth/types/rbac';

// 1. Описываем строгий интерфейс для пунктов меню
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: Permission; // Используем строго тип Permission, а не string
}

interface SidebarProps {
  onCloseMobile?: () => void;
}

export default function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { can } = usePermission();

  // 2. Явно указываем тип NavigationItem[] для массива меню
  const navigation: NavigationItem[] = [
    {
      name: 'Панель управления',
      href: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Пользователи',
      href: '/admin/users',
      icon: Users,
      permission: 'users:read' // Теперь TypeScript понимает, что это Permission
    },
    {
      name: 'Журнал аудита',
      href: '/admin/audit',
      icon: ShieldAlert,
      permission: 'audit:read'
    },
    {
      name: 'Настройки',
      href: '/settings',
      icon: Settings,
      permission: 'settings:write'
    },
    // Внутри Sidebar.tsx в массив navigation добавьте пункт:
    { name: 'База клиентов', 
      href: '/clients', 
      icon: Users, 
      permission: 'users:read' 
    },
  ];

  return (
    <aside className="flex h-full w-64 flex-col border-r border-zinc-200 bg-zinc-900 text-zinc-300">
      {/* Логотип + Кнопка Закрытия */}
      <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-6">
        <div className="flex items-center gap-2">
          <FolderTree className="h-6 w-6 text-indigo-400" />
          <span className="text-lg font-bold text-white tracking-wider">PLATFORM PRO</span>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white md:hidden"
            aria-label="Закрыть меню"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Навигация */}
      <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
        {navigation.map((item) => {
          // Теперь ошибки типизации не будет, так как типы строго совпадают
          if (item.permission && !can(item.permission)) return null;

          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
            >
              <item.icon
                className={`h-5 w-5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-zinc-400 group-hover:text-white'
                  }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800 p-4 text-center text-xs text-zinc-500">
        v1.0.0-beta
      </div>
    </aside>
  );
}
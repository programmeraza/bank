'use client';

import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import { useUIStore } from '@/features/settings/store/uiStore';
import NotificationsDrawer from '@/features/settings/components/NotificationsDrawer';
import Link from 'next/link';

interface HeaderProps {
  onLogout?: () => void;
  user?: { name: string; role: string };
}

export default function Header({ onLogout, user = { name: 'Иван Иванов', role: 'Администратор' } }: HeaderProps) {
  const { notifications, setNotificationOpen } = useUIStore();

  // Считаем количество непрочитанных алертов
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6 sticky top-0 z-30">
      <div className="flex items-center">
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-4">
        {/* Колокольчик уведомлений */}
        <button
          onClick={() => setNotificationOpen(true)}
          className="relative rounded-full p-2 text-zinc-500 hover:bg-zinc-100 transition-colors focus:outline-none"
          aria-label="Уведомления"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="h-8 w-px bg-zinc-200" />

        <Link href="/profile" className="flex items-center gap-3">
          <button className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-sm font-semibold text-zinc-700">{user.name}</span>
              <span className="text-xs text-zinc-500">{user.role}</span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
              <User className="h-5 w-5" />
            </div>
          </button>
        </Link>

        <button
          onClick={onLogout}
          className="rounded-full p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors focus:outline-none"
          title="Выйти"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>

      {/* Рендерим модальное окно уведомлений */}
      <NotificationsDrawer />
    </header>
  );
}
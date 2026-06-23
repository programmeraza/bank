'use client';

import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';

interface HeaderProps {
  onLogout?: () => void;
  user?: { name: string; role: string };
}

export default function Header({ onLogout, user = { name: 'Иван Иванов', role: 'Администратор' } }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6">
      {/* Левая часть: Динамические Хлебные крошки */}
      <div className="flex items-center">
        <Breadcrumbs />
      </div>

      {/* Правая часть: Уведомления и Профиль */}
      <div className="flex items-center gap-4">
        <button 
          className="relative rounded-full p-2 text-zinc-500 hover:bg-zinc-100 transition-colors"
          aria-label="Уведомления"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="h-8 w-px bg-zinc-200" />

        {/* Профиль пользователя */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium text-zinc-700">{user.name}</span>
            <span className="text-xs text-zinc-500">{user.role}</span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
            <User className="h-5 w-5" />
          </div>
        </div>

        <button
          onClick={onLogout}
          className="rounded-full p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          title="Выйти"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
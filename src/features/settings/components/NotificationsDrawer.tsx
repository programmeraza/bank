'use client';

import React from 'react';
import { X, Bell, Trash2, CheckCheck, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useUIStore } from '../store/uiStore';

export default function NotificationsDrawer() {
  const { 
    notifications, 
    isNotificationOpen, 
    setNotificationOpen, 
    markAllAsRead, 
    clearNotifications 
  } = useUIStore();

  if (!isNotificationOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Задний фон */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={() => setNotificationOpen(false)} 
      />

      {/* Панель Drawer */}
      <div className="relative w-full max-w-sm bg-white h-screen shadow-2xl flex flex-col justify-between animate-fade-in-up">
        {/* Шапка */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2 text-zinc-900 font-bold">
            <Bell className="h-5 w-5 text-indigo-600" />
            <span>Уведомления ({unreadCount})</span>
          </div>
          <button 
            onClick={() => setNotificationOpen(false)}
            className="rounded p-1 hover:bg-zinc-100 text-zinc-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Тело списка уведомлений */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-3.5 rounded-lg border text-xs space-y-1.5 transition-all ${
                  n.isRead ? 'bg-white border-zinc-200' : 'bg-indigo-50/30 border-indigo-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-800">
                    {n.type === 'error' && <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />}
                    {n.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />}
                    {n.type === 'info' && <Info className="h-4 w-4 text-blue-600 shrink-0" />}
                    <span>Системный алерт</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">{n.timestamp}</span>
                </div>
                <p className="text-zinc-600 leading-relaxed font-medium">{n.message}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-zinc-500">
              <Bell className="mx-auto h-12 w-12 text-zinc-300 mb-2" />
              <p className="text-sm font-semibold">Лента уведомлений пуста</p>
            </div>
          )}
        </div>

        {/* Подвал действий */}
        {notifications.length > 0 && (
          <div className="border-t p-4 bg-zinc-50 grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center justify-center gap-1.5 rounded border border-zinc-300 bg-white p-2.5 font-semibold text-zinc-700 hover:bg-zinc-100"
            >
              <CheckCheck className="h-4 w-4 text-green-600" /> Прочитать все
            </button>
            <button
              onClick={clearNotifications}
              className="inline-flex items-center justify-center gap-1.5 rounded border border-red-200 bg-red-50 p-2.5 font-semibold text-red-600 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" /> Очистить лог
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
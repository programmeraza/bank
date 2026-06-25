'use client';

import React, { useState, useEffect } from 'react';
import { Coins, Users, ShieldAlert, Cpu } from 'lucide-react';

// Импорты UI Kit (сохраняя старый макет страницы)
import PageTransition from '@/shared/ui/PageTransition';
import Card from '@/shared/ui/Card';
import CountUp from '@/shared/ui/CountUp';
import DashboardSkeleton from '@/features/dashboard/components/DashboardSkeleton';
import EmptyState from '@/features/dashboard/components/EmptyState';
import DevicesWidget from '@/features/dashboard/components/DevicesWidget';
import RecentEventsWidget from '@/features/dashboard/components/RecentEventsWidget';
import { StatItem, DeviceSummary, SystemEvent } from '@/features/dashboard/types';

const MOCK_STATS: StatItem[] = [
  { id: '1', name: 'Всего устройств', value: 1284, change: '+12%', changeType: 'increase' },
  { id: '2', name: 'Пользователей онлайн', value: 342, change: '+3.2%', changeType: 'increase' },
  { id: '3', name: 'Активные инциденты', value: 3, change: '-4', changeType: 'decrease' },
  { id: '4', name: 'Нагрузка на API', value: 94, change: 'Стабильно', changeType: 'neutral' },
];

const MOCK_DEVICES: DeviceSummary[] = [
  { id: '1', name: 'Контроллер КПП №1', location: 'Главный вход', status: 'online', lastSeen: 'Только что' },
  { id: '2', name: 'Сервер авторизации', location: 'Серверная А', status: 'online', lastSeen: 'Только что' },
  { id: '3', name: 'Камера СКУД Юг', location: 'Парковка', status: 'offline', lastSeen: '10 мин. назад' },
  { id: '4', name: 'Контроллер КПП №2', location: 'Служебный вход', status: 'maintenance', lastSeen: '1 час назад' },
];

const MOCK_EVENTS: SystemEvent[] = [
  { id: '1', timestamp: '10:45:23', category: 'security', message: 'Успешная авторизация пользователя admin', severity: 'low' },
  { id: '2', timestamp: '10:41:10', category: 'system', message: 'Потеря связи с устройством: Камера СКУД Юг', severity: 'high' },
  { id: '3', timestamp: '09:15:00', category: 'user', message: 'Оператор изменил права доступа для 3-х пользователей', severity: 'medium' },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setEmpty(false);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (empty) {
    return <EmptyState onRefresh={handleRefresh} />;
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Селекторы режима для демонстрации */}
        <div className="flex justify-end gap-2 rounded-lg bg-zinc-100 p-1.5 w-fit ml-auto text-xs">
          <button
            onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 800); }}
            className="px-3 py-1 rounded bg-white font-medium text-zinc-700 shadow-sm"
          >
            Имитировать загрузку
          </button>
          <button
            onClick={() => setEmpty(true)}
            className="px-3 py-1 rounded text-zinc-600 hover:text-zinc-900"
          >
            Пустое состояние
          </button>
        </div>

        {/* Сетка анимированных KPI карточек */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_STATS.map((stat) => (
            <Card key={stat.id}>
              <p className="text-sm font-medium text-zinc-500 truncate">{stat.name}</p>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-3xl font-semibold tracking-tight text-zinc-950">
                  {/* Анимируем только цифры, сохраняя структуру */}
                  <CountUp target={Number(stat.value)} />
                  {stat.id === '4' && '%'}
                </span>
                
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  stat.changeType === 'increase' ? 'bg-green-50 text-green-700' : 'bg-zinc-50 text-zinc-700'
                }`}>
                  {stat.change}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Нижние виджеты Спринта 1 в исходной сетке */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DevicesWidget devices={MOCK_DEVICES} />
          <RecentEventsWidget events={MOCK_EVENTS} />
        </div>
      </div>
    </PageTransition>
  );
}
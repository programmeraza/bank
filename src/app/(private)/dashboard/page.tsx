'use client';

import React, { useState, useEffect } from 'react';
import StatsCard from '../../../features/dashboard/components/StatsCard';
import DevicesWidget from '../../../features/dashboard/components/DevicesWidget';
import RecentEventsWidget from '../../../features/dashboard/components/RecentEventsWidget';
import DashboardSkeleton from '../../../features/dashboard/components/DashboardSkeleton';
import EmptyState from '../../../features/dashboard/components/EmptyState';
import { StatItem, DeviceSummary, SystemEvent } from '../../../features/dashboard/types';

// Mock-данные
const MOCK_STATS: StatItem[] = [
  { id: '1', name: 'Всего устройств', value: '1,284', change: '+12%', changeType: 'increase' },
  { id: '2', name: 'Пользователей онлайн', value: '342', change: '+3.2%', changeType: 'increase' },
  { id: '3', name: 'Активные инциденты', value: '3', change: '-4', changeType: 'decrease' },
  { id: '4', name: 'Нагрузка на API', value: '94.8%', change: 'Стабильно', changeType: 'neutral' },
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

  // Симуляция первоначальной загрузки данных
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setEmpty(false);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (empty) {
    return <EmptyState onRefresh={handleRefresh} />;
  }

  return (
    <div className="space-y-6">
      {/* Селекторы режима для демонстрации и тестирования верстки */}
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

      {/* Grid с карточками показателей */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_STATS.map((stat) => (
          <StatsCard key={stat.id} item={stat} />
        ))}
      </div>

      {/* Сетка виджетов нижнего уровня */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DevicesWidget devices={MOCK_DEVICES} />
        <RecentEventsWidget events={MOCK_EVENTS} />
      </div>
    </div>
  );
}
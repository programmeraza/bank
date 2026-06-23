'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Имитация проверки токена (полная интеграция будет на Этапе 4)
    const token = localStorage.getItem('accessToken') || 'mock-token'; // Временно разрешаем вход
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Боковое меню */}
      <Sidebar />

      {/* Основная рабочая область */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onLogout={handleLogout} />
        
        <main className="flex-1 overflow-y-auto bg-zinc-50 p-6 focus:outline-none">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
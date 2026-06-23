import React from 'react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-50">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Вход в систему</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Пожалуйста, введите данные вашей учетной записи
          </p>
        </div>
        {children}
      </div>
    </main>
  );
}
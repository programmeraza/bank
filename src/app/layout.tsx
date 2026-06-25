// src/app/layout.tsx
import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata = {
  title: 'ABU BANK - Система управления и комплаенса',
  description: 'Банковское рабочее пространство кредитного конвейера',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Убираем жесткий "bg-zinc-50" с тега html
    <html lang="ru" className="h-full">
      {/* Убираем жесткий "text-zinc-950" с тега body */}
      <body className={`${inter.className} h-full antialiased`}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
import React from 'react';
import './globals.css'; 
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata = {
  title: 'Базовая платформа',
  description: 'Панель управления и инфраструктура',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="h-full bg-zinc-50">
      <body className={`${inter.className} h-full text-zinc-950 antialiased`}>
        {children}
      </body>
    </html>
  );
}
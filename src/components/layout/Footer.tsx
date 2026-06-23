import React from 'react';

export default function Footer() {
  return (
    <footer className="flex h-12 items-center justify-between border-t border-zinc-200 bg-white px-6 text-xs text-zinc-500">
      <div>
        &copy; {new Date().getFullYear()} Базовая Платформа. Все права защищены.
      </div>
      <div className="flex gap-4">
        <a href="#" className="hover:underline">Поддержка</a>
        <a href="#" className="hover:underline">Документация</a>
      </div>
    </footer>
  );
}
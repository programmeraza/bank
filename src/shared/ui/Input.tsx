'use client';

import React, { useEffect, useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  // Безопасная генерация ID, устойчивая к SSR/Hydration сбоям
  const [inputId, setInputId] = useState<string>('');

  useEffect(() => {
    setInputId(`input-${Math.random().toString(36).slice(2, 9)}`);
  }, []);

  return (
    <div className="space-y-1 w-full" suppressHydrationWarning>
      <div className="relative">
        <input
          id={inputId}
          placeholder=" "
          suppressHydrationWarning // Предотвращает ошибки при автозаполнении паролей расширениями
          className={`peer block w-full rounded-md border bg-white px-3 pb-2.5 pt-5 text-sm text-zinc-950 focus:border-indigo-600 focus:outline-none focus:ring-0 transition-all ${
            error ? 'border-red-300 focus:border-red-500' : 'border-zinc-300 focus:border-indigo-500'
          } ${className}`}
          {...props}
        />
        
        {/* Плавающий лейбл */}
        {inputId && (
          <label
            htmlFor={inputId}
            className="absolute left-3 top-2 origin-[0] -translate-y-1.5 scale-75 transform text-xs text-zinc-500 duration-150 
              peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 
              peer-focus:top-2 peer-focus:-translate-y-1.5 peer-focus:scale-75 peer-focus:text-indigo-600"
          >
            {label}
          </label>
        )}
      </div>
      
      {error && <p className="text-[11px] text-red-600 font-medium pl-1">{error}</p>}
    </div>
  );
}
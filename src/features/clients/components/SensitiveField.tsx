'use client';

import React from 'react';
import { usePermission } from '@/features/auth/hooks/usePermission';
import { EyeOff } from 'lucide-react';

type SensitiveType = 'phone' | 'pinfl' | 'passport' | 'income';

interface SensitiveFieldProps {
    value: string | number;
    type: SensitiveType;
}

export default function SensitiveField({ value, type }: SensitiveFieldProps) {
  const { userRole } = usePermission();
  const rawValue = String(value);

  // Алгоритмы маскирования данных в зависимости от типа
  const getMaskedValue = (val: string, sensitiveType: SensitiveType, role: string): string => {
    // 1. Администраторы всегда видят полные данные
    if (role === 'Admin') {
      if (sensitiveType === 'income') {
        return Number(val).toLocaleString('ru-RU') + ' сум';
      }
      return val;
    }

    // 2. Операторы и Менеджеры видят частичную маску
    if (role === 'Operator' || role === 'Manager') {
      switch (sensitiveType) {
        case 'phone':
          // Вход: "+998901234567" или "+998 90 123 45 67" -> Выход: "+998 ** *** ** 67"
          const cleanPhone = val.replace(/\s+/g, '');
          if (cleanPhone.length >= 12) {
            return `${cleanPhone.slice(0, 4)} ** *** ** ${cleanPhone.slice(-2)}`;
          }
          return '+998 ** *** ** **';
        
        case 'pinfl':
          // Вход: "31204953940129" -> Выход: "**********0129" (показываем последние 4 цифры)
          if (val.length === 14) {
            return `**********${val.slice(-4)}`;
          }
          return '**************';

        case 'passport':
          // Вход: "FA1029485" -> Выход: "FA *****85"
          if (val.length === 9) {
            return `${val.slice(0, 2)} *****${val.slice(-2)}`;
          }
          return '*********';

        case 'income':
          // Вход: "12000000" -> Выход: "12,***,*** сум"
          const num = Number(val);
          if (num >= 1000000) {
            const millions = Math.floor(num / 1000000);
            return `${millions},***,*** сум`;
          }
          return '*,***,*** сум';

        default:
          return val;
      }
    }

    // 3. Зрители (Viewer) видят только полную маску
    switch (sensitiveType) {
      case 'phone':
        return '+998 ** *** ** **';
      case 'pinfl':
        return '**************';
      case 'passport':
        return '*********';
      case 'income':
        return '*,***,*** сум';
      default:
        return '***';
    }
  };

  const displayValue = getMaskedValue(rawValue, type, userRole || 'Viewer');
  const isMasked = userRole !== 'Admin';

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={isMasked ? 'font-mono text-zinc-600 tracking-wide font-medium' : 'font-medium text-zinc-900'}>
        {displayValue}
      </span>
      {isMasked && (
        <span 
          className="inline-flex items-center rounded bg-zinc-100 px-1 py-0.5 text-[9px] font-medium text-zinc-500 gap-0.5 cursor-help"
          title="Данные маскированы политикой безопасности"
        >
          <EyeOff className="h-2.5 w-2.5" /> Маска
        </span>
      )}
    </span>
  );
}
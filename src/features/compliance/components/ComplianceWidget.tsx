'use client';

import React, { useState } from 'react';
import { usePermission } from '@/features/auth/hooks/usePermission';
import { ShieldCheck, ShieldAlert, AlertTriangle, Scale, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface ComplianceWidgetProps {
  initialKycStatus: 'Passed' | 'Failed' | 'Pending' | 'Required';
  initialRiskLevel: 'Low' | 'Medium' | 'High';
  onUpdate?: (kycStatus: string, riskLevel: string) => void;
}

export default function ComplianceWidget({
  initialKycStatus,
  initialRiskLevel,
  onUpdate,
}: ComplianceWidgetProps) {
  const { can } = usePermission();
  
  // Проверяем, есть ли у текущего сотрудника право на редактирование комплаенс-статусов
  const hasWriteAccess = can('users:update');

  const [kycStatus, setKycStatus] = useState(initialKycStatus);
  const [riskLevel, setRiskLevel] = useState(initialRiskLevel);
  const [lastChecked, setLastChecked] = useState('15.01.2025, 11:30');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleTriggerRecheck = async () => {
    if (!hasWriteAccess) return;
    
    setIsUpdating(true);
    try {
      // Имитируем запрос к внешнему AML/KYC API (World-Check / Sanctions API)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setLastChecked(new Date().toLocaleString('ru-RU', { hour12: false }).slice(0, -3));
      toast.success('AML/KYC экспресс-проверка завершена успешно');
    } catch (e) {
      toast.error('Ошибка связи с внешним провайдером AML');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRiskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRisk = e.target.value as 'Low' | 'Medium' | 'High';
    setRiskLevel(newRisk);
    if (onUpdate) onUpdate(kycStatus, newRisk);
    toast.success(`Уровень риска изменен на ${newRisk}`);
  };

  const handleKycChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newKyc = e.target.value as 'Passed' | 'Failed' | 'Pending' | 'Required';
    setKycStatus(newKyc);
    if (onUpdate) onUpdate(newKyc, riskLevel);
    toast.success(`Статус KYC изменен на ${newKyc}`);
  };

  // Определение цвета для уровней риска
  const getRiskStyles = (level: string) => {
    switch (level) {
      case 'High':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
      {/* Шапка виджета */}
      <div className="flex items-center justify-between border-b pb-2">
        <h4 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
          <Scale className="h-4 w-4 text-zinc-500" /> Комплаенс KYC / AML
        </h4>
        
        {/* Индикатор прав доступа */}
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
          hasWriteAccess ? 'bg-indigo-50 text-indigo-700' : 'bg-zinc-100 text-zinc-500'
        }`}>
          {hasWriteAccess ? 'Редактирование' : 'Только чтение'}
        </span>
      </div>

      <div className="space-y-4 text-sm">
        {/* 1. Статус KYC */}
        <div>
          <span className="text-xs text-zinc-500 block mb-1">Статус верификации (KYC)</span>
          {hasWriteAccess ? (
            <select
              value={kycStatus}
              onChange={handleKycChange}
              className="mt-1 block w-full rounded border border-zinc-300 px-2.5 py-1.5 text-xs focus:border-indigo-500 focus:outline-none bg-white"
            >
              <option value="Passed">Passed (Пройден)</option>
              <option value="Failed">Failed (Отклонен)</option>
              <option value="Pending">Pending (Ожидает проверки)</option>
              <option value="Required">Required (Требуется повторно)</option>
            </select>
          ) : (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold ${
              kycStatus === 'Passed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {kycStatus === 'Passed' ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
              {kycStatus}
            </span>
          )}
        </div>

        {/* 2. Уровень риска AML */}
        <div>
          <span className="text-xs text-zinc-500 block mb-1">Уровень финансового риска (AML)</span>
          {hasWriteAccess ? (
            <select
              value={riskLevel}
              onChange={handleRiskChange}
              className={`mt-1 block w-full rounded border px-2.5 py-1.5 text-xs font-semibold focus:outline-none ${getRiskStyles(riskLevel)}`}
            >
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          ) : (
            <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 rounded text-xs font-semibold ${getRiskStyles(riskLevel)}`}>
              <AlertTriangle className="h-3.5 w-3.5" />
              {riskLevel} Risk
            </span>
          )}
        </div>

        {/* 3. Системные логи проверки */}
        <div className="pt-2 border-t border-zinc-100 text-xs text-zinc-500 space-y-1.5">
          <div className="flex justify-between">
            <span>Последняя проверка:</span>
            <span className="font-medium text-zinc-700">{lastChecked}</span>
          </div>
          <div className="flex justify-between">
            <span>Провайдер AML:</span>
            <span className="font-medium text-zinc-700">World-Check API</span>
          </div>
        </div>

        {/* 4. Кнопка перезапуска экспресс-проверки (доступна только при наличии прав) */}
        {hasWriteAccess && (
          <button
            onClick={handleTriggerRecheck}
            disabled={isUpdating}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors focus:outline-none disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? 'Анализ баз санкций...' : 'Запустить AML проверку'}
          </button>
        )}
      </div>
    </div>
  );
}
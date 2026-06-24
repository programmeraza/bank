'use client';

import React, { useState } from 'react';
import { Database, Wifi, ShieldCheck, Mail, KeyRound, Cpu } from 'lucide-react';

interface IntegrationNode {
  name: string;
  type: string;
  status: 'Online' | 'Degraded' | 'Offline' | 'Maintenance';
  latency: string;
  errorsCount: number;
  lastChecked: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function IntegrationsPage() {
  const [nodes] = useState<IntegrationNode[]>([
    { name: 'KATM Credit Bureau API', type: 'Кредитный скоринг', status: 'Online', latency: '245 ms', errorsCount: 0, lastChecked: 'Только что', icon: Database },
    { name: 'GRCI Government Registry', type: 'ПИНФЛ / Паспортная сверка', status: 'Online', latency: '410 ms', errorsCount: 2, lastChecked: '1 мин. назад', icon: ShieldCheck },
    { name: 'SMS Notify Gateway', type: 'Рассылка уведомлений', status: 'Degraded', latency: '1.2 sec', errorsCount: 14, lastChecked: 'Только что', icon: Mail },
    { name: 'OTP One-Time Password API', type: 'Двухфакторная авторизация', status: 'Online', latency: '120 ms', errorsCount: 0, lastChecked: 'Только что', icon: KeyRound },
    { name: 'Core ABS Integration', type: 'Банковские проводки', status: 'Online', latency: '85 ms', errorsCount: 0, lastChecked: 'Только что', icon: Cpu },
  ]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Online':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Degraded':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Offline':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-zinc-50 text-zinc-500 border-zinc-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-zinc-950">Мониторинг внешних интеграций</h2>
        <p className="text-xs text-zinc-500">Диагностика работоспособности внешних шлюзов, задержек (Latency) и ошибок обмена данными.</p>
      </div>

      {/* Сетка интеграционных узлов */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {nodes.map((node) => {
          const Icon = node.icon;
          return (
            <div key={node.name} className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-zinc-50 text-zinc-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">{node.name}</h4>
                    <span className="text-[10px] text-zinc-500 block">{node.type}</span>
                  </div>
                </div>

                {/* Статус-бейдж */}
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold border ${getStatusStyle(node.status)}`}>
                  {node.status}
                </span>
              </div>

              {/* Метрики здоровья */}
              <div className="grid grid-cols-3 gap-2 border-t border-dashed pt-3 text-xs">
                <div>
                  <span className="text-zinc-500 block text-[10px]">Время отклика:</span>
                  <p className="font-semibold text-zinc-800 mt-0.5">{node.latency}</p>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">Ошибок за час:</span>
                  <p className={`font-semibold mt-0.5 ${node.errorsCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {node.errorsCount} ед.
                  </p>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">Аудит:</span>
                  <p className="font-semibold text-zinc-800 mt-0.5">{node.lastChecked}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
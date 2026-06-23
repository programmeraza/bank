import React from 'react';
import { Cpu } from 'lucide-react';
import { DeviceSummary } from '../types';

export default function DevicesWidget({ devices }: { devices: DeviceSummary[] }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <h4 className="font-semibold text-zinc-900">Мониторинг оборудования</h4>
        <span className="text-xs text-zinc-500">Всего: {devices.length}</span>
      </div>
      <ul className="mt-4 divide-y divide-zinc-100">
        {devices.map((device) => (
          <li key={device.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-50 text-zinc-600">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900">{device.name}</p>
                <p className="text-xs text-zinc-500">{device.location}</p>
              </div>
            </div>
            
            {/* Статус-бейдж */}
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                device.status === 'online'
                  ? 'bg-green-50 text-green-700'
                  : device.status === 'offline'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {device.status === 'online' ? 'В сети' : device.status === 'offline' ? 'Не в сети' : 'Тест'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
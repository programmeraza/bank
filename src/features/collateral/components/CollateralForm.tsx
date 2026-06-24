'use client';

import React, { useState } from 'react';
import { Shield, Car, Home, Coins, Landmark, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CollateralForm() {
  const [type, setType] = useState<'vehicle' | 'estate' | 'guarantee'>('vehicle');
  const [value, setValue] = useState<number>(140000000);
  const [description, setDescription] = useState('Chevrolet Lacetti, 2023 г.в., госномер 01 A 123 AA, цвет серый.');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveCollateral = () => {
    setIsSaved(true);
    toast.success('Параметры залогового обеспечения сохранены');
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
      {/* Шапка */}
      <div className="border-b pb-3 flex justify-between items-center">
        <h4 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
          <Shield className="h-4 w-4 text-indigo-500" /> Залоговое обеспечение (Collateral)
        </h4>
        <span className="text-[10px] text-zinc-400 font-mono">ID: COL-9812</span>
      </div>

      <div className="space-y-4 text-xs">
        {/* Выбор типа залога */}
        <div>
          <label className="block font-semibold text-zinc-700">Тип обеспечения</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => { setType('vehicle'); setValue(140000000); }}
              className={`flex flex-col items-center p-2.5 rounded border text-center transition-all ${
                type === 'vehicle' ? 'border-indigo-500 bg-indigo-50/30 font-bold text-indigo-600' : 'border-zinc-200 text-zinc-500'
              }`}
            >
              <Car className="h-5 w-5 mb-1" /> Автотранспорт
            </button>
            <button
              type="button"
              onClick={() => { setType('estate'); setValue(350000000); }}
              className={`flex flex-col items-center p-2.5 rounded border text-center transition-all ${
                type === 'estate' ? 'border-indigo-500 bg-indigo-50/30 font-bold text-indigo-600' : 'border-zinc-200 text-zinc-500'
              }`}
            >
              <Home className="h-5 w-5 mb-1" /> Недвижимость
            </button>
            <button
              type="button"
              onClick={() => { setType('guarantee'); setValue(50000000); }}
              className={`flex flex-col items-center p-2.5 rounded border text-center transition-all ${
                type === 'guarantee' ? 'border-indigo-500 bg-indigo-50/30 font-bold text-indigo-600' : 'border-zinc-200 text-zinc-500'
              }`}
            >
              <Landmark className="h-5 w-5 mb-1" /> Поручительство
            </button>
          </div>
        </div>

        {/* Стоимость залога */}
        <div>
          <label className="block font-semibold text-zinc-700">Рыночная оценочная стоимость (сум)</label>
          <input
            type="number"
            value={value}
            disabled={isSaved}
            onChange={(e) => setValue(Number(e.target.value))}
            className="mt-1.5 block w-full rounded border border-zinc-300 px-3 py-1.5 focus:border-indigo-500 focus:outline-none disabled:bg-zinc-50"
          />
        </div>

        {/* Описание залога */}
        <div>
          <label className="block font-semibold text-zinc-700">Подробное описание предмета залога</label>
          <textarea
            value={description}
            disabled={isSaved}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1.5 block w-full rounded border border-zinc-300 px-3 py-1.5 h-16 resize-none focus:border-indigo-500 focus:outline-none disabled:bg-zinc-50"
          />
        </div>

        {/* Статус загрузки залоговых документов */}
        <div className="flex items-center justify-between rounded bg-zinc-50 p-2.5 border border-zinc-200">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-zinc-400" />
            <span className="font-semibold text-zinc-700">Выписка из Госреестра залогов:</span>
          </div>
          <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
            Обременение наложено
          </span>
        </div>

        {/* Сохранение залога */}
        <button
          onClick={handleSaveCollateral}
          disabled={isSaved}
          className="w-full inline-flex items-center justify-center gap-1.5 rounded bg-indigo-600 px-3 py-2 font-semibold text-white hover:bg-indigo-500 transition-colors disabled:bg-green-600"
        >
          {isSaved ? <><Check className="h-4 w-4" /> Данные залога зафиксированы</> : 'Подтвердить оценку обеспечения'}
        </button>
      </div>
    </div>
  );
}
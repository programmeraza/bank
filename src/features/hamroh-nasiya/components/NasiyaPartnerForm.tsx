'use client';

import React, { useState } from 'react';
import { ShoppingBag, Store, Tag, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NasiyaPartnerForm() {
  const [partner, setPartner] = useState('MediaPark');
  const [store, setStore] = useState('Ташкент, ТРЦ Compass');
  const [productName, setProductName] = useState('Холодильник Samsung RB34');
  const [price, setPrice] = useState<number>(8500000);
  const [downPayment, setDownPayment] = useState<number>(1500000);
  const [isFinalized, setIsFinalized] = useState(false);

  const financedSum = price - downPayment;

  const handleFinalizeNasiya = () => {
    setIsFinalized(true);
    toast.success('Параметры рассрочки Hamroh Nasiya зафиксированы');
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
      {/* Шапка */}
      <div className="border-b pb-3 flex justify-between items-center">
        <h4 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-indigo-500" /> Торговая рассрочка Hamroh Nasiya
        </h4>
        <span className="text-[10px] text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded font-bold">Партнерская программа</span>
      </div>

      <div className="space-y-4 text-xs">
        {/* Селектор Партнера и Магазина */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-zinc-700">Торговый партнер</label>
            <select
              value={partner}
              disabled={isFinalized}
              onChange={(e) => setPartner(e.target.value)}
              className="mt-1 block w-full rounded border border-zinc-300 px-2 py-1.5 focus:border-indigo-500 focus:outline-none bg-white"
            >
              <option value="MediaPark">MediaPark</option>
              <option value="Artel">Artel Showroom</option>
              <option value="Elmakon">Elmakon Retail</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-zinc-700">Торговая точка / Филиал</label>
            <input
              type="text"
              value={store}
              disabled={isFinalized}
              onChange={(e) => setStore(e.target.value)}
              className="mt-1 block w-full rounded border border-zinc-300 px-2 py-1.5 focus:border-indigo-500 focus:outline-none bg-white"
            />
          </div>
        </div>

        {/* Сведения о товаре */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block font-semibold text-zinc-700">Наименование товара / Модель</label>
            <input
              type="text"
              value={productName}
              disabled={isFinalized}
              className="mt-1 block w-full rounded border border-zinc-300 px-2 py-1.5 focus:border-indigo-500 focus:outline-none bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold text-zinc-700">Цена товара (сум)</label>
            <input
              type="number"
              value={price}
              disabled={isFinalized}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="mt-1 block w-full rounded border border-zinc-300 px-2 py-1.5 focus:border-indigo-500 focus:outline-none bg-white"
            />
          </div>
        </div>

        {/* Первоначальный взнос и Расчет задолженности */}
        <div className="grid grid-cols-2 gap-3 bg-zinc-50 p-3 rounded border border-zinc-200">
          <div>
            <span className="text-[10px] text-zinc-500 block">Первоначальный взнос покупателя:</span>
            <input
              type="number"
              value={downPayment}
              disabled={isFinalized}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="mt-1 block w-full rounded border border-zinc-300 px-2 py-1 text-xs font-semibold focus:border-indigo-500 focus:outline-none bg-white"
            />
          </div>
          <div className="flex flex-col justify-center text-right">
            <span className="text-[10px] text-zinc-500">Сумма финансирования банка:</span>
            <span className="text-sm font-bold text-indigo-600 mt-1">
              {financedSum.toLocaleString()} сум
            </span>
          </div>
        </div>

        {/* Фиксация сделки */}
        <button
          onClick={handleFinalizeNasiya}
          disabled={isFinalized}
          className="w-full inline-flex items-center justify-center gap-1.5 rounded bg-indigo-600 px-3 py-2 font-semibold text-white hover:bg-indigo-500 transition-colors disabled:bg-green-600"
        >
          {isFinalized ? <><Check className="h-4 w-4" /> Сделка рассрочки зафиксирована</> : 'Подтвердить параметры товара'}
        </button>
      </div>
    </div>
  );
}
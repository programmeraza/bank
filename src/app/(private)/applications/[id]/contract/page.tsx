'use client';

import React, { useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Printer, FileDown, ShieldCheck, Landmark } from 'lucide-react';
import toast from 'react-hot-toast';

// Интерфейс строки графика платежей
interface ScheduleRow {
  paymentNo: number;
  date: string;
  totalPayment: number;
  principalRepayment: number;
  interestPayment: number;
  remainingBalance: number;
}

export default function ContractAndSchedulePage() {
  const router = useRouter();
  const { id } = useParams();

  // Параметры одобренного кредита для расчетов
  const clientName = 'Абдуллаев Сардорбек Рустамович';
  const passport = 'FA1029485';
  const approvedAmount = 15000000;
  const approvedTerm = 12;
  const rate = 24; // 24% годовых

  // --- МАТЕМАТИЧЕСКИЙ РАСЧЕТ АННУИТЕТНОГО ГРАФИКА (Этап 10) ---
  const generateSchedule = (principal: number, termInMonths: number, annualRate: number): ScheduleRow[] => {
    const monthlyRate = annualRate / 12 / 100;
    
    // Аннуитетный платеж
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / 
                           (Math.pow(1 + monthlyRate, termInMonths) - 1);

    const schedule: ScheduleRow[] = [];
    let remaining = principal;
    const startDate = new Date();

    for (let i = 1; i <= termInMonths; i++) {
      const interest = remaining * monthlyRate;
      const principalPaid = monthlyPayment - interest;
      remaining = remaining - principalPaid;

      // Рассчитываем дату платежа (+ i месяцев от сегодня)
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(startDate.getMonth() + i);
      const formattedDate = paymentDate.toLocaleDateString('ru-RU');

      schedule.push({
        paymentNo: i,
        date: formattedDate,
        totalPayment: Math.round(monthlyPayment),
        principalRepayment: Math.round(principalPaid),
        interestPayment: Math.round(interest),
        remainingBalance: Math.max(0, Math.round(remaining)),
      });
    }

    return schedule;
  };

  const paymentSchedule = generateSchedule(approvedAmount, approvedTerm, rate);

  const totalPayout = paymentSchedule.reduce((sum, row) => sum + row.totalPayment, 0);
  const totalInterest = paymentSchedule.reduce((sum, row) => sum + row.interestPayment, 0);

  // --- ОПЕРАЦИИ С ДОКУМЕНТАМИ ---
  const handlePrint = () => {
    window.print(); // Запуск стандартной системной печати
  };

  const handleExportPDF = () => {
    toast.success('Договор и график успешно экспортированы в PDF');
  };

  const handleExportExcel = () => {
    toast.success('График платежей сохранен в формате Excel (.xlsx)');
  };

  return (
    <div className="space-y-6">
      {/* Кнопки управления (скрываются при печати через CSS media-print) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/applications/${id}`)}
            className="rounded p-1 hover:bg-zinc-100 transition-colors"
            title="Назад в заявку"
          >
            <ArrowLeft className="h-5 w-5 text-zinc-500" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-zinc-950">Оформление документов по сделке</h2>
            <p className="text-xs text-zinc-500">Генерация договора займа, условий и графика погашения кредита.</p>
          </div>
        </div>

        {/* Экспорт */}
        <div className="flex gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 rounded border border-zinc-300 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            <FileDown className="h-4 w-4 text-green-600" /> Экспорт Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 rounded border border-zinc-300 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            <FileDown className="h-4 w-4 text-red-600" /> Экспорт PDF
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm"
          >
            <Printer className="h-4 w-4" /> Печать
          </button>
        </div>
      </div>

      {/* ПЕЧАТНЫЙ ДОКУМЕНТ (Styled for clean screen reading and paper print) */}
      <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm space-y-8 max-w-4xl mx-auto print:border-0 print:shadow-none print:p-0">
        
        {/* Шапка договора */}
        <div className="text-center space-y-2 pb-6 border-b border-zinc-100">
          <Landmark className="mx-auto h-12 w-12 text-indigo-600 print:h-8 print:w-8" />
          <h3 className="text-xl font-bold text-zinc-950 uppercase">Договор потребительского займа № {id}</h3>
          <p className="text-xs text-zinc-500">Дата заключения: {new Date().toLocaleDateString('ru-RU')} года</p>
        </div>

        {/* Раздел 1. Юридический текст */}
        <div className="text-xs text-zinc-700 space-y-4 leading-relaxed text-justify">
          <p>
            <span className="font-semibold text-zinc-900">1. Стороны договора.</span> ООО «PLATFORM PRO», именуемое в дальнейшем «Кредитор», с одной стороны, и гражданин <span className="font-semibold text-zinc-900">{clientName}</span>, паспорт серии/номер <span className="font-semibold text-zinc-900">{passport}</span>, именуемый в дальнейшем «Заемщик», с другой стороны, заключили настоящий договор о нижеследующем.
          </p>
          <p>
            <span className="font-semibold text-zinc-900">2. Предмет договора.</span> Кредитор обязуется предоставить Заемщику денежные средства в размере <span className="font-semibold text-zinc-900">{approvedAmount.toLocaleString()} сум</span> сроком на <span className="font-semibold text-zinc-900">{approvedTerm} месяцев</span> под процентную ставку <span className="font-semibold text-zinc-900">{rate}% годовых</span>, а Заемщик обязуется вернуть полученную сумму и начисленные проценты в порядке, установленном Графиком платежей.
          </p>
          <p>
            <span className="font-semibold text-zinc-900">3. Порядок расчетов.</span> Погашение займа производится ежемесячными аннуитетными платежами в соответствии с таблицей Графика платежей (Раздел 4). Настоящий договор вступает в силу с момента фактического зачисления денежных средств на счет Заемщика.
          </p>
        </div>

        {/* Раздел 2. График платежей (Этап 10) */}
        <div className="space-y-3 pt-4 page-break-before">
          <h4 className="text-sm font-bold text-zinc-950 uppercase border-b pb-2 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-green-600 print:hidden" /> Раздел 4. График ежемесячных платежей
          </h4>
          
          <table className="min-w-full divide-y divide-zinc-200 text-left text-xs font-mono">
            <thead className="bg-zinc-50 print:bg-transparent">
              <tr>
                <th className="px-4 py-2 font-semibold text-zinc-700">№</th>
                <th className="px-4 py-2 font-semibold text-zinc-700">Дата платежа</th>
                <th className="px-4 py-2 font-semibold text-zinc-700 text-right">Сумма платежа</th>
                <th className="px-4 py-2 font-semibold text-zinc-700 text-right">Основной долг</th>
                <th className="px-4 py-2 font-semibold text-zinc-700 text-right">Проценты</th>
                <th className="px-4 py-2 font-semibold text-zinc-700 text-right">Остаток долга</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150">
              {paymentSchedule.map((row) => (
                <tr key={row.paymentNo} className="hover:bg-zinc-50/50 print:hover:bg-transparent">
                  <td className="px-4 py-2 text-zinc-500 font-bold">{row.paymentNo}</td>
                  <td className="px-4 py-2 text-zinc-600">{row.date}</td>
                  <td className="px-4 py-2 text-right font-bold text-zinc-900">{row.totalPayment.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right text-zinc-700">{row.principalRepayment.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right text-zinc-700">{row.interestPayment.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right text-zinc-500">{row.remainingBalance.toLocaleString()}</td>
                </tr>
              ))}
              {/* Итоговая строка */}
              <tr className="bg-zinc-100/70 font-semibold print:bg-transparent border-t border-zinc-300">
                <td colSpan={2} className="px-4 py-2.5 text-zinc-800">ИТОГО К ВЫПЛАТЕ:</td>
                <td className="px-4 py-2.5 text-right text-zinc-950 font-bold">{totalPayout.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right text-zinc-800">{approvedAmount.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right text-zinc-800">{totalInterest.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right text-zinc-400">—</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Раздел 3. Блок подписей */}
        <div className="grid grid-cols-2 gap-8 pt-12 border-t border-zinc-100 text-xs">
          <div className="space-y-8">
            <span className="font-semibold text-zinc-900 uppercase block">От Кредитора:</span>
            <div className="border-b border-zinc-400 w-3/4 pt-4" />
            <span className="text-zinc-500 block">ООО «PLATFORM PRO» / М.П.</span>
          </div>
          <div className="space-y-8">
            <span className="font-semibold text-zinc-900 uppercase block">От Заемщика:</span>
            <div className="border-b border-zinc-400 w-3/4 pt-4" />
            <span className="text-zinc-500 block">Подпись заемщика</span>
          </div>
        </div>

      </div>
    </div>
  );
}
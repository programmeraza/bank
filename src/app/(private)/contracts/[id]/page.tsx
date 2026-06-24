'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, Landmark, Calendar, Clock, DollarSign, 
  ShieldAlert, PhoneCall, MessageSquare, Plus, FileText, 
  CheckCircle2, AlertTriangle, XCircle, ArrowUpRight, Scale
} from 'lucide-react';
import toast from 'react-hot-toast';

// --- ОПИСАНИЕ ТИПОВ ДАННЫХ КАРТОЧКИ ---
interface PaymentHistoryItem {
  id: string;
  date: string;
  amount: number;
  type: 'Planned' | 'Early' | 'Partial' | 'Full';
  status: 'Paid' | 'Failed';
  operator: string;
}

interface CollectionLog {
  id: string;
  date: string;
  employee: string;
  action: 'Call' | 'SMS' | 'Notice' | 'Court';
  result: string;
}

// --- СТАТИЧЕСКИЕ ДЕМОНСТРАЦИОННЫЕ ДАННЫЕ ---
const MOCK_CONTRACT = {
  id: 'CTR-5014',
  clientName: 'Петров Сергей Николаевич',
  clientPhone: '+998 97 456 12 34',
  productName: 'Микрозайм Экспресс',
  principalAmount: 10000000,
  remainingBalance: 8500000,
  status: 'Overdue' as const,
  issueDate: '01.12.2024',
  endDate: '01.06.2025',
  dpd: 14,
  nextPaymentDate: '01.02.2025',
  nextPaymentAmount: 1250000,
};

const MOCK_PAYMENTS: PaymentHistoryItem[] = [
  { id: 'pay-1', date: '01.12.2024', amount: 1500000, type: 'Planned', status: 'Paid', operator: 'Иван Иванов' },
  { id: 'pay-2', date: '01.01.2025', amount: 1250000, type: 'Planned', status: 'Paid', operator: 'Иван Иванов' },
  { id: 'pay-3', date: '15.01.2025', amount: 500000, type: 'Partial', status: 'Paid', operator: 'Самообслуживание' },
];

const MOCK_COLLECTION_LOGS: CollectionLog[] = [
  { id: 'col-1', date: '16.01.2025', employee: 'Ольга Кузнецова (Collection)', action: 'SMS', result: 'Направлено СМС-уведомление о просрочке 1 день.' },
  { id: 'col-2', date: '18.01.2025', employee: 'Ольга Кузнецова (Collection)', action: 'Call', result: 'Звонок клиенту. Обещал оплатить задолженность до 20.01.' },
];

export default function CreditCardPage() {
  const router = useRouter();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'payments' | 'delinquency' | 'collection'>('overview');

  // Динамические стейты для тестов взыскания и платежей
  const [payments, setPayments] = useState<PaymentHistoryItem[]>(MOCK_PAYMENTS);
  const [collectionLogs, setCollectionLogs] = useState<CollectionLog[]>(MOCK_COLLECTION_LOGS);
  
  // Временные поля ввода для Soft Collection
  const [newComment, setNewComment] = useState('');

  const contract = MOCK_CONTRACT;

  const tabs = [
    { id: 'overview', name: 'Обзор', icon: Landmark },
    { id: 'schedule', name: 'График выплат', icon: Calendar },
    { id: 'payments', name: 'Платежи', icon: DollarSign },
    { id: 'delinquency', name: 'Просрочка и Риски', icon: ShieldAlert },
    { id: 'collection', name: 'Взыскание (Soft/Hard)', icon: PhoneCall },
  ] as const;

  // --- ОПЕРАЦИИ СОФТ-КОЛЛЕКШН (Этап 8) ---
  const handleLogAction = (actionType: 'Call' | 'SMS' | 'Notice') => {
    if (!newComment.trim()) {
      toast.error('Введите текст примечания перед фиксацией действия');
      return;
    }

    const newLog: CollectionLog = {
      id: Math.random().toString(),
      date: new Date().toLocaleDateString('ru-RU') + ', ' + new Date().toLocaleTimeString('ru-RU').slice(0, -3),
      employee: 'Иван Иванов (Collection)',
      action: actionType,
      result: `${actionType === 'Call' ? 'Звонок' : actionType === 'SMS' ? 'СМС' : 'Уведомление'}: ${newComment}`,
    };

    setCollectionLogs((prev) => [newLog, ...prev]);
    setNewComment('');
    toast.success('Действие взыскания успешно зафиксировано в истории');
  };

  return (
    <div className="space-y-6">
      {/* Шапка договора */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/contracts')}
            className="rounded p-1 hover:bg-zinc-100 transition-colors"
            title="Назад в реестр"
          >
            <ArrowLeft className="h-5 w-5 text-zinc-500" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-zinc-950">Карточка кредитного договора</h2>
            <div className="mt-1 flex flex-wrap gap-2 text-xs font-mono text-zinc-500">
              <span>Договор №: {id}</span>
              <span>|</span>
              <span>Заемщик: {contract.clientName}</span>
            </div>
          </div>
        </div>

        {/* Статус-бейдж риска */}
        <div className="flex gap-2">
          <span className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-600/10">
            DPD: {contract.dpd} дней
          </span>
          <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/10">
            Статус: {contract.status}
          </span>
        </div>
      </div>

      {/* Вкладки навигации */}
      <div className="border-b border-zinc-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 py-4 px-1 text-sm font-semibold transition-colors focus:outline-none ${
                  isActive
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Контент вкладок */}
      <div className="mt-6">
        {/* ВКЛАДКА 1: ОБЗОР */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Основной баланс */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm md:col-span-2 space-y-6">
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2">Финансовое состояние займа</h3>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-sm">
                <div>
                  <span className="text-xs text-zinc-500 block">Остаток основного долга</span>
                  <span className="text-2xl font-bold text-zinc-950 block mt-1">
                    {contract.remainingBalance.toLocaleString()} сум
                  </span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">из {contract.principalAmount.toLocaleString()} сум выдачи</span>
                </div>

                <div>
                  <span className="text-xs text-zinc-500 block">Дата следующего платежа</span>
                  <span className="text-base font-semibold text-zinc-900 block mt-2 flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-zinc-400" /> {contract.nextPaymentDate}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-zinc-500 block">Сумма к оплате</span>
                  <span className="text-base font-bold text-indigo-600 block mt-2">
                    {contract.nextPaymentAmount.toLocaleString()} сум
                  </span>
                </div>
              </div>

              {/* Сводные личные данные */}
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 pt-2">Информация о заемщике</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <span className="text-xs text-zinc-500 block">ФИО клиента</span>
                  <span className="font-semibold text-zinc-900 block mt-0.5">{contract.clientName}</span>
                </div>
                <div>
                  <span className="text-xs text-zinc-500 block">Контактный телефон</span>
                  <span className="font-medium text-zinc-950 block mt-0.5">{contract.clientPhone}</span>
                </div>
              </div>
            </div>

            {/* Быстрые действия */}
            <div className="space-y-6">
              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
                <h4 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-zinc-500" /> Операции по счету
                </h4>
                <button
                  onClick={() => router.push(`/contracts/${id}/payment`)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                >
                  <Plus className="h-4 w-4" /> Зарегистрировать платеж
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ВКЛАДКА 2: ГРАФИК ВЫПЛАТ */}
        {activeTab === 'schedule' && (
          <div className="rounded-lg border border-zinc-200 bg-white shadow-sm overflow-hidden p-6 text-center text-sm text-zinc-500">
            <Calendar className="mx-auto h-12 w-12 text-zinc-300 mb-2" />
            <p className="font-semibold text-zinc-800">Календарный график погашения</p>
            <p className="text-xs text-zinc-500 mt-1">График платежей доступен для печати и экспорта во вкладке Договоры.</p>
          </div>
        )}

        {/* ВКЛАДКА 3: ИСТОРИЯ ПЛАТЕЖЕЙ (Этап 5) */}
        {activeTab === 'payments' && (
          <div className="rounded-lg border border-zinc-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-zinc-100 px-6 py-4">
              <h3 className="font-semibold text-zinc-900">Зарегистрированные транзакции зачисления</h3>
            </div>
            
            <table className="min-w-full divide-y divide-zinc-200 text-left text-sm font-mono">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-6 py-3 font-semibold text-zinc-700">Дата зачисления</th>
                  <th className="px-6 py-3 font-semibold text-zinc-700 text-right">Сумма платежа</th>
                  <th className="px-6 py-3 font-semibold text-zinc-700">Тип платежа</th>
                  <th className="px-6 py-3 font-semibold text-zinc-700">Статус проведения</th>
                  <th className="px-6 py-3 font-semibold text-zinc-700">Оператор оформления</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-zinc-50/50">
                    <td className="px-6 py-4 text-zinc-500 text-xs">{pay.date}</td>
                    <td className="px-6 py-4 text-right font-bold text-zinc-900">{pay.amount.toLocaleString()} сум</td>
                    <td className="px-6 py-4 text-zinc-700 text-xs font-semibold">{pay.type}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-green-700 text-xs font-semibold bg-green-50 px-2 py-0.5 rounded">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Проведен
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 text-xs">{pay.operator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ВКЛАДКА 4: ПРОСРОЧКА И РИСКИ (Этап 6 & 10) */}
        {activeTab === 'delinquency' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Параметры риска */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                <ShieldAlert className="h-4.5 w-4.5 text-red-500" /> Индикаторы качества портфеля
              </h3>
              
              <div className="space-y-4 text-xs">
                {/* DPD */}
                <div className="flex justify-between items-center border-b pb-2 border-dashed">
                  <span className="text-zinc-500 font-semibold">DPD (Days Past Due — дней просрочки):</span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    contract.dpd > 90 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {contract.dpd} дней
                  </span>
                </div>

                {/* PAR */}
                <div className="flex justify-between items-center border-b pb-2 border-dashed">
                  <span className="text-zinc-500 font-semibold">PAR % (Portfolio At Risk):</span>
                  <span className="font-bold text-zinc-800">100% (Договор полностью под угрозой)</span>
                </div>

                {/* NPL */}
                <div className="flex justify-between items-center pb-2">
                  <span className="text-zinc-500 font-semibold">Категория актива (NPL Status):</span>
                  <span className="font-bold text-red-600 uppercase">Substandard Asset (Неработающий заём)</span>
                </div>
              </div>
            </div>

            {/* Блок Резервов (Этап 10) */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                <Scale className="h-4.5 w-4.5 text-zinc-500" /> Финансовое резервирование и списания
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center border-b pb-2 border-dashed">
                  <span className="text-zinc-500">Норма резервирования ЦБ:</span>
                  <span className="font-semibold text-zinc-700">25% (Повышенный резерв)</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2 border-dashed">
                  <span className="text-zinc-500">Сумма сформированного резерва:</span>
                  <span className="font-bold text-indigo-600">2,125,000 сум</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-zinc-500">Статус списания (Write Off):</span>
                  <span className="font-bold text-zinc-500 uppercase">Очередь регулярного взыскания</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ВКЛАДКА 5: ВЗЫСКАНИЕ (Soft/Hard) (Этап 8 & 9) */}
        {activeTab === 'collection' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Панель ручной фиксации Soft Collection */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm md:col-span-2 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2">Панель действий Soft Collection</h3>
              
              <div>
                <label className="block text-xs font-semibold text-zinc-700">Примечание к совершенному контакту</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Опишите результат контакта с клиентом (например: 'Обещал внести платеж завтра до 14:00')..."
                  className="mt-1.5 block w-full rounded border border-zinc-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none h-20 resize-none bg-white"
                />
              </div>

              {/* Кнопки вызова действий Soft Collection */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleLogAction('Call')}
                  className="inline-flex items-center justify-center gap-1.5 rounded border border-zinc-300 bg-white p-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  <PhoneCall className="h-4 w-4 text-green-600" /> Зафиксировать звонок
                </button>
                <button
                  onClick={() => handleLogAction('SMS')}
                  className="inline-flex items-center justify-center gap-1.5 rounded border border-zinc-300 bg-white p-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  <MessageSquare className="h-4 w-4 text-blue-600" /> Направить СМС
                </button>
                <button
                  onClick={() => handleLogAction('Notice')}
                  className="inline-flex items-center justify-center gap-1.5 rounded border border-zinc-300 bg-white p-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  <ShieldAlert className="h-4 w-4 text-amber-600" /> Направить претензию
                </button>
              </div>
            </div>

            {/* Боковой статус Hard Collection */}
            <div className="space-y-6">
              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
                <h4 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                  <Scale className="h-4.5 w-4.5 text-red-500" /> Департамент Hard Collection
                </h4>
                <div className="text-xs space-y-3">
                  <div>
                    <span className="text-zinc-500 block">Статус кейса:</span>
                    <span className="font-semibold text-red-600 block mt-0.5">Досудебный разбор (Pre-Legal)</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Ответственный юрист:</span>
                    <span className="font-semibold text-zinc-800 block mt-0.5">Алишер Кадыров</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Лог действий по взысканию */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm md:col-span-3 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2">Лента хронологии взыскания</h3>
              <div className="flow-root">
                <ul className="-mb-8">
                  {collectionLogs.map((log, index) => (
                    <li key={log.id}>
                      <div className="relative pb-8">
                        {index !== collectionLogs.length - 1 && (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-zinc-200" />
                        )}
                        <div className="relative flex space-x-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 ring-8 ring-white">
                            {log.action === 'Call' && <PhoneCall className="h-4 w-4 text-green-600" />}
                            {log.action === 'SMS' && <MessageSquare className="h-4 w-4 text-blue-600" />}
                            {log.action === 'Notice' && <ShieldAlert className="h-4 w-4 text-amber-600" />}
                          </span>
                          <div className="flex-1 min-w-0 pt-1">
                            <p className="text-xs text-zinc-800 font-medium">{log.result}</p>
                            <div className="mt-1 flex justify-between text-[10px] text-zinc-500">
                              <span>Сотрудник: {log.employee}</span>
                              <time>{log.date}</time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
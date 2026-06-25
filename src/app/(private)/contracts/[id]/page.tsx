'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, Landmark, Calendar, Clock, DollarSign, 
  ShieldAlert, PhoneCall, MessageSquare, Plus, FileText, 
  CheckCircle2, XCircle, Scale
} from 'lucide-react';
import toast from 'react-hot-toast';

// Импорты UI Kit (сохраняя структуру)
import PageTransition from '@/shared/ui/PageTransition';
import Badge from '@/shared/ui/Badge';
import Button from '@/shared/ui/Button';

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
  { id: 'col-1', date: '16.01.2025', employee: 'Ольга Кузнецова (Collection)', action: 'SMS', result: 'СМС-уведомление о просрочке 1 день.' },
  { id: 'col-2', date: '18.01.2025', employee: 'Ольга Кузнецова (Collection)', action: 'Call', result: 'Звонок. Обещал оплатить долг до 20.01.' },
];

export default function CreditCardPage() {
  const router = useRouter();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'payments' | 'delinquency' | 'collection'>('overview');

  const [payments] = useState<PaymentHistoryItem[]>(MOCK_PAYMENTS);
  const [collectionLogs, setCollectionLogs] = useState<CollectionLog[]>(MOCK_COLLECTION_LOGS);
  const [newComment, setNewComment] = useState('');

  const contract = MOCK_CONTRACT;

  const tabs = [
    { id: 'overview', name: 'Обзор', icon: Landmark },
    { id: 'schedule', name: 'График выплат', icon: Calendar },
    { id: 'payments', name: 'Платежи', icon: DollarSign },
    { id: 'delinquency', name: 'Просрочка и Риски', icon: ShieldAlert },
    { id: 'collection', name: 'Взыскание (Soft/Hard)', icon: PhoneCall },
  ] as const;

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
    toast.success('Действие взыскания успешно зафиксировано');
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Шапка договора */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-5">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/contracts')} className="rounded p-1 hover:bg-zinc-100 transition-colors">
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

          <div className="flex gap-2">
            <Badge label={`DPD: ${contract.dpd} дней`} variant="error" />
            <Badge label={`Статус: ${contract.status}`} variant="warning" />
          </div>
        </div>

        {/* Вкладки навигации */}
        <div className="border-b border-zinc-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 border-b-2 py-4 px-1 text-sm font-semibold transition-colors focus:outline-none ${
                    isActive ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'
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
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm md:col-span-2 space-y-6">
                <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2">Финансовое состояние займа</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-sm">
                  <div>
                    <span className="text-xs text-zinc-500 block">Остаток основного долга</span>
                    <span className="text-2xl font-bold text-zinc-950 block mt-1">{contract.remainingBalance.toLocaleString()} сум</span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">из {contract.principalAmount.toLocaleString()} сум</span>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 block">Дата следующего платежа</span>
                    <span className="text-base font-semibold text-zinc-900 block mt-2 flex items-center gap-1"><Calendar className="h-4 w-4 text-zinc-400" /> {contract.nextPaymentDate}</span>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 block">Сумма к оплате</span>
                    <span className="text-base font-bold text-indigo-600 block mt-2">{contract.nextPaymentAmount.toLocaleString()} сум</span>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 pt-2">Информация о заемщике</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                  <div><span className="text-xs text-zinc-500 block">ФИО клиента</span><span className="font-semibold text-zinc-900 block mt-0.5">{contract.clientName}</span></div>
                  <div><span className="text-xs text-zinc-500 block">Контактный телефон</span><span className="font-medium text-zinc-950 block mt-0.5">{contract.clientPhone}</span></div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
                  <h4 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-zinc-500" /> Операции по счету
                  </h4>
                  <Button variant="primary" onClick={() => router.push(`/contracts/${id}/payment`)} className="w-full">
                    <Plus className="h-4 w-4 mr-1.5" /> Зарегистрировать платеж
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="rounded-lg border border-zinc-200 bg-white shadow-sm overflow-hidden p-6 text-center text-sm text-zinc-500">
              <Calendar className="mx-auto h-12 w-12 text-zinc-300 mb-2" />
              <p className="font-semibold text-zinc-800">Календарный график погашения</p>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="rounded-lg border border-zinc-200 bg-white shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-zinc-200 text-left text-sm font-mono">
                <thead className="bg-zinc-50 text-xs text-zinc-700">
                  <tr>
                    <th className="px-6 py-3">Дата</th>
                    <th className="px-6 py-3 text-right">Сумма</th>
                    <th className="px-6 py-3">Тип</th>
                    <th className="px-6 py-3">Статус</th>
                    <th className="px-6 py-3">Оператор</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-xs">
                  {payments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-zinc-50/50">
                      <td className="px-6 py-4 text-zinc-500">{pay.date}</td>
                      <td className="px-6 py-4 text-right font-bold text-zinc-900">{pay.amount.toLocaleString()} сум</td>
                      <td className="px-6 py-4 text-zinc-700 font-semibold">{pay.type}</td>
                      <td className="px-6 py-4"><Badge label={pay.status} variant="success" /></td>
                      <td className="px-6 py-4 text-zinc-500">{pay.operator}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'delinquency' && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                  <ShieldAlert className="h-4.5 w-4.5 text-red-500" /> Индикаторы портфеля
                </h3>
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center border-b pb-2 border-dashed">
                    <span className="text-zinc-500 font-semibold">DPD (дней просрочки):</span>
                    <Badge label={`${contract.dpd} дней`} variant="error" />
                  </div>
                  <div className="flex justify-between items-center border-b pb-2 border-dashed">
                    <span className="text-zinc-500 font-semibold">PAR % (Portfolio At Risk):</span>
                    <span className="font-bold text-zinc-800">100%</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                  <Scale className="h-4.5 w-4.5 text-zinc-500" /> Резервирование МСФО-9
                </h3>
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center border-b pb-2 border-dashed"><span className="text-zinc-500">Резерв:</span><span className="font-bold text-indigo-600">2,125,000 сум (25%)</span></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'collection' && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm md:col-span-2 space-y-4">
                <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2">Действия Soft Collection</h3>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700">Примечание к контакту</label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Опишите результат контакта..."
                    className="mt-1.5 block w-full rounded border border-zinc-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none h-20 resize-none bg-white"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="secondary" onClick={() => handleLogAction('Call')}>Звонок</Button>
                  <Button variant="secondary" onClick={() => handleLogAction('SMS')}>СМС</Button>
                  <Button variant="secondary" onClick={() => handleLogAction('Notice')}>Претензия</Button>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4 text-xs">
                <h4 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                  <Scale className="h-4.5 w-4.5 text-red-500" /> Hard Collection
                </h4>
                <div className="space-y-2">
                  <div>Статус: <span className="font-bold text-red-600">Pre-Legal</span></div>
                  <div>Юрист: <span className="font-semibold text-zinc-800">Алишер Кадыров</span></div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm md:col-span-3 space-y-4">
                <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2">Лента истории взыскания</h3>
                <div className="flow-root">
                  <ul className="-mb-8">
                    {collectionLogs.map((log, index) => (
                      <li key={log.id}>
                        <div className="relative pb-8">
                          {index !== collectionLogs.length - 1 && <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-zinc-200" />}
                          <div className="relative flex space-x-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 ring-8 ring-white">
                              {log.action === 'Call' && <PhoneCall className="h-4 w-4 text-green-600" />}
                              {log.action === 'SMS' && <MessageSquare className="h-4 w-4 text-blue-600" />}
                            </span>
                            <div className="flex-1 min-w-0 pt-1 text-xs">
                              <p className="font-medium text-zinc-800">{log.result}</p>
                              <div className="mt-1 flex justify-between text-[10px] text-zinc-500">
                                <span>Автор: {log.employee}</span>
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
    </PageTransition>
  );
}
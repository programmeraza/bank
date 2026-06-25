'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, CheckCircle2, XCircle, Ban,
  ShieldCheck, ArrowRight, Percent, Clock, Wallet 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { LoanProduct } from '@/features/applications/types';

// Импорты UI Kit (сохраняя структуру пошагового мастера)
import PageTransition from '@/shared/ui/PageTransition';
import Button from '@/shared/ui/Button';
import CreditCalculator from '@/features/calculator/components/CreditCalculator';

const MOCK_PRODUCTS: LoanProduct[] = [
  { id: 'p1', name: 'Микрозайм Экспресс', rate: 24, minAmount: 1000000, maxAmount: 15000000, term: 12, commission: 1 },
  { id: 'p2', name: 'Потребительский без залога', rate: 22, minAmount: 5000000, maxAmount: 50000000, term: 24, commission: 2 },
  { id: 'p3', name: 'Автокредит Стандарт', rate: 18, minAmount: 15000000, maxAmount: 150000000, term: 36, commission: 3 },
];

interface ComplianceClient {
  id: string;
  name: string;
  phone: string;
  kycStatus: 'Passed' | 'Failed' | 'Pending' | 'Required';
  riskLevel: 'Low' | 'Medium' | 'High';
  hasConsents: boolean;
  hasDocuments: boolean;
}

const MOCK_COMPLIANCE_CLIENTS: ComplianceClient[] = [
  { id: 'CL-0891', name: 'Абдуллаев Сардорбек Рустамович', phone: '+998 90 123 45 67', kycStatus: 'Passed', riskLevel: 'Low', hasConsents: true, hasDocuments: true },
  { id: 'CL-0892', name: 'Каримова Мадина Бахтияровна', phone: '+998 93 987 65 43', kycStatus: 'Pending', riskLevel: 'Medium', hasConsents: true, hasDocuments: true },
  { id: 'CL-0893', name: 'Петров Сергей Николаевич', phone: '+998 97 456 12 34', kycStatus: 'Required', riskLevel: 'High', hasConsents: false, hasDocuments: false }
];

export default function CreateApplicationWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const [calcResults, setCalcResults] = useState<{
    amount: number;
    term: number;
    monthlyPayment: number;
  } | null>(null);

  const activeClient = MOCK_COMPLIANCE_CLIENTS.find((c) => c.id === selectedClientId);

  const checkCompliance = (client: ComplianceClient) => {
    return {
      kycPassed: client.kycStatus === 'Passed',
      amlCleared: client.riskLevel !== 'High',
      consentsSigned: client.hasConsents,
      docsAttached: client.hasDocuments,
    };
  };

  const complianceResults = activeClient ? checkCompliance(activeClient) : null;
  const isClientApprovedForCredit = complianceResults 
    ? complianceResults.kycPassed && complianceResults.amlCleared && complianceResults.consentsSigned && complianceResults.docsAttached
    : false;

  const handleNextStep = () => {
    if (step === 1) {
      if (!selectedClientId) {
        toast.error('Выберите клиента из списка');
        return;
      }
      if (!isClientApprovedForCredit) {
        toast.error('Переход заблокирован: комплаенс-отказ');
        return;
      }
      setStep(2);
    }
  };

  const handleCalculatorChange = (data: any) => {
    setCalcResults({
      amount: data.amount,
      term: data.term,
      monthlyPayment: data.monthlyPayment,
    });
  };

  const handleCreateDraft = () => {
    if (!selectedProductId) {
      toast.error('Выберите кредитный продукт');
      return;
    }
    toast.success('Черновик заявки успешно создан');
    router.push('/applications');
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Шапка */}
        <div className="flex items-center gap-3 border-b pb-4">
          <button onClick={() => step === 2 ? setStep(1) : router.push('/applications')} className="rounded p-1 hover:bg-zinc-100 transition-colors">
            <ArrowLeft className="h-5 w-5 text-zinc-500" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-zinc-950">Новая кредитная заявка</h2>
            <p className="text-xs text-zinc-500">
              Шаг {step} из 2: {step === 1 ? 'Комплаенс-проверка' : 'Выбор кредитного продукта'}
            </p>
          </div>
        </div>

        {/* Индикатор шагов */}
        <div className="flex items-center gap-4 text-xs font-semibold text-zinc-400">
          <span className={`px-2 py-1 rounded ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-zinc-200 text-zinc-600'}`}>1. Выбор клиента</span>
          <ArrowRight className="h-3 w-3" />
          <span className={`px-2 py-1 rounded ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-zinc-200 text-zinc-600'}`}>2. Выбор продукта</span>
        </div>

        {/* ШАГ 1: ВЫБОР И КОМПЛАЕНС КЛИЕНТА */}
        {step === 1 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm md:col-span-2 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2">Выберите клиента для оформления</h3>
              <div>
                <label className="block text-xs font-semibold text-zinc-700">Поиск клиента в базе</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="mt-1.5 block w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white"
                >
                  <option value="">-- Выберите клиента из списка --</option>
                  {MOCK_COMPLIANCE_CLIENTS.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                  ))}
                </select>
              </div>

              {activeClient && (
                <div className="rounded-md bg-zinc-50 p-4 border border-zinc-150 text-sm space-y-2">
                  <div className="font-semibold text-zinc-900">{activeClient.name}</div>
                  <div className="text-xs text-zinc-500">Телефон: {activeClient.phone}</div>
                </div>
              )}
            </div>

            {/* Комплаенс щит */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-zinc-500" /> Комплаенс-контроль
              </h3>

              {!activeClient ? (
                <p className="text-xs text-zinc-500 text-center py-6">Выберите заемщика.</p>
              ) : (
                <div className="space-y-4">
                  <div className={`rounded-md p-3 border text-xs font-bold flex items-center gap-2 ${
                    isClientApprovedForCredit ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'
                  }`}>
                    {isClientApprovedForCredit ? (
                      <><CheckCircle2 className="h-5 w-5 text-green-600" /> Оформление разрешено</>
                    ) : (
                      <><XCircle className="h-5 w-5 text-red-600" /> Отказ комплаенса</>
                    )}
                  </div>

                  <ul className="space-y-3 text-xs">
                    <li className="flex items-center justify-between">
                      <span className="text-zinc-500">KYC Status:</span>
                      <span className="font-bold">{activeClient.kycStatus === 'Passed' ? 'Passed' : 'Pending'}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-zinc-500">AML Risk:</span>
                      <span className="font-bold">{activeClient.riskLevel} Risk</span>
                    </li>
                  </ul>

                  <Button variant="primary" onClick={handleNextStep} disabled={!isClientApprovedForCredit} className="w-full">
                    Далее: Выбор продукта <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ШАГ 2: ВЫБОР ПРОДУКТА */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2">Доступные продукты</h3>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {MOCK_PRODUCTS.map((prod) => {
                const isSelected = selectedProductId === prod.id;
                return (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProductId(prod.id)}
                    className={`rounded-lg border p-6 cursor-pointer shadow-sm transition-all ${
                      isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/10' : 'border-zinc-200 hover:border-indigo-500'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-zinc-900">{prod.name}</h4>
                      <span className="inline-flex items-center rounded bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                        <Percent className="h-3 w-3 mr-0.5" /> {prod.rate}%
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-zinc-500">
                      <div>Сумма: {prod.minAmount.toLocaleString()} - {prod.maxAmount.toLocaleString()} сум</div>
                      <div>Срок: {prod.term} мес.</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedProductId && (
              <div className="mt-6 space-y-4">
                <CreditCalculator 
                  product={MOCK_PRODUCTS.find(p => p.id === selectedProductId)!} 
                  onCalculationChange={handleCalculatorChange}
                />
              </div>
            )}

            <div className="flex justify-end gap-3 border-t pt-4">
              <Button variant="secondary" onClick={() => setStep(1)}>Назад</Button>
              <Button variant="primary" onClick={handleCreateDraft} disabled={!selectedProductId}>Оформить черновик</Button>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
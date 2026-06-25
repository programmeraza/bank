'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, FileText, Landmark } from 'lucide-react';
import KatmVerification from '@/features/katm/components/KatmVerification';
import DebtBurdenCheck from '@/features/debt-burden/components/DebtBurdenCheck';
import DecisionBoard from '@/features/underwriting/components/DecisionBoard';
import IntegrationLogs from '@/features/integrations/components/IntegrationLogs';
import { KatmStatus } from '@/features/katm/types';

// Импорты UI Kit (сохраняя структуру)
import PageTransition from '@/shared/ui/PageTransition';
import Badge from '@/shared/ui/Badge';

export default function ApplicationProcessingPage() {
  const router = useRouter();
  const { id } = useParams();

  const [appStatus, setAppStatus] = useState<'Created' | 'KATM_Check' | 'Review'>('Created');
  const [katmResult, setKatmResult] = useState<'Success' | 'Rejected' | 'Error' | 'Manual_Review' | null>(null);
  const [dbrPassed, setDbrPassed] = useState<boolean>(true);
  const [currentDbr, setCurrentDbr] = useState<number>(0);
  const [finalDecision, setFinalDecision] = useState<'Approved' | 'Rejected' | null>(null);

  const handleKatmVerificationComplete = (status: KatmStatus, score: number) => {
    setKatmResult(status as any);
    if (status === 'Success') {
      setAppStatus('Review');
    }
  };

  const handleDbrComplete = (passed: boolean, dbr: number) => {
    setDbrPassed(passed);
    setCurrentDbr(dbr);
  };

  const handleFinalDecisionComplete = (decision: 'Approved' | 'Rejected') => {
    setFinalDecision(decision);
    if (decision === 'Approved') {
      setAppStatus('Review');
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Шапка заявки */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-5">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/applications')} className="rounded p-1 hover:bg-zinc-100 transition-colors">
              <ArrowLeft className="h-5 w-5 text-zinc-500" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-zinc-950">Обработка кредитной заявки</h2>
              <div className="mt-1 flex flex-wrap gap-2 text-xs font-mono text-zinc-500">
                <span>Заявка ID: {id}</span>
                <span>|</span>
                <span>Клиент ID: CL-0891</span>
              </div>
            </div>
          </div>

          <Badge 
            label={`Конвейер: ${appStatus === 'Created' ? 'Первичная обработка' : 'Принятие решения'}`} 
            variant="info" 
          />
        </div>

        {/* Сетка Спринта 3 в оригинальном виде */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-zinc-500" /> Сводка параметров кредита
              </h3>
              
              <div className="text-xs space-y-3">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Клиент:</span>
                  <span className="font-semibold text-zinc-900">Абдуллаев Сардорбек</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Продукт:</span>
                  <span className="font-semibold text-zinc-900">Микрозайм Экспресс</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Сумма кредита:</span>
                  <span className="font-bold text-indigo-600">15 000 000 сум</span>
                </div>
              </div>

              {finalDecision === 'Approved' && (
                <button
                  onClick={() => router.push(`/applications/${id}/contract`)}
                  className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-green-500 transition-colors"
                >
                  <Landmark className="h-4 w-4" /> Оформить договор и график
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <KatmVerification 
              clientId="CL-0891" 
              clientName="Абдуллаев Сардорбек Рустамович" 
              pinfl="31204953940129"
              onVerificationComplete={handleKatmVerificationComplete}
            />

            <DebtBurdenCheck 
              clientIncome={12000000}
              newMonthlyPayment={1500000}
              onValidationComplete={handleDbrComplete}
            />

            <DecisionBoard 
              katmStatus={katmResult}
              dbrPassed={dbrPassed}
              dbrRatio={currentDbr}
              proposedAmount={15000000}
              proposedTerm={12}
              onDecisionFinalized={handleFinalDecisionComplete}
            />
          </div>
        </div>

        <IntegrationLogs />
      </div>
    </PageTransition>
  );
}
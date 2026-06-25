'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, ShieldCheck, User, UserCheck, Award, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

// Импорты UI Kit (сохраняя исходный макет)
import PageTransition from '@/shared/ui/PageTransition';
import Button from '@/shared/ui/Button';
import Badge from '@/shared/ui/Badge';

export default function UnderwritingWorkspacePage() {
  const router = useRouter();
  const { id } = useParams();

  const [makerStatus] = useState<boolean>(true);
  const [checkerStatus, setVerifierStatus] = useState<boolean>(false);
  const [approverStatus, setApproverStatus] = useState<boolean>(false);

  const handleCheckerVerify = () => {
    setVerifierStatus(true);
    toast.success('Стадия [Checker] пройдена: Риск-анализ подтвержден');
  };

  const handleApproverApprove = () => {
    setApproverStatus(true);
    toast.success('Стадия [Approver] пройдена: Сделка окончательно утверждена');
  };

  const handleFinalSubmit = () => {
    toast.success('Кредитное решение зафиксировано в реестре');
    router.push('/applications');
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Шапка */}
        <div className="flex items-center gap-3 border-b pb-4">
          <button onClick={() => router.back()} className="rounded p-1 hover:bg-zinc-100 transition-colors">
            <ArrowLeft className="h-5 w-5 text-zinc-500" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-zinc-950">Рабочее место Maker/Checker</h2>
            <p className="text-xs text-zinc-500">Авторизация кредитного решения по заявке № {id} на основе ролей доступа.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Контрольные Точки */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm md:col-span-2 space-y-6">
            <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-indigo-500" /> Сквозная авторизация сделки
            </h3>

            <div className="space-y-6">
              {/* Этап 1: Maker */}
              <div className="flex items-start gap-4 p-4 rounded-lg border bg-green-50/50 border-green-200">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                  <User className="h-4 w-4" />
                </span>
                <div className="text-xs flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-900">Этап 1: Maker (Подготовка заявки)</span>
                    <Badge label="Подготовлено" variant="success" />
                  </div>
                  <p className="text-zinc-500 mt-1">Оператор собрал досье клиента, загрузил документы и проверил анкету.</p>
                  <div className="mt-2 text-[10px] text-zinc-400">Исполнитель: Дмитрий Иванов (Operator)</div>
                </div>
              </div>

              {/* Этап 2: Checker */}
              <div className={`flex items-start gap-4 p-4 rounded-lg border ${checkerStatus ? 'bg-green-50/50 border-green-200' : 'bg-zinc-50 border-zinc-200'}`}>
                <span className={`flex h-8 w-8 items-center justify-center rounded-full ${checkerStatus ? 'bg-green-500 text-white' : 'bg-zinc-200 text-zinc-600'}`}>
                  <UserCheck className="h-4 w-4" />
                </span>
                <div className="text-xs flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-900">Этап 2: Checker (Проверка комплаенс рисков)</span>
                    <Badge label={checkerStatus ? 'Проверено' : 'Ожидает проверки'} variant={checkerStatus ? 'success' : 'warning'} />
                  </div>
                  <p className="text-zinc-500 mt-1">Риск-аналитик производит аудит расчета DBR, логов КАТМ и комплаенс ограничений.</p>
                  
                  {!checkerStatus ? (
                    <Button variant="primary" onClick={handleCheckerVerify} className="mt-3 text-[10px] py-1.5 px-3">
                      Подтвердить и согласовать риски
                    </Button>
                  ) : (
                    <div className="mt-2 text-[10px] text-zinc-400">Исполнитель: Ольга Кузнецова (Manager)</div>
                  )}
                </div>
              </div>

              {/* Этап 3: Approver */}
              <div className={`flex items-start gap-4 p-4 rounded-lg border ${approverStatus ? 'bg-green-50/50 border-green-200' : 'bg-zinc-50 border-zinc-200'}`}>
                <span className={`flex h-8 w-8 items-center justify-center rounded-full ${approverStatus ? 'bg-green-500 text-white' : 'bg-zinc-200 text-zinc-600'}`}>
                  <Award className="h-4 w-4" />
                </span>
                <div className="text-xs flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-900">Этап 3: Approver (Утверждение Комитетом)</span>
                    <Badge label={approverStatus ? 'Утверждено' : 'Ожидает'} variant={approverStatus ? 'success' : 'neutral'} />
                  </div>
                  <p className="text-zinc-500 mt-1">Финальное подписание лимитов кредитования со стороны Председателя кредитного комитета.</p>
                  
                  {checkerStatus && !approverStatus && (
                    <Button variant="primary" onClick={handleApproverApprove} className="mt-3 text-[10px] py-1.5 px-3 bg-green-600 hover:bg-green-500">
                      Вынести окончательное одобрение
                    </Button>
                  )}
                  {approverStatus && (
                    <div className="mt-2 text-[10px] text-zinc-400">Исполнитель: Председатель кредитного комитета</div>
                  )}
                </div>
              </div>
            </div>

            <Button variant="primary" disabled={!approverStatus} onClick={handleFinalSubmit} className="w-full mt-4">
              Зафиксировать решение Maker/Checker
            </Button>
          </div>

          {/* Правая сводная панель */}
          <div className="space-y-6">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4 text-xs">
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5 text-zinc-500" /> Сводка комплаенс скоринга
              </h3>
              <div className="space-y-2.5 font-medium">
                <div className="flex justify-between"><span>Рейтинг заемщика:</span><span className="font-bold text-green-700">Класс A</span></div>
                <div className="flex justify-between"><span>Долговая нагрузка DBR:</span><span className="font-bold text-zinc-900">33.3%</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
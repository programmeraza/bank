'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Cpu, Database, CheckCircle2, XCircle, AlertTriangle, Terminal } from 'lucide-react';
import toast from 'react-hot-toast';
import { KatmStatus, KatmLogEntry } from '../types';

interface KatmVerificationProps {
  clientId: string;
  clientName: string;
  pinfl: string;
  onVerificationComplete?: (status: KatmStatus, score: number) => void;
}

export default function KatmVerification({
  clientId,
  clientName,
  pinfl,
  onVerificationComplete,
}: KatmVerificationProps) {
  // Симуляция наличия согласия (тумблер для тестов)
  const [hasConsent, setHasConsent] = useState<boolean>(true);
  
  // Состояния запроса
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheckResult, setLastCheckResult] = useState<KatmStatus | null>(null);
  const [katmLogs, setKatmLogs] = useState<KatmLogEntry | null>(null);
  const [showRawLogs, setShowRawLogs] = useState(false);

  const handleRunKatmCheck = async () => {
    // ШАГ 5: Жесткая проверка наличия согласия перед KATM
    if (!hasConsent) {
      toast.error('Доступ заблокирован: отсутствует действующее согласие клиента');
      return;
    }

    setIsLoading(true);
    setLastCheckResult(null);
    setKatmLogs(null);

    try {
      // Имитируем сетевую задержку интеграционного шлюза КАТМ
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Генерация случайного статуса ответа шлюза для тестов
      const statuses: KatmStatus[] = ['Success', 'Rejected', 'Manual_Review'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      const mockReqId = `KATM-REQ-${Math.floor(100000 + Math.random() * 900000)}`;
      const mockScore = randomStatus === 'Success' ? 720 : randomStatus === 'Rejected' ? 450 : 580;

      // Мокаем JSON-логи обмена
      const requestJSON = JSON.stringify({
        header: { sender: 'PLATFORM_PRO', requestId: mockReqId, timestamp: new Date().toISOString() },
        body: { clientPinfl: pinfl, clientId, checkType: 'FULL_CREDIT_HISTORY' }
      }, null, 2);

      const responseJSON = JSON.stringify({
        header: { responseId: `RESP-${mockReqId.slice(5)}`, status: 'PROCESSED' },
        body: {
          clientName,
          scoringClass: randomStatus === 'Success' ? 'A' : randomStatus === 'Rejected' ? 'E' : 'C',
          scoringPoints: mockScore,
          activeLoansCount: randomStatus === 'Rejected' ? 5 : 1,
          totalArrearsSum: randomStatus === 'Rejected' ? 14500000 : 0,
          recommendation: randomStatus === 'Success' ? 'APPROVE' : randomStatus === 'Rejected' ? 'REJECT' : 'MANUAL_REVIEW'
        }
      }, null, 2);

      setLastCheckResult(randomStatus);
      setKatmLogs({
        requestId: mockReqId,
        timestamp: new Date().toLocaleTimeString('ru-RU'),
        status: randomStatus,
        requestPayload: requestJSON,
        responsePayload: responseJSON,
      });

      if (onVerificationComplete) {
        onVerificationComplete(randomStatus, mockScore);
      }

      if (randomStatus === 'Success') {
        toast.success('Скоринг КАТМ пройден: Клиент одобрен');
      } else if (randomStatus === 'Rejected') {
        toast.error('Отказ КАТМ: Обнаружена просроченная задолженность');
      } else {
        toast('Предупреждение КАТМ: Требуется ручная проверка документов', { icon: '⚠️' });
      }

    } catch (e) {
      toast.error('Ошибка интеграционного шлюза КАТМ/GRCI');
      setLastCheckResult('Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
      {/* Шапка */}
      <div className="flex items-center justify-between border-b pb-3">
        <h4 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
          <Database className="h-4 w-4 text-indigo-500" /> Интеграционный шлюз Mock КАТМ / GRCI
        </h4>
        
        {/* Тестовый тумблер согласий */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Наличие согласия:</span>
          <button
            onClick={() => setHasConsent(!hasConsent)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              hasConsent ? 'bg-indigo-600' : 'bg-zinc-200'
            }`}
          >
            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              hasConsent ? 'translate-x-4' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* ШАГ 5: Предупреждение об отсутствии согласий */}
      {!hasConsent && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-xs text-red-800 flex items-start gap-2.5">
          <ShieldAlert className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
          <div>
            <span className="font-bold">КАТМ ЗАБЛОКИРОВАН:</span> Отсутствует или отозвано действующее согласие клиента на проверку кредитной истории. Отправка запроса невозможна.
          </div>
        </div>
      )}

      {/* Кнопка запуска проверки КАТМ */}
      <div className="flex gap-3 items-center">
        <button
          onClick={handleRunKatmCheck}
          disabled={isLoading || !hasConsent}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:bg-zinc-150 disabled:text-zinc-400"
        >
          <Cpu className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Запрос в кредитное бюро...' : 'Выполнить скоринг КАТМ'}
        </button>

        {katmLogs && (
          <button
            onClick={() => setShowRawLogs(!showRawLogs)}
            className="inline-flex items-center gap-1.5 rounded border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            <Terminal className="h-3.5 w-3.5 text-zinc-500" />
            {showRawLogs ? 'Скрыть логи шлюза' : 'Показать сырые логи'}
          </button>
        )}
      </div>

      {/* ШАГ 6: Статус и графическое отображение решения скоринга */}
      {lastCheckResult && (
        <div className="pt-2">
          <div className={`rounded-md border p-4 text-xs space-y-2 ${
            lastCheckResult === 'Success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : lastCheckResult === 'Rejected'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {lastCheckResult === 'Success' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              {lastCheckResult === 'Rejected' && <XCircle className="h-5 w-5 text-red-600" />}
              {lastCheckResult === 'Manual_Review' && <AlertTriangle className="h-5 w-5 text-amber-600" />}
              
              Решение КАТМ: {
                lastCheckResult === 'Success' ? 'ОДОБРЕНО (Scoring Clear)' : 
                lastCheckResult === 'Rejected' ? 'ОТКЛОНЕНО (High Debt Risk)' : 'РУЧНАЯ ПРОВЕРКА'
              }
            </div>
            <p className="text-zinc-600">
              {lastCheckResult === 'Success' && 'У клиента чистая кредитная история. Активных просрочек не обнаружено.'}
              {lastCheckResult === 'Rejected' && 'Внимание! Обнаружена просроченная задолженность свыше 30 дней. Лимит кредитования заблокирован.'}
              {lastCheckResult === 'Manual_Review' && 'Рекомендуется ручной анализ: обнаружены закрытые кредиты с техническими задержками.'}
            </p>
          </div>
        </div>
      )}

      {/* Логи шлюза (JSON Request / Response) */}
      {showRawLogs && katmLogs && (
        <div className="rounded-lg bg-zinc-950 p-4 border border-zinc-800 font-mono text-[10px] text-zinc-300 space-y-4 overflow-x-auto">
          <div>
            <span className="text-zinc-500 block mb-1">// REQUEST PAYLOAD (POST /api/v1/katm/scoring)</span>
            <pre className="text-indigo-400">{katmLogs.requestPayload}</pre>
          </div>
          <div className="border-t border-zinc-800 pt-3">
            <span className="text-zinc-500 block mb-1">// RESPONSE PAYLOAD (200 OK)</span>
            <pre className="text-green-400">{katmLogs.responsePayload}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
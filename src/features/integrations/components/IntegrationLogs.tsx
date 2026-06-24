'use client';

import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, ArrowRightLeft } from 'lucide-react';

interface LogMessage {
  id: string;
  time: string;
  source: string;
  target: string;
  event: string;
  status: 'success' | 'warning' | 'info';
  details: string;
}

export default function IntegrationLogs() {
  const [isOpen, setIsOpen] = useState(true);

  // Имитируем системные логи обмена информацией
  const MOCK_INTEGRATION_LOGS: LogMessage[] = [
    {
      id: 'log-1',
      time: '15.01.2025, 11:15:02',
      source: 'CORE_FRONTEND',
      target: 'CORE_BACKEND',
      event: 'CREATE_APPLICATION_DRAFT',
      status: 'success',
      details: 'Создан черновик кредитной заявки APP-1025. Клиент: Абдуллаев С., Продукт: Микрозайм Экспресс.',
    },
    {
      id: 'log-2',
      time: '15.01.2025, 11:16:10',
      source: 'CORE_BACKEND',
      target: 'IDENTITY_SERVICE',
      event: 'COMPLIANCE_KYC_AML_CHECK',
      status: 'success',
      details: 'Запрос на экспресс-верификацию KYC/AML. Вердикт: PASSED. Запрещающих факторов не найдено.',
    },
    {
      id: 'log-3',
      time: '15.01.2025, 11:20:45',
      source: 'GATEWAY_API',
      target: 'KATM_CREDIT_BUREAU',
      event: 'SEND_SCORING_REQUEST',
      status: 'success',
      details: 'Запрос КАТМ-Scoring по ПИНФЛ 31204953940129. Запрос отправлен успешно с Request-ID: KATM-REQ-9821.',
    },
    {
      id: 'log-4',
      time: '15.01.2025, 11:21:05',
      source: 'KATM_CREDIT_BUREAU',
      target: 'GATEWAY_API',
      event: 'RECEIVE_SCORING_RESPONSE',
      status: 'success',
      details: 'Получен ответ КАТМ. Кредитный рейтинг скоринга: 720 (Класс A). Действующих просрочек нет.',
    },
    {
      id: 'log-5',
      time: '15.01.2025, 11:22:15',
      source: 'DECISION_ENGINE',
      target: 'DATABASE',
      event: 'CALCULATE_DEBT_BURDEN',
      status: 'warning',
      details: 'Внимание! Рассчитан показатель DBR (Debt Burden Ratio): 33.3%. Уровень риска классифицирован как Low.',
    },
    {
      id: 'log-6',
      time: '15.01.2025, 11:25:30',
      source: 'CREDIT_COMMITTEE',
      target: 'CORE_BACKEND',
      event: 'FINALIZE_UNDERWRITING_DECISION',
      status: 'success',
      details: 'Решение по заявке вынесено: APPROVED. Лимит финансирования установлен: 15,000,000 сум.',
    },
  ];

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 overflow-hidden shadow-lg font-mono text-xs">
      {/* Кнопка сворачивания */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-zinc-900 px-6 py-3 border-b border-zinc-800 flex justify-between items-center cursor-pointer select-none"
      >
        <div className="flex items-center gap-2 text-zinc-100">
          <Terminal className="h-4 w-4 text-indigo-400" />
          <span className="font-bold tracking-wide">Журнал интеграционных событий (Syslog)</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-zinc-500">
          <span>Всего логов: {MOCK_INTEGRATION_LOGS.length}</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </div>

      {/* Список логов */}
      {isOpen && (
        <div className="p-6 space-y-3 max-h-72 overflow-y-auto divide-y divide-zinc-900">
          {MOCK_INTEGRATION_LOGS.map((log) => (
            <div key={log.id} className="pt-3 first:pt-0 flex flex-col md:flex-row md:items-start gap-3">
              {/* Время */}
              <span className="text-zinc-600 text-[10px] whitespace-nowrap md:pt-0.5">{log.time}</span>

              {/* Маршрут обмена */}
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-indigo-400 bg-zinc-900 px-2 py-0.5 rounded w-fit shrink-0">
                <span>{log.source}</span>
                <ArrowRightLeft className="h-2.5 w-2.5 text-zinc-600" />
                <span>{log.target}</span>
              </div>

              {/* Событие */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-zinc-200 text-[11px]">
                  {log.status === 'success' ? (
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  )}
                  {log.event}
                </div>
                <p className="text-zinc-400 leading-relaxed text-[11px]">{log.details}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
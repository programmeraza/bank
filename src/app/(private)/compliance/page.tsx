'use client';

import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, ShieldX, Key } from 'lucide-react';

export default function CompliancePage() {
    const [kycStats] = useState({ pending: 14, approved: 1240, rejected: 12 });

    const [amlFlags] = useState([
        { id: '1', client: 'Петров С.Н.', reason: 'Превышение лимита долговой нагрузки (DTI 71%)', severity: 'High' },
        { id: '2', client: 'Юсупова Ф.А.', reason: 'Выход на критическую просрочку NPL (95 дней)', severity: 'High' },
    ]);

    return (
        <div className="space-y-6">
            {/* Шапка */}
            <div className="border-b pb-4">
                <h2 className="text-xl font-bold text-zinc-950">Панель контроля комплаенса и рисков</h2>
                <p className="text-xs text-zinc-500">Контроль первичных верификаций, подозрительных операций и истекающих юридических согласий.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Блок 1. Мониторинг KYC */}
                <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                        <ShieldCheck className="h-4.5 w-4.5 text-zinc-500" /> Верификация анкет (KYC)
                    </h3>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-blue-50 p-2.5 rounded border border-blue-200 text-blue-800 font-semibold">
                            <span>Ожидают</span>
                            <p className="text-lg font-bold mt-1">{kycStats.pending}</p>
                        </div>
                        <div className="bg-green-50 p-2.5 rounded border border-green-200 text-green-800 font-semibold">
                            <span>Одобрены</span>
                            <p className="text-lg font-bold mt-1">{kycStats.approved}</p>
                        </div>
                        <div className="bg-red-50 p-2.5 rounded border border-red-200 text-red-800 font-semibold">
                            <span>Отказы</span>
                            <p className="text-lg font-bold mt-1">{kycStats.rejected}</p>
                        </div>
                    </div>
                </div>

                {/* Блок 2. Мониторинг AML */}
                <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4.5 w-4.5 text-zinc-500" /> Подозрительные финансовые инциденты (AML)
                    </h3>
                    <div className="divide-y divide-zinc-100 text-xs">
                        {amlFlags.map((flag) => (
                            <div key={flag.id} className="py-2.5 flex justify-between items-center">
                                <div>
                                    <span className="font-bold text-zinc-900 block">{flag.client}</span>
                                    <span className="text-zinc-500 block text-[10px] mt-0.5">{flag.reason}</span>
                                </div>
                                <span className="inline-flex items-center rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[10px] font-bold text-red-700 uppercase">
                                    {flag.severity} RISK
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
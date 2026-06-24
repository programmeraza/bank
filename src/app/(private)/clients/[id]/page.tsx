'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, User, MapPin, Briefcase, FileText, 
  ShieldCheck, Activity, Download, Eye, CheckCircle2, 
  XCircle, AlertTriangle, Calendar, Clock, X
} from 'lucide-react';
import toast from 'react-hot-toast';

// Импорты разработанных нами модулей
import DocumentUploader from '@/features/documents/components/DocumentUploader';
import DocumentPreviewModal from '@/features/documents/components/DocumentPreviewModal';
import SensitiveField from '@/features/clients/components/SensitiveField';
import ComplianceWidget from '@/features/compliance/components/ComplianceWidget';

// --- ОПИСАНИЕ ТИПОВ ДАННЫХ ---
interface ClientDoc {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: 'Verified' | 'Pending' | 'Rejected';
}

interface ClientConsent {
  id: string;
  title: string;
  status: 'Signed' | 'Revoked' | 'Required';
  signedAt?: string;
  version: string;
  isRequired: boolean;
}

interface HistoryItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  type: 'create' | 'update' | 'kyc' | 'consent';
}

// --- СТАТИЧЕСКИЕ ДЕМОНСТРАЦИОННЫЕ ДАННЫЕ (Объявлены на уровне модуля) ---
const MOCK_CLIENT_DETAIL = {
  id: 'CL-0891',
  name: 'Абдуллаев Сардорбек Рустамович',
  phone: '+998 90 123 45 67',
  email: 's.abdullaev@mail.uz',
  pinfl: '31204953940129',     
  passport: 'FA1029485', 
  birthDate: '12.04.1995',
  branchName: 'Центральный офис',
  managerName: 'Иван Иванов',
  createdAt: '15.01.2025',
  income: 12000000,
  jobTitle: 'Старший разработчик',
  citizenship: 'Узбекистан',
  address: {
    country: 'Узбекистан',
    region: 'Ташкентская область',
    city: 'г. Ташкент',
    street: 'ул. Амира Темура, д. 45, кв. 12'
  }
};

const MOCK_DOCUMENTS: ClientDoc[] = [
  { id: 'doc-1', name: 'Паспорт_основной.pdf', type: 'PDF', size: '2.4 MB', uploadedAt: '15.01.2025, 11:20', status: 'Verified' },
  { id: 'doc-2', name: 'Справка_о_доходах_2024.jpeg', type: 'JPEG', size: '1.8 MB', uploadedAt: '15.01.2025, 11:25', status: 'Verified' },
];

const MOCK_CONSENTS: ClientConsent[] = [
  { id: 'con-1', title: 'Согласие на обработку персональных данных', status: 'Signed', signedAt: '15.01.2025, 11:15', version: 'v1.2', isRequired: true },
  { id: 'con-2', title: 'Согласие на запрос данных в Кредитное бюро (ККИ)', status: 'Signed', signedAt: '15.01.2025, 11:15', version: 'v2.0', isRequired: true },
  { id: 'con-3', title: 'Согласие на получение рекламных рассылок', status: 'Required', version: 'v1.0', isRequired: false },
];

const MOCK_HISTORY: HistoryItem[] = [
  { id: 'h-1', timestamp: '15.01.2025, 11:15', user: 'Иван Иванов (Admin)', action: 'Регистрация клиента в системе', type: 'create' },
  { id: 'h-2', timestamp: '15.01.2025, 11:20', user: 'Иван Иванов (Admin)', action: 'Загрузка документа Паспорт_основной.pdf', type: 'update' },
  { id: 'h-3', timestamp: '15.01.2025, 11:30', user: 'Система Комплаенса', action: 'Прохождение автоматической проверки KYC: Статус PASSED', type: 'kyc' },
];

// --- ГЛАВНЫЙ КОМПОНЕНТ СТРАНИЦЫ ---
export default function ClientDetailsPage() {
  const router = useRouter();
  const { id } = useParams();

  // ==========================================
  // ВСЕ ХУКИ СОСТОЯНИЯ ОБЪЯВЛЕНЫ СТРОГО ВНУТРИ ТЕЛА
  // ==========================================
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'consents' | 'history'>('overview');
  const [documents, setDocuments] = useState<ClientDoc[]>(MOCK_DOCUMENTS);
  const [consents, setConsents] = useState<ClientConsent[]>(MOCK_CONSENTS);
  const [history, setHistory] = useState<HistoryItem[]>(MOCK_HISTORY);
  const [commentText, setCommentText] = useState('');
  
  // Комплаенс-состояния
  const [kycStatus, setKycStatus] = useState<'Passed' | 'Failed' | 'Pending' | 'Required'>('Passed');
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Medium' | 'High'>('Low');

  // Состояние предпросмотра файлов
  const [previewData, setPreviewData] = useState<{ isOpen: boolean; name: string; url: string; type: string }>({
    isOpen: false,
    name: '',
    url: '',
    type: ''
  });

  const client = MOCK_CLIENT_DETAIL;

  // --- БИЗНЕС-ЛОГИКА И ОБРАБОТЧИКИ СОБЫТИЙ ---

  // Динамический расчет статуса блокировки клиента на основе согласий
  const isAnyRequiredConsentMissing = consents.some(
    (c) => c.isRequired && c.status !== 'Signed'
  );
  const currentClientStatus = isAnyRequiredConsentMissing ? 'Blocked' : 'Active';

  // Обработчик комплаенс виджета
  const handleComplianceUpdate = (newKyc: string, newRisk: string) => {
    setKycStatus(newKyc as any);
    setRiskLevel(newRisk as any);
  };

  // Добавление документа
  const handleAddDocument = (fileData: { name: string; size: string; type: string; url: string }) => {
    const newDoc: ClientDoc = {
      id: Math.random().toString(),
      name: fileData.name,
      type: fileData.type,
      size: fileData.size,
      uploadedAt: new Date().toLocaleString('ru-RU', { hour12: false }).slice(0, -3),
      status: 'Pending',
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  // Удаление документа
  const handleDeleteDocument = (docId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот документ?')) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
      toast.success('Документ удален');
    }
  };

  // Скачивание документа
  const handleDownloadDoc = (docName: string) => {
    toast.success(`Скачивание файла: ${docName}`);
  };

  // Открытие предпросмотра
  const handleOpenPreview = (doc: ClientDoc) => {
    setPreviewData({
      isOpen: true,
      name: doc.name,
      url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=1000',
      type: doc.type,
    });
  };

  // Подписание согласия
  const handleSignConsent = (consentId: string) => {
    setConsents((prev) =>
      prev.map((c) =>
        c.id === consentId
          ? {
              ...c,
              status: 'Signed',
              signedAt: new Date().toLocaleString('ru-RU', { hour12: false }).slice(0, -3),
            }
          : c
      )
    );
    toast.success('Согласие подписано');
  };

  // Отзыв согласия
  const handleRevokeConsent = (consentId: string) => {
    setConsents((prev) =>
      prev.map((c) =>
        c.id === consentId
          ? {
              ...c,
              status: 'Revoked',
              signedAt: undefined,
            }
          : c
      )
    );
    
    const consent = consents.find(c => c.id === consentId);
    if (consent?.isRequired) {
      toast.error('Отозвано обязательное согласие! Операции заблокированы.');
    } else {
      toast.success('Согласие отозвано');
    }
  };

  // Добавление комментария в историю
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: HistoryItem = {
      id: Math.random().toString(),
      timestamp: new Date().toLocaleString('ru-RU', { hour12: false }).slice(0, -3),
      user: 'Иван Иванов (Admin)',
      action: `Оставлен системный комментарий: "${commentText}"`,
      type: 'update',
    };

    setHistory((prev) => [newComment, ...prev]);
    setCommentText('');
    toast.success('Комментарий сохранен');
  };

  const tabs = [
    { id: 'overview', name: 'Обзор', icon: User },
    { id: 'documents', name: 'Документы', icon: FileText },
    { id: 'consents', name: 'Согласия', icon: ShieldCheck },
    { id: 'history', name: 'История', icon: Activity },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Шапка карточки */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/clients')}
            className="rounded p-1 hover:bg-zinc-100 transition-colors"
            title="Назад к списку"
          >
            <ArrowLeft className="h-5 w-5 text-zinc-500" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-zinc-950">{client.name}</h2>
            <div className="mt-1 flex flex-wrap gap-2 text-xs">
              <span className="font-mono text-zinc-500">ID: {id}</span>
              <span className="text-zinc-300">|</span>
              <span className="text-zinc-500">Филиал: {client.branchName}</span>
            </div>
          </div>
        </div>

        {/* Сводные системные комплаенс-бейджи */}
        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
            currentClientStatus === 'Blocked'
              ? 'bg-red-50 text-red-700 ring-red-600/20'
              : 'bg-green-50 text-green-700 ring-green-600/20'
          }`}>
            Статус: {currentClientStatus === 'Blocked' ? 'Blocked' : 'Active'}
          </span>
          <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
            kycStatus === 'Passed'
              ? 'bg-green-50 text-green-700 ring-green-600/20'
              : 'bg-red-50 text-red-700 ring-red-600/20'
          }`}>
            KYC: {kycStatus}
          </span>
          <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
            riskLevel === 'High'
              ? 'bg-red-50 text-red-700 ring-red-600/20'
              : riskLevel === 'Medium'
              ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
              : 'bg-green-50 text-green-700 ring-green-600/20'
          }`}>
            AML: {riskLevel} Risk
          </span>
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

      {/* Содержимое вкладок */}
      <div className="mt-6">
        {/* ВКЛАДКА 1: ОБЗОР */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm md:col-span-2 space-y-6">
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2">Анкетные данные клиента</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <span className="text-xs text-zinc-500 block">ФИО клиента</span>
                  <span className="font-semibold text-zinc-900 block mt-0.5">{client.name}</span>
                </div>
                <div>
                  <span className="text-xs text-zinc-500 block">Номер телефона</span>
                  <span className="block mt-0.5">
                    <SensitiveField value={client.phone} type="phone" />
                  </span>
                </div>
                <div>
                  <span className="text-xs text-zinc-500 block">Электронная почта</span>
                  <span className="font-medium text-zinc-900 block mt-0.5">{client.email}</span>
                </div>
                <div>
                  <span className="text-xs text-zinc-500 block">Дата рождения</span>
                  <span className="font-medium text-zinc-900 block mt-0.5">{client.birthDate}</span>
                </div>
                <div>
                  <span className="text-xs text-zinc-500 block">ПИНФЛ</span>
                  <span className="block mt-0.5">
                    <SensitiveField value={client.pinfl} type="pinfl" />
                  </span>
                </div>
                <div>
                  <span className="text-xs text-zinc-500 block">Номер паспорта</span>
                  <span className="block mt-0.5">
                    <SensitiveField value={client.passport} type="passport" />
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 pt-2">Адрес регистрации</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <span className="text-xs text-zinc-500 block">Страна</span>
                  <span className="font-medium text-zinc-900 block mt-0.5">{client.address.country}</span>
                </div>
                <div>
                  <span className="text-xs text-zinc-500 block">Область / Регион</span>
                  <span className="font-medium text-zinc-900 block mt-0.5">{client.address.region}</span>
                </div>
                <div>
                  <span className="text-xs text-zinc-500 block">Город / Район</span>
                  <span className="font-medium text-zinc-900 block mt-0.5">{client.address.city}</span>
                </div>
                <div>
                  <span className="text-xs text-zinc-500 block">Адрес проживания</span>
                  <span className="font-medium text-zinc-900 block mt-0.5">{client.address.street}</span>
                </div>
              </div>
            </div>

            {/* Боковая колонка обзора */}
            <div className="space-y-6">
              <ComplianceWidget 
                initialKycStatus={kycStatus} 
                initialRiskLevel={riskLevel} 
                onUpdate={handleComplianceUpdate}
              />

              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
                <h4 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-zinc-500" /> Занятость и финансы
                </h4>
                <div className="text-sm space-y-3">
                  <div>
                    <span className="text-xs text-zinc-500 block">Сфера / Должность</span>
                    <span className="font-semibold text-zinc-900 block mt-0.5">{client.jobTitle}</span>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 block">Задекларированный доход</span>
                    <span className="block mt-0.5 text-indigo-600 font-semibold">
                      <SensitiveField value={client.income} type="income" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ВКЛАДКА 2: ДОКУМЕНТЫ */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 mb-4">Загрузить новый документ</h3>
              <DocumentUploader onFileUploaded={handleAddDocument} />
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-zinc-700">Название файла</th>
                    <th className="px-6 py-3 font-semibold text-zinc-700">Формат</th>
                    <th className="px-6 py-3 font-semibold text-zinc-700">Размер</th>
                    <th className="px-6 py-3 font-semibold text-zinc-700">Дата загрузки</th>
                    <th className="px-6 py-3 font-semibold text-zinc-700">Статус</th>
                    <th className="px-6 py-3 text-right font-semibold text-zinc-700">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {documents.length > 0 ? (
                    documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-zinc-50/50">
                        <td className="px-6 py-4 font-medium text-zinc-900 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-zinc-400" />
                          {doc.name}
                        </td>
                        <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{doc.type}</td>
                        <td className="px-6 py-4 text-zinc-500 text-xs">{doc.size}</td>
                        <td className="px-6 py-4 text-zinc-500 text-xs">{doc.uploadedAt}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                            doc.status === 'Verified' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => handleOpenPreview(doc)} className="text-zinc-400 hover:text-indigo-600"><Eye className="h-4 w-4" /></button>
                          <button onClick={() => handleDownloadDoc(doc.name)} className="text-zinc-400 hover:text-indigo-600"><Download className="h-4 w-4" /></button>
                          <button onClick={() => handleDeleteDocument(doc.id)} className="text-zinc-400 hover:text-red-600"><X className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">Список пуст.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <DocumentPreviewModal
              isOpen={previewData.isOpen}
              onClose={() => setPreviewData((prev) => ({ ...prev, isOpen: false }))}
              fileName={previewData.name}
              fileUrl={previewData.url}
              fileType={previewData.type}
            />
          </div>
        )}

        {/* ВКЛАДКА 3: СОГЛАСИЯ */}
        {activeTab === 'consents' && (
          <div className="rounded-lg border border-zinc-200 bg-white shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-6 py-3 font-semibold text-zinc-700">Тип согласия</th>
                  <th className="px-6 py-3 font-semibold text-zinc-700">Версия</th>
                  <th className="px-6 py-3 font-semibold text-zinc-700">Обязательное</th>
                  <th className="px-6 py-3 font-semibold text-zinc-700">Статус</th>
                  <th className="px-6 py-3 text-right font-semibold text-zinc-700">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {consents.map((consent) => (
                  <tr key={consent.id} className="hover:bg-zinc-50/50">
                    <td className="px-6 py-4 font-medium text-zinc-900">{consent.title}</td>
                    <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{consent.version}</td>
                    <td className="px-6 py-4">
                      {consent.isRequired ? (
                        <span className="text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded text-xs">Да</span>
                      ) : (
                        <span className="text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded text-xs">Нет</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        consent.status === 'Signed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {consent.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {consent.status !== 'Signed' ? (
                        <button onClick={() => handleSignConsent(consent.id)} className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1.5 rounded hover:bg-indigo-100">Подписать</button>
                      ) : (
                        <button onClick={() => handleRevokeConsent(consent.id)} className="text-xs bg-red-50 text-red-600 px-2.5 py-1.5 rounded hover:bg-red-100">Отозвать</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ВКЛАДКА 4: ИСТОРИЯ */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 mb-4">Добавить комментарий / примечание</h3>
              <form onSubmit={handleAddComment} className="flex gap-3">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Введите комментарий..."
                  className="flex-1 rounded border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-indigo-500">Опубликовать</button>
              </form>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flow-root">
                <ul className="-mb-8">
                  {history.map((item, index) => (
                    <li key={item.id}>
                      <div className="relative pb-8">
                        {index !== history.length - 1 && (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-zinc-200" />
                        )}
                        <div className="relative flex space-x-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 ring-8 ring-white">
                            <Clock className="h-4 w-4" />
                          </span>
                          <div className="flex-1 min-w-0 pt-1.5">
                            <p className="text-sm text-zinc-800 font-medium">{item.action}</p>
                            <div className="mt-1 flex justify-between text-xs text-zinc-500">
                              <span>Автор: {item.user}</span>
                              <time>{item.timestamp}</time>
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
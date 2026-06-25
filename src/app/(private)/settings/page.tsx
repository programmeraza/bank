'use client';

import React, { useState } from 'react';
import { Globe, Sun, Moon, Laptop, Bell, Shield, Save } from 'lucide-react';
import toast from 'react-hot-toast';

// Импорты UI Kit ABU BANK
import PageTransition from '@/shared/ui/PageTransition';
import Card from '@/shared/ui/Card';
import Button from '@/shared/ui/Button';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  // Настройки интерфейса
  const [language, setLanguage] = useState<'ru' | 'uz' | 'en'>('ru');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

  // Настройки безопасности и уведомлений
  const [emailNotify, setEmailNotify] = useState(true);
  const [smsNotify, setSmsNotify] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('15');

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Настройки системы успешно сохранены');
    } catch (e) {
      toast.error('Ошибка сохранения настроек');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Шапка */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-bold text-zinc-950">Настройки платформы</h2>
          <p className="text-xs text-zinc-500">Персонализация рабочего пространства, языковые пакеты и параметры безопасности сессии.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Левая колонка: Интерфейс и язык */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Карточка 1: Языковые пакеты */}
            <Card className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                <Globe className="h-4.5 w-4.5 text-zinc-500" /> Язык интерфейса (Localization)
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                {(['ru', 'uz', 'en'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`py-3 px-2 rounded-md border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all focus:outline-none ${
                      language === lang
                        ? 'border-indigo-500 bg-indigo-50/30 text-indigo-600 font-bold'
                        : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                    }`}
                  >
                    <span className="text-sm uppercase">{lang}</span>
                    <span>
                      {lang === 'ru' && 'Русский'}
                      {lang === 'uz' && 'Oʻzbekcha'}
                      {lang === 'en' && 'English'}
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Карточка 2: Выбор темы оформления */}
            <Card className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                <Sun className="h-4.5 w-4.5 text-zinc-500" /> Оформление (Theme Selection)
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {/* Светлая */}
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`py-4 px-3 rounded-md border text-xs font-semibold flex flex-col items-center justify-center gap-2 transition-all focus:outline-none ${
                    theme === 'light'
                      ? 'border-indigo-500 bg-indigo-50/30 text-indigo-600 font-bold'
                      : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                  }`}
                >
                  <Sun className="h-5 w-5" />
                  <span>Светлая тема</span>
                </button>

                {/* Темная */}
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`py-4 px-3 rounded-md border text-xs font-semibold flex flex-col items-center justify-center gap-2 transition-all focus:outline-none ${
                    theme === 'dark'
                      ? 'border-indigo-500 bg-indigo-50/30 text-indigo-600 font-bold'
                      : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                  }`}
                >
                  <Moon className="h-5 w-5" />
                  <span>Темная тема</span>
                </button>

                {/* Системная */}
                <button
                  type="button"
                  onClick={() => setTheme('system')}
                  className={`py-4 px-3 rounded-md border text-xs font-semibold flex flex-col items-center justify-center gap-2 transition-all focus:outline-none ${
                    theme === 'system'
                      ? 'border-indigo-500 bg-indigo-50/30 text-indigo-600 font-bold'
                      : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                  }`}
                >
                  <Laptop className="h-5 w-5" />
                  <span>Системная</span>
                </button>
              </div>
            </Card>
          </div>

          {/* Правая колонка: Уведомления и Безопасность */}
          <div className="space-y-6">
            {/* Оповещения */}
            <Card className="space-y-4 text-xs">
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                <Bell className="h-4.5 w-4.5 text-zinc-500" /> Каналы уведомлений
              </h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-zinc-600 font-medium">Системные Email отчеты</span>
                  <input
                    type="checkbox"
                    checked={emailNotify}
                    onChange={(e) => setEmailNotify(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-zinc-600 font-medium">СМС дублирование критических ошибок</span>
                  <input
                    type="checkbox"
                    checked={smsNotify}
                    onChange={(e) => setSmsNotify(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </label>
              </div>
            </Card>

            {/* Безопасность */}
            <Card className="space-y-4 text-xs">
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                <Shield className="h-4.5 w-4.5 text-zinc-500" /> Параметры сессии
              </h3>

              <div className="space-y-2">
                <label className="block text-[10px] font-semibold text-zinc-500">Автовыход при неактивности (мин)</label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="mt-1 block w-full rounded border border-zinc-300 px-2.5 py-1.5 focus:border-indigo-500 focus:outline-none bg-white font-medium"
                >
                  <option value="5">5 минут</option>
                  <option value="15">15 минут</option>
                  <option value="30">30 минут</option>
                  <option value="60">1 час</option>
                </select>
              </div>
            </Card>
          </div>
        </div>

        {/* Кнопка сохранения настроек */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="primary" onClick={handleSaveSettings} isLoading={isSaving}>
            <Save className="h-4 w-4 mr-1.5" /> Сохранить конфигурацию
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
'use client';

import React, { useState, useRef } from 'react';
import { Camera, User, Mail, Phone, Briefcase, Landmark, Save, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

// Импорты UI Kit ABU BANK
import PageTransition from '@/shared/ui/PageTransition';
import Card from '@/shared/ui/Card';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import Badge from '@/shared/ui/Badge';

export default function ProfilePage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Стейты полей сотрудника
    const [name, setName] = useState('Иван Иванов');
    const [email, setEmail] = useState('i.ivanov@abubank.uz');
    const [phone, setPhone] = useState('+998 90 999 88 77');

    // Поля безопасности
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Интерактивная смена аватарки
    const [avatarUrl, setAvatarUrl] = useState<string>(''); // По умолчанию пустая строка (будет рендерить заглушку)

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Валидация картинки
            if (!file.type.startsWith('image/')) {
                toast.error('Выберите корректный файл изображения');
                return;
            }

            // Генерация локального blob-url для предпросмотра
            const objectUrl = URL.createObjectURL(file);
            setAvatarUrl(objectUrl);
            toast.success('Фото профиля обновлено в буфере');
        }
    };

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Данные профиля успешно обновлены');
        } catch (err) {
            toast.error('Ошибка сохранения данных');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Шапка */}
                <div className="border-b pb-4">
                    <h2 className="text-xl font-bold text-zinc-950">Личный кабинет сотрудника</h2>
                    <p className="text-xs text-zinc-500">Управление учетными данными, смена пароля доступа и редактирование фото профиля.</p>
                </div>

                <form onSubmit={handleSaveChanges} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                        {/* Левая колонка: Интерактивная Аватарка и Системная инфа */}
                        <div className="space-y-6">
                            <Card className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                                <div className="relative group">
                                    {/* Контейнер аватарки */}
                                    <div className="h-28 w-28 rounded-full border border-zinc-200 overflow-hidden bg-zinc-50 flex items-center justify-center text-zinc-400">
                                        {avatarUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={avatarUrl}
                                                alt="Аватарка"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-14 w-14" />
                                        )}
                                    </div>

                                    {/* Кнопка смены аватарки при ховере */}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-white cursor-pointer"
                                        title="Изменить фото"
                                    >
                                        <Camera className="h-6 w-6" />
                                    </button>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <h3 className="font-bold text-zinc-900 text-base">{name}</h3>
                                    <div className="flex justify-center gap-1.5">
                                        <Badge label="Администратор" variant="success" />
                                        <Badge label="Maker/Checker" variant="info" />
                                    </div>
                                </div>
                            </Card>

                            {/* Служебная карточка */}
                            <Card className="space-y-4 text-xs font-medium">
                                <h4 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                                    <Briefcase className="h-4.5 w-4.5 text-zinc-500" /> Системный профиль
                                </h4>
                                <div className="space-y-2.5">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Филиал привязки:</span>
                                        <span className="font-bold text-zinc-800">Центральный офис</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Системный ID:</span>
                                        <span className="font-mono text-zinc-800">EMP-90214</span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Правая колонка: Форма данных и Безопасность */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Карточка 1: Контакты */}
                            <Card className="space-y-4">
                                <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                                    <User className="h-4.5 w-4.5 text-zinc-500" /> Контактные данные
                                </h3>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <Input label="Имя сотрудника" value={name} onChange={(e) => setName(e.target.value)} />
                                    <Input label="Email адрес" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <Input label="Номер телефона" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                            </Card>

                            {/* Карточка 2: Смена пароля */}
                            <Card className="space-y-4">
                                <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                                    <Lock className="h-4.5 w-4.5 text-zinc-500" /> Безопасность (Смена пароля)
                                </h3>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <Input label="Старый пароль" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                                    <Input label="Новый пароль" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                </div>
                            </Card>
                        </div>

                    </div>

                    {/* Сохранение изменений */}
                    <div className="flex justify-end gap-3 border-t pt-4">
                        <Button variant="primary" type="submit" isLoading={isSaving}>
                            <Save className="h-4 w-4 mr-1.5" /> Сохранить изменения профиля
                        </Button>
                    </div>
                </form>
            </div>
        </PageTransition>
    );
}
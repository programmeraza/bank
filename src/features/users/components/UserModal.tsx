'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { userFormSchema, UserFormInput } from '../schemas/user.schema';
import { AdminUser, Branch } from '../types';
import { Role } from '@/features/auth/types/rbac';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormInput) => void;
  branches: Branch[];
  roles: Role[];
  initialData?: AdminUser | null;
}

export default function UserModal({
  isOpen,
  onClose,
  onSubmit,
  branches,
  roles,
  initialData,
}: UserModalProps) {
  // Передаем <UserFormInput> для жесткой типизации хука формы
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormInput>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'Viewer', // Безопасное значение по умолчанию из списка Role
      branchId: '',
      status: 'active',
    }
  });

  // Синхронизация данных формы при открытии модального окна на редактирование
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name,
          email: initialData.email,
          role: initialData.role,
          branchId: initialData.branch.id,
          status: initialData.status,
        });
      } else {
        reset({
          name: '',
          email: '',
          role: undefined, // Сбрасываем выбор
          branchId: '',
          status: 'active',
        });
      }
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Задний фон */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Контент модального окна */}
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-semibold text-zinc-950">
            {initialData ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
          </h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-zinc-100">
            <X className="h-5 w-5 text-zinc-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Имя */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700">ФИО сотрудника</label>
            <input
              {...register('name')}
              type="text"
              className="mt-1 block w-full rounded border px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
              placeholder="Константин Константинопольский"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700">Email адрес</label>
            <input
              {...register('email')}
              type="email"
              className="mt-1 block w-full rounded border px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
              placeholder="k.konstantin@platform.ru"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          {/* Роль */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700">Права доступа (Роль)</label>
            <select
              {...register('role')}
              className="mt-1 block w-full rounded border px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none bg-white"
            >
              <option value="">Выберите роль</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>}
          </div>

          {/* Филиал */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700">Филиал / Подразделение</label>
            <select
              {...register('branchId')}
              className="mt-1 block w-full rounded border px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none bg-white"
            >
              <option value="">Выберите филиал</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} ({branch.code})
                </option>
              ))}
            </select>
            {errors.branchId && <p className="mt-1 text-xs text-red-600">{errors.branchId.message}</p>}
          </div>

          {/* Статус */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700">Статус учетной записи</label>
            <div className="mt-2 flex gap-4">
              <label className="flex items-center text-sm">
                <input
                  type="radio"
                  value="active"
                  {...register('status')}
                  className="mr-2"
                />
                Активен
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="radio"
                  value="suspended"
                  {...register('status')}
                  className="mr-2"
                />
                Заблокирован
              </label>
            </div>
            {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>}
          </div>

          {/* Кнопки */}
          <div className="mt-6 flex justify-end gap-2 border-t pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-200"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { forgotPasswordSchema, ForgotPasswordInput } from '@/features/auth/schemas/auth.schema';
import { authService } from '@/features/auth/services/authService';

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data);
      setIsSubmitted(true);
      toast.success('Инструкция отправлена на ваш Email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка отправки запроса');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-zinc-600">
          Мы отправили ссылку для сброса пароля на ваш адрес электронной почты. Пожалуйста, проверьте ваш ящик.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeft className="h-4 w-4" /> Вернуться ко входу
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">Email адрес</label>
          <input
            {...register('email')}
            type="email"
            disabled={isLoading}
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none ${
              errors.email ? 'border-red-300 focus:border-red-500' : 'border-zinc-300 focus:border-indigo-500'
            } disabled:bg-zinc-100`}
            placeholder="user@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-400"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Сбросить пароль'}
        </button>
      </form>
      
      <div className="text-center">
        <Link href="/login" className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-indigo-600">
          <ArrowLeft className="h-3 w-3" /> Назад к авторизации
        </Link>
      </div>
    </div>
  );
}
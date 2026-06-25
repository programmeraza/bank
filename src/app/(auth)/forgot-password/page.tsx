'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { forgotPasswordSchema, ForgotPasswordInput } from '@/features/auth/schemas/auth.schema';
import { authService } from '@/features/auth/services/authService';

// Импорты разработанного UI Kit
import PageTransition from '@/shared/ui/PageTransition';
import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button';

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
      <PageTransition>
        <div className="text-center space-y-4">
          <p className="text-xs text-zinc-500 leading-relaxed">
            Мы отправили ссылку для сброса пароля на ваш адрес электронной почты. Пожалуйста, проверьте ваш ящик.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Вернуться ко входу
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Поле ввода с Floating Label */}
        <Input
          label="Email адрес"
          type="email"
          disabled={isLoading}
          error={errors.email?.message}
          {...register('email')}
        />

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full"
        >
          Сбросить пароль
        </Button>

        <div className="text-center pt-2">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Назад к авторизации
          </Link>
        </div>
      </form>
    </PageTransition>
  );
}
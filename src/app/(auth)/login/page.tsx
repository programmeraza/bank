'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { loginSchema, LoginInput } from '@/features/auth/schemas/auth.schema';
import { authService } from '@/features/auth/services/authService';
import { useAuthStore } from '@/features/auth/store/authStore';
import Link from 'next/link';

// Импорты разработанного UI Kit
import PageTransition from '@/shared/ui/PageTransition';
import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, isLoading, setLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      const response = await authService.login(data);
      setAuth(response.user, response.accessToken);
      toast.success('Вы успешно вошли в систему');
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Неверный логин или пароль';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Поле Email (Floating Label) */}
        <Input
          label="Email"
          type="email"
          disabled={isLoading}
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Поле Пароля (Floating Label) */}
        <div className="space-y-1">
          <Input
            label="Пароль"
            type="password"
            disabled={isLoading}
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Забыли пароль?
            </Link>
          </div>
        </div>

        {/* Запомнить меня */}
        <div className="flex items-center">
          <input
            {...register('rememberMe')}
            id="remember-me"
            type="checkbox"
            disabled={isLoading}
            className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 disabled:cursor-not-allowed cursor-pointer"
          />
          <label htmlFor="remember-me" className="ml-2 block text-xs text-zinc-600 font-semibold select-none cursor-pointer">
            Запомнить меня
          </label>
        </div>

        {/* Кнопка с лоадером */}
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full"
        >
          Войти в систему
        </Button>
      </form>
    </PageTransition>
  );
}
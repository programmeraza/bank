'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { loginSchema, LoginInput } from '@/features/auth/schemas/auth.schema';
import { authService } from '@/features/auth/services/authService';
import { useAuthStore } from '@/features/auth/store/authStore';
import Link from 'next/link';

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
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Поле Email */}
        <div>
          <label className="block text-sm font-medium text-zinc-700">Email</label>
          <div className="relative mt-1">
            <input
              {...register('email')}
              type="email"
              disabled={isLoading}
              className={`block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${
                errors.email
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500'
              } disabled:bg-zinc-100 disabled:cursor-not-allowed`}
              placeholder="user@example.com"
            />
            {errors.email && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-red-500">
                <AlertCircle className="h-5 w-5" />
              </div>
            )}
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Поле Пароля */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-zinc-700">Пароль</label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Забыли пароль?
            </Link>
          </div>
          <div className="relative mt-1">
            <input
              {...register('password')}
              type="password"
              disabled={isLoading}
              className={`block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${
                errors.password
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500'
              } disabled:bg-zinc-100 disabled:cursor-not-allowed`}
              placeholder="••••••••"
            />
            {errors.password && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-red-500">
                <AlertCircle className="h-5 w-5" />
              </div>
            )}
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Чекбокс Запомнить меня */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              {...register('rememberMe')}
              id="remember-me"
              type="checkbox"
              disabled={isLoading}
              className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 disabled:cursor-not-allowed"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-700">
              Запомнить меня
            </label>
          </div>
        </div>

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Вход в систему...
            </>
          ) : (
            'Войти'
          )}
        </button>
      </form>
    </div>
  );
}
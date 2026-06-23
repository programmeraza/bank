import { redirect } from 'next/navigation';

export default function RootPage() {
  // Перенаправляем пользователя на страницу входа при обращении к корню
  redirect('/login');
}
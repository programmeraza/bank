import { z } from 'zod';

export const clientFormSchema = z.object({
  // Раздел 1: Основные данные
  name: z
    .string()
    .min(3, 'ФИО должно содержать не менее 3-х символов')
    .max(100, 'ФИО слишком длинное'),
  birthDate: z
    .string()
    .min(1, 'Укажите дату рождения')
    .refine((val) => {
      if (!val) return false;
      const birth = new Date(val);
      const now = new Date();
      const age = now.getFullYear() - birth.getFullYear();
      return age >= 18;
    }, 'Клиент должен быть совершеннолетним (18+)'),
  pinfl: z
    .string()
    .regex(/^\d{14}$/, 'ПИНФЛ должен состоять ровно из 14 цифр'),
  passport: z
    .string()
    .regex(/^[A-Z]{2}\d{7}$/, 'Формат паспорта должен быть вида AA1234567'),
  phone: z
    .string()
    .regex(/^\+998\d{9}$/, 'Формат телефона должен быть +998XXXXXXXXX (9 цифр после кода)'),
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Некорректный формат Email'),
  citizenship: z.string().min(2, 'Укажите гражданство'),

  // Раздел 2: Адресные данные
  country: z.string().min(2, 'Укажите страну'),
  region: z.string().min(2, 'Укажите область/регион'),
  city: z.string().min(2, 'Укажите город/населенный пункт'),
  address: z.string().min(5, 'Укажите точный адрес (улица, дом, квартира)'),

  // Раздел 3: Сведения о доходах и занятости
  jobTitle: z.string().min(2, 'Укажите должность/статус занятости'),
  
  // ИСПРАВЛЕНИЕ: Используем безопасное приведение типов z.coerce.number()
  income: z
  .number({ message: 'Введите числовое значение' })
  .min(0, 'Доход не может быть отрицательным'),
});

export type ClientFormInput = z.infer<typeof clientFormSchema>;
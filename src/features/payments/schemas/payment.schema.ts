import { z } from 'zod';

export const paymentFormSchema = z.object({
  amount: z.coerce
    .number({ message: 'Введите корректное числовое значение' })
    .min(1000, 'Сумма платежа не может быть менее 1 000 сум'),
  date: z.string().min(1, 'Укажите дату зачисления'),
  type: z.enum(['Planned', 'Early', 'Partial', 'Full'], {
    message: 'Выберите тип совершаемого платежа',
  }),
  comment: z.string().max(200, 'Комментарий не должен превышать 200 символов').optional(),
});

export type PaymentFormInput = z.infer<typeof paymentFormSchema>;
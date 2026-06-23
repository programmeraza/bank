import { z } from 'zod';

export const userFormSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать не менее 2-х символов'),
  email: z.string().min(1, 'Email обязателен').email('Некорректный формат Email'),
  role: z.enum(['Admin', 'Manager', 'Operator', 'Viewer'], 'Выберите роль пользователя'),
  branchId: z.string().min(1, 'Выберите филиал пользователя'),
  status: z.enum(['active', 'suspended'], 'Выберите статус учетной записи'),
});

export type UserFormInput = z.infer<typeof userFormSchema>;
import { Role } from '@/features/auth/types/rbac';

export interface Branch {
  id: string;
  name: string;
  code: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  branch: Branch;
  status: 'active' | 'suspended';
  createdAt: string;
}
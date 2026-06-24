import { Role } from '@/features/auth/types/rbac';

export type ClientStatus = 'Active' | 'Pending' | 'Suspended' | 'Blocked';
export type KYCStatus = 'Passed' | 'Failed' | 'Pending' | 'Required';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  pinfl: string;        // ПИНФЛ (14 цифр)
  passport: string;     // Серия и номер паспорта (например, AA1234567)
  birthDate: string;
  branchId: string;
  branchName: string;
  status: ClientStatus;
  kycStatus: KYCStatus;
  riskLevel: RiskLevel;
  managerName: string;
  createdAt: string;
  income: number;
  jobTitle: string;
  citizenship: string;
}

export interface ClientsFetchParams {
  search: string;
  status: string;
  branchId: string;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ClientsResponse {
  data: Client[];
  total: number;
  page: number;
  totalPages: number;
}
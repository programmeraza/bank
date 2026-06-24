export type ApplicationStatus =
  | 'Draft'
  | 'Created'
  | 'KATM_Check'
  | 'Debt_Check'
  | 'Review'
  | 'Approved'
  | 'Rejected'
  | 'Contract_Generated'
  | 'Completed';

export interface LoanProduct {
  id: string;
  name: string;
  rate: number;          // Процентная ставка (%)
  minAmount: number;     // Минимальная сумма (сум)
  maxAmount: number;     // Максимальная сумма (сум)
  term: number;          // Срок в месяцах
  commission: number;    // Комиссия за оформление (%)
}

export interface Application {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  productId: string;
  productName: string;
  amount: number;
  term: number;          // Срок кредита (мес)
  status: ApplicationStatus;
  createdAt: string;
  branchName: string;
  managerName: string;
}

export interface ApplicationsFilterParams {
  search: string;
  status: string;
  branchName: string;
  page: number;
  limit: number;
}
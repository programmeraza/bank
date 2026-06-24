export type ContractStatus =
  | 'Draft'
  | 'Approved'
  | 'Active'
  | 'Overdue'
  | 'Restructured'
  | 'Closed'
  | 'Written_Off';

export type PaymentStatus =
  | 'Pending'
  | 'Paid'
  | 'Partial'
  | 'Failed'
  | 'Cancelled';

export type CollectionStatus =
  | 'Soft_Collection'
  | 'Hard_Collection'
  | 'Legal'
  | 'Closed';

export interface CreditContract {
  id: string;               // Номер договора (например, CTR-5012)
  clientName: string;
  clientPhone: string;
  productName: string;
  principalAmount: number;  // Сумма выдачи
  remainingBalance: number; // Остаток основного долга
  status: ContractStatus;
  issueDate: string;        // Дата выдачи
  endDate: string;          // Дата окончания
  dpd: number;              // Days Past Due (Дней просрочки)
}

export interface CreditPayment {
  id: string;
  contractId: string;
  amount: number;
  date: string;
  type: 'Planned' | 'Early' | 'Partial' | 'Full';
  status: PaymentStatus;
  operator: string;
}

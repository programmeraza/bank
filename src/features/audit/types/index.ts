export type AuditStatus = 'success' | 'failed' | 'warning';

export interface AuditLog {
  id: string;
  timestamp: string;
  user: {
    name: string;
    email: string;
  };
  action: string;
  ipAddress: string;
  status: AuditStatus;
  description: string;
}
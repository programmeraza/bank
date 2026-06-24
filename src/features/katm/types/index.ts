export type KatmStatus = 'Success' | 'Rejected' | 'Error' | 'Manual_Review';

export interface KatmLogEntry {
  requestId: string;
  timestamp: string;
  status: KatmStatus;
  requestPayload: string;  // JSON-строка запроса
  responsePayload: string; // JSON-строка ответа
}
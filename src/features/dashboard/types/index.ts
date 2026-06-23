export interface StatItem {
    id: string;
    name: string;
    value: string | number;
    change: string;
    changeType: 'increase' | 'decrease' | 'neutral';
  }
  
  export interface DeviceSummary {
    id: string;
    name: string;
    location: string;
    status: 'online' | 'offline' | 'maintenance';
    lastSeen: string;
  }
  
  export interface SystemEvent {
    id: string;
    timestamp: string;
    category: 'security' | 'system' | 'user';
    message: string;
    severity: 'low' | 'medium' | 'high';
  }
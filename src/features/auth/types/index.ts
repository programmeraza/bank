export interface User {
    id: string;
    email: string;
    name: string;
    role: 'Admin' | 'Manager' | 'Operator' | 'Viewer';
    branchId?: string;
  }
  
  export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
  }
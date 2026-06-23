export type Role = 'Admin' | 'Manager' | 'Operator' | 'Viewer';

export type Permission =
  // Управление пользователями
  | 'users:create'
  | 'users:read'
  | 'users:update'
  | 'users:delete'
  // Журнал аудита
  | 'audit:read'
  // Устройства и мониторинг
  | 'devices:read'
  | 'devices:write'
  | 'devices:control'
  // Системные настройки
  | 'settings:write';

// Карта соответствия Роль -> Список разрешений
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  Admin: [
    'users:create',
    'users:read',
    'users:update',
    'users:delete',
    'audit:read',
    'devices:read',
    'devices:write',
    'devices:control',
    'settings:write',
  ],
  Manager: [
    'users:create',
    'users:read',
    'users:update',
    'devices:read',
    'devices:write',
    'devices:control',
  ],
  Operator: [
    'devices:read',
    'devices:control',
  ],
  Viewer: [
    'devices:read',
  ],
};
import { Role, Permission, ROLE_PERMISSIONS } from '../types/rbac';

/**
 * Проверяет, обладает ли конкретная роль требуемым разрешением.
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

/**
 * Проверяет, входит ли роль пользователя в список разрешенных ролей.
 */
export function hasRole(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole);
}
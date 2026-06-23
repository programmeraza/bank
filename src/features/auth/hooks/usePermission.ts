'use client';

import { useAuthStore } from '../store/authStore';
import { Permission, Role } from '../types/rbac';
import { hasPermission as checkPermission, hasRole as checkRole } from '../utils/rbac';

export function usePermission() {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role as Role | undefined;

  /**
   * Проверка наличия определенного атомарного права
   */
  const can = (permission: Permission): boolean => {
    if (!userRole) return false;
    return checkPermission(userRole, permission);
  };

  /**
   * Проверка на вхождение в список ролей (если требуется прямая ролевая проверка)
   */
  const isOneOf = (allowedRoles: Role[]): boolean => {
    if (!userRole) return false;
    return checkRole(userRole, allowedRoles);
  };

  return {
    can,
    isOneOf,
    userRole,
    isAuthenticated: !!user,
  };
}
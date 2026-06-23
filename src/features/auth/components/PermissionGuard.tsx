'use client';

import React from 'react';
import { usePermission } from '../hooks/usePermission';
import { Permission, Role } from '../types/rbac';

interface PermissionGuardProps {
  children: React.ReactNode;
  /** Требуемое атомарное разрешение */
  permission?: Permission;
  /** Или список разрешенных ролей (если проверка идет строго по ролям) */
  allowedRoles?: Role[];
  /** Компонент/разметка, которая отрендерится при отсутствии доступа */
  fallback?: React.ReactNode;
}

export default function PermissionGuard({
  children,
  permission,
  allowedRoles,
  fallback = null,
}: PermissionGuardProps) {
  const { can, isOneOf } = usePermission();

  let hasAccess = true;

  if (permission) {
    hasAccess = can(permission);
  }

  if (allowedRoles && hasAccess) {
    hasAccess = isOneOf(allowedRoles);
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
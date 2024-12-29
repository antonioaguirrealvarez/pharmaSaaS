import { User } from '@supabase/supabase-js';

export type Permission = 
  | 'manage_users'
  | 'manage_settings'
  | 'approve_payments'
  | 'manage_inventory'
  | 'view_inventory'
  | 'manage_customers'
  | 'view_customers'
  | 'manage_prescriptions'
  | 'view_prescriptions'
  | 'manage_orders'
  | 'view_orders';

type RolePermissions = {
  [key: string]: Permission[];
};

const rolePermissions: RolePermissions = {
  admin: [
    'manage_users',
    'manage_settings',
    'approve_payments',
    'manage_inventory',
    'view_inventory',
    'manage_customers',
    'view_customers',
    'manage_prescriptions',
    'view_prescriptions',
    'manage_orders',
    'view_orders'
  ],
  pharmacist: [
    'manage_inventory',
    'view_inventory',
    'manage_customers',
    'view_customers',
    'manage_prescriptions',
    'view_prescriptions',
    'manage_orders',
    'view_orders'
  ],
  staff: [
    'view_inventory',
    'view_customers',
    'view_prescriptions',
    'view_orders',
    'manage_orders'
  ]
};

export const hasPermission = (user: User | null, permission: Permission): boolean => {
  if (!user?.user_metadata?.role) return false;
  const userRole = user.user_metadata.role;
  return rolePermissions[userRole]?.includes(permission) || false;
};

export const usePermissions = (user: User | null) => {
  return {
    can: (permission: Permission) => hasPermission(user, permission),
    role: user?.user_metadata?.role
  };
};
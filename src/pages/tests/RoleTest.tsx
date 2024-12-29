import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import type { Permission } from '../../lib/auth/permissions';

const ALL_PERMISSIONS: Permission[] = [
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
];

export default function RoleTest() {
  const { can, role } = usePermissions();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Role & Permissions Test</h1>

      <div className="space-y-6">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Current Role</h3>
          <p className="text-lg">{role || 'Not authenticated'}</p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Permissions Check</h3>
          <div className="space-y-2">
            {ALL_PERMISSIONS.map(permission => (
              <div
                key={permission}
                className="flex items-center justify-between p-2 border rounded"
              >
                <span>{permission}</span>
                <span
                  className={`px-2 py-1 rounded ${
                    can(permission)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {can(permission) ? 'Allowed' : 'Denied'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Role-specific UI Elements</h3>
          {can('manage_users') && (
            <div className="p-2 bg-blue-100 text-blue-800 rounded">
              Admin: User Management Panel
            </div>
          )}
          {can('manage_inventory') && (
            <div className="p-2 bg-green-100 text-green-800 rounded mt-2">
              Pharmacist: Inventory Management
            </div>
          )}
          {can('view_orders') && (
            <div className="p-2 bg-yellow-100 text-yellow-800 rounded mt-2">
              Staff: Order Viewing
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
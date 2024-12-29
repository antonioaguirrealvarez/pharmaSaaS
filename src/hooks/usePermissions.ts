import { useAuth } from '../contexts/AuthContext';
import { usePermissions as getPermissions, Permission } from '../lib/auth/permissions';

export function usePermissions() {
  const { user } = useAuth();
  return getPermissions(user);
}
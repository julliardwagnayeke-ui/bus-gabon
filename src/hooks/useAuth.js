import { useApp } from '../context/AppContext';

export function useAuth() {
  const app = useApp();
  return app;
}

export function useRequireAuth(requiredRole = null) {
  const { user, userRole, authLoading } = useApp();
  return { user, userRole, authLoading, isAuthorized: !!user && (!requiredRole || userRole === requiredRole) };
}

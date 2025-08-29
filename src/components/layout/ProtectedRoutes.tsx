import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export function ProtectedRoute() {
  const { accessToken } = useAuthStore()
  if (!accessToken) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

// import { Navigate, Outlet } from 'react-router-dom'
// import { useAuthStore } from '@/stores/authStore'

// export function ProtectedRoute() {
//   const { accessToken } = useAuthStore()
//   if (!accessToken) {
//     return <Navigate to="/login" replace />
//   }
//   return <Outlet />
// }

// sementara gua ubah kesini dulu buat ke saldo nanti dibahas lagi
import { Navigate, Outlet } from 'react-router-dom'

export function ProtectedRoute() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

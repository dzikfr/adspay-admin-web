import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './layout'
import { Home } from '@/pages/Home'
import { About } from '@/pages/About'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import { CallbackPage } from '@/pages/Callback'
import { useAuthStore } from '@/stores/authStore'
import { redirectToLogin } from '@/utils/auth'
import { useTokenRefresher } from '@/hooks/useTokenRefresher'
import { SaldoPage } from '@/pages/user/saldo/page'
import { ListAdminPage } from './pages/admin/page'
import { RekeningPage } from '@/pages/rekening/page'

function App() {
  const { accessToken } = useAuthStore()
  const location = useLocation()

  useTokenRefresher()

  if (!accessToken && location.pathname !== '/callback') {
    redirectToLogin()
    return <div>Redirecting to login...</div>
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/callback" element={<CallbackPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/list-admin" element={<ListAdminPage />} />
          <Route path="/saldo/*" element={<SaldoPage />} />
          <Route path="/rekening" element={<RekeningPage />} />
        </Route>
      </Routes>

      <Toaster richColors closeButton position="bottom-right" />
    </ThemeProvider>
  )
}

export default App

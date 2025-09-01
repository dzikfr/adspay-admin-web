import { Routes, Route } from 'react-router-dom'
import Layout from './layout'
import { Home } from '@/pages/Home'
import { About } from '@/pages/About'
import { DemoPage } from '@/pages/demo/page'
import { LoginPage } from '@/pages/login/page'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { ProtectedRoute } from '@/components/layout/ProtectedRoutes'
import { Toaster } from '@/components/ui/sonner'
import ListSaldo from '@/pages/demo/ListSaldo'
import DetailSaldo from '@/pages/demo/DetailSaldo'


function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* protected route */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/saldo" element={<ListSaldo />} />
             <Route path="/saldo/:userId" element={<DetailSaldo />} />
          </Route>
        </Route>
      </Routes>

      <Toaster richColors closeButton position="bottom-right" />
    </ThemeProvider>
  )
}

export default App

import { Routes, Route } from 'react-router-dom'
import Layout from './layout'
import { Home } from '@/pages/Home'
import { About } from '@/pages/About'
import { DemoPage } from '@/pages/demo/page'
import { LoginPage } from '@/pages/login/page'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { ProtectedRoute } from '@/components/layout/ProtectedRoutes'

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
          </Route>
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App

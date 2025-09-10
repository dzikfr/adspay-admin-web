import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import keycloak from './utils/keycloak'
import { useAuthStore } from '@/stores/authStore'
import { BASE_URL } from './constant/routes'

function Root() {
  const [kcReady, setKcReady] = useState(false)

  useEffect(() => {
    keycloak.init({ onLoad: 'login-required' }).then(authenticated => {
      if (authenticated) {
        fetch(`${BASE_URL}/auth/exchange`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: keycloak.token }),
        })
          .then(res => {
            if (!res.ok) throw new Error('Exchange failed')
            return res.json()
          })
          .then(data => {
            useAuthStore
              .getState()
              .setAuth(data.user, data.accessToken, data.refreshToken, data.expiresAt)
            setKcReady(true)
          })
          .catch(err => {
            console.error(err)
            keycloak.logout()
          })
        // .finally(() => setKcReady(true))
      } else {
        keycloak.login()
      }
    })
  }, [])

  if (!kcReady) return <div>Loading...</div>

  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(<Root />)

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { exchangeAuthCode } from '@/services/auth/auth'

export function CallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (!code) {
      console.error('No auth code in URL')
      return
    }

    exchangeAuthCode(code, window.location.origin + '/callback')
      .then(() => navigate('/'))
      .catch(err => {
        console.error('Login exchange failed', err)
      })
  }, [])

  return <div>Authenticating...</div>
}

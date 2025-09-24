import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { exchangeAuthCode } from '@/services/auth/auth'
import { getProfile } from '@/services/user/admin'
import { useAuthStore } from '@/stores/authStore'

export function CallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')

      if (!code) {
        console.error('No auth code in URL')
        return
      }

      try {
        await exchangeAuthCode(code, window.location.origin + '/callback')

        // pastikan token sudah tersimpan
        const profile = await getProfile()
        useAuthStore
          .getState()
          .setAuth(
            { username: profile.username, email: profile.email, roles: profile.roles },
            useAuthStore.getState().accessToken!,
            useAuthStore.getState().refreshToken!,
            useAuthStore.getState().expiresAt!
          )

        console.log('Profile loaded:', profile)

        navigate('/')
      } catch (err) {
        console.error('Login exchange failed', err)
      }
    }

    handleAuth()
  }, [])

  return <div>Authenticating...</div>
}

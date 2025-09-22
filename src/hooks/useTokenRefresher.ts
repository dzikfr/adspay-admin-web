import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { refreshToken } from '@/services/auth/auth'

export function useTokenRefresher() {
  const { accessToken, expiresAt } = useAuthStore()

  useEffect(() => {
    if (!accessToken || !expiresAt) return

    const now = Date.now()
    const timeLeft = expiresAt - now

    if (timeLeft <= 0) {
      refreshToken().catch(err => {
        console.error('Failed to refresh immediately', err)
        useAuthStore.getState().clearAuth()
      })
      return
    }

    const refreshDelay = Math.max(timeLeft - 30_000, 0)

    const timer = setTimeout(() => {
      refreshToken().catch(err => {
        console.error('Failed to refresh token', err)
        useAuthStore.getState().clearAuth()
      })
    }, refreshDelay)

    return () => clearTimeout(timer)
  }, [accessToken, expiresAt])
}

import { create } from 'zustand'
import { secureStorage } from '@/utils/secureStorage'

interface User {
  username: string
  email?: string
  roles?: Roles
}

interface Roles {
  roles: string[]
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
  setAuth: (user: User | null, accessToken: string, refreshToken: string, expiresAt: number) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>(set => {
  const savedAccessToken = secureStorage.getItem('accessToken')
  const savedRefreshToken = secureStorage.getItem('refreshToken')
  const savedUser = secureStorage.getItem('user')
  const savedExpiresAt = secureStorage.getItem('expiresAt')

  return {
    user: savedUser ? JSON.parse(savedUser) : null,
    accessToken: savedAccessToken,
    refreshToken: savedRefreshToken,
    expiresAt: savedExpiresAt ? parseInt(savedExpiresAt, 10) : null,
    setAuth: (user, accessToken, refreshToken, expiresAt) => {
      secureStorage.setItem('accessToken', accessToken)
      secureStorage.setItem('refreshToken', refreshToken)
      secureStorage.setItem('user', JSON.stringify(user))
      secureStorage.setItem('expiresAt', String(expiresAt))
      set({ user, accessToken, refreshToken, expiresAt })
    },
    clearAuth: () => {
      secureStorage.removeItem('accessToken')
      secureStorage.removeItem('refreshToken')
      secureStorage.removeItem('user')
      secureStorage.removeItem('expiresAt')
      set({ user: null, accessToken: null, refreshToken: null, expiresAt: null })
    },
  }
})

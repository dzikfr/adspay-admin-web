import { create } from 'zustand'
import { secureStorage } from '@/utils/secureStorage'

interface User {
  userId: string
  namaUser: string
  email: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  setAuth: (user, accessToken, refreshToken) => {
    secureStorage.setItem('accessToken', accessToken)
    secureStorage.setItem('refreshToken', refreshToken)
    secureStorage.setItem('user', JSON.stringify(user))
    set({ user, accessToken, refreshToken })
  },
  clearAuth: () => {
    secureStorage.removeItem('accessToken')
    secureStorage.removeItem('refreshToken')
    secureStorage.removeItem('user')
    set({ user: null, accessToken: null, refreshToken: null })
  },
}))

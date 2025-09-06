import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { refreshToken } from '@/services/auth/auth'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
})

apiClient.interceptors.request.use(async config => {
  const { accessToken, expiresAt } = useAuthStore.getState()

  if (expiresAt && Date.now() >= expiresAt) {
    const newToken = await refreshToken()
    config.headers.Authorization = `Bearer ${newToken}`
  } else if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

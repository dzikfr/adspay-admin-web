import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

interface LoginResponse {
  resp_code: string
  resp_message: string
  data: {
    access_token: string
    refresh_token: string
    expires_in: number
    refresh_expires_in: number
    token_type: string
    id_token: string
    scope: string
  }
}

export const exchangeAuthCode = async (code: string, redirectUri: string) => {
  const res = await axios.post<LoginResponse>(
    `${import.meta.env.VITE_BASE_URL}/api/web/auth/login`,
    { authCode: code, redirectUri },
    { headers: { 'Content-Type': 'application/json' } }
  )

  const { access_token, refresh_token, expires_in } = res.data.data
  const expiresAt = Date.now() + expires_in * 1000

  useAuthStore.getState().setAuth(null, access_token, refresh_token, expiresAt)

  return res.data
}

export const refreshToken = async () => {
  const { refreshToken } = useAuthStore.getState()
  if (!refreshToken) throw new Error('No refresh token')

  const res = await axios.post<LoginResponse>(
    `${import.meta.env.VITE_BASE_URL}/api/web/auth/refresh?refreshToken=${refreshToken}`,
    { headers: { 'Content-Type': 'application/json' } }
  )

  const { access_token, refresh_token, expires_in } = res.data.data
  const expiresAt = Date.now() + expires_in * 1000

  useAuthStore.setState({
    accessToken: access_token,
    refreshToken: refresh_token,
    expiresAt,
  })

  return access_token
}

export const logout = async () => {
  const { refreshToken } = useAuthStore.getState()
  if (!refreshToken) throw new Error('No refresh token')
  await axios.post(
    `${import.meta.env.VITE_BASE_URL}/api/web/auth/logout?refreshToken=${refreshToken}`,
    { headers: { 'Content-Type': 'application/json' } }
  )

  useAuthStore.getState().clearAuth()
}

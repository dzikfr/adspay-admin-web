import axios from 'axios'
import { API } from '@/constant/routes'
import { useAuthStore } from '@/stores/authStore'

interface LoginResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  refresh_expires_in: number
  token_type: string
  scope: string
}

export const login = async (username: string, password: string) => {
  const body = new URLSearchParams({
    grant_type: 'password',
    client_id: 'adspay-dashboard-client',
    username,
    password,
  })

  const res = await axios.post<LoginResponse>(API.Login, body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

  const { access_token, refresh_token, expires_in } = res.data
  const expiresAt = Date.now() + expires_in * 1000

  const user = { username }
  useAuthStore.getState().setAuth(user, access_token, refresh_token, expiresAt)

  return res.data
}

export const refreshToken = async () => {
  const { refreshToken } = useAuthStore.getState()
  if (!refreshToken) throw new Error('No refresh token')

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: 'adspay-dashboard-client',
    refresh_token: refreshToken,
  })

  const res = await axios.post<LoginResponse>(API.RefreshToken, body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

  const { access_token, refresh_token, expires_in } = res.data
  const expiresAt = Date.now() + expires_in * 1000

  useAuthStore.setState({
    accessToken: access_token,
    refreshToken: refresh_token,
    expiresAt,
  })

  return access_token
}

export const logout = async () => {
  const body = new URLSearchParams({
    client_id: 'adspay-dashboard-client',
    token: useAuthStore.getState().refreshToken || '',
    token_type_hint: 'refresh_token',
  })

  await axios.post<LoginResponse>(API.Logout, body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

  useAuthStore.getState().clearAuth()
}

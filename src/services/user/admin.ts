import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

interface GetListAdmin {
  resp_code: string
  resp_message: string
  data: {
    id: string
    username: string
    email: string
    enabled: boolean
    roles: string[]
  }[]
}

interface GetProfile {
  resp_code: string
  resp_message: string
  data: ProfileData
}

interface ProfileData {
  username: string
  email: string
  roles: UserRole
}

interface UserRole {
  roles: string[]
}

interface GlobalResponse {
  resp_code: string
  resp_message: string
  data: null | undefined | string | Record<string, any>
}

export const getProfile = async (): Promise<any> => {
  const { accessToken } = useAuthStore.getState()
  if (!accessToken) throw new Error('No refresh token')

  const res = await axios.get<GetProfile>(
    `${import.meta.env.VITE_BASE_URL}/api/web/admin/profile`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  const { data } = res.data
  return data
}

export const getListAdmin = async () => {
  const { accessToken } = useAuthStore.getState()
  if (!accessToken) throw new Error('No refresh token')

  const res = await axios.get<GetListAdmin>(`${import.meta.env.VITE_BASE_URL}/api/web/admin`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const { data } = res.data
  return data
}

export const createAdmin = async (username: string, email: string, password: string) => {
  const { accessToken } = useAuthStore.getState()
  if (!accessToken) throw new Error('No refresh token')

  const res = await axios.post<GlobalResponse>(
    `${import.meta.env.VITE_BASE_URL}/api/web/admin`,
    { username, email, password },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  const { resp_message } = res.data

  return resp_message
}

export const updateAdmin = async (username: string, email: string) => {
  const { accessToken } = useAuthStore.getState()
  if (!accessToken) throw new Error('No refresh token')

  const res = await axios.put<GlobalResponse>(
    `${import.meta.env.VITE_BASE_URL}/api/web/admin/${username}`,
    { email },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  const { resp_message } = res.data

  return resp_message
}

export const activateAdmin = async (username: string) => {
  const { accessToken } = useAuthStore.getState()
  if (!accessToken) throw new Error('No refresh token')

  const res = await axios.post<GlobalResponse>(
    `${import.meta.env.VITE_BASE_URL}/api/web/admin/${username}/activate`,
    null,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  const { resp_message } = res.data

  return resp_message
}

export const deactivateAdmin = async (username: string) => {
  const { accessToken } = useAuthStore.getState()
  if (!accessToken) throw new Error('No refresh token')

  const res = await axios.post<GlobalResponse>(
    `${import.meta.env.VITE_BASE_URL}/api/web/admin/${username}/deactivate`,
    null,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  const { resp_message } = res.data
  return resp_message
}

export const resetPasswordAdmin = async (username: string, newPassword: string) => {
  const { accessToken } = useAuthStore.getState()
  if (!accessToken) throw new Error('No refresh token')

  const res = await axios.post<GlobalResponse>(
    `${import.meta.env.VITE_BASE_URL}/api/web/admin/${username}/reset-password`,
    { newPassword },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  const { resp_message } = res.data

  return resp_message
}

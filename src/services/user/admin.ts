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

interface GlobalResponse {
  resp_code: string
  resp_message: string
  data: null | undefined | string | Record<string, any>
}

const { accessToken } = useAuthStore.getState()

export const getListAdmin = async () => {
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

export const updateAdmin = async (id: string, email: string) => {
  const res = await axios.put<GlobalResponse>(
    `${import.meta.env.VITE_BASE_URL}/api/web/admin/${id}`,
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

export const activateAdmin = async (id: string) => {
  const res = await axios.post<GlobalResponse>(
    `${import.meta.env.VITE_BASE_URL}/api/web/admin/${id}/activate`,
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

export const deactivateAdmin = async (id: string) => {
  const res = await axios.post<GlobalResponse>(
    `${import.meta.env.VITE_BASE_URL}/api/web/admin/${id}/deactivate`,
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

import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

interface GetListUser {
  resp_code: string
  resp_message: string
  data: {
    id: string
    phoneNumber: string
    status: string
    registrationStatus: string
    saldo: number
    createdAt: string
  }[]
}

export const getListUser = async () => {
  const { accessToken } = useAuthStore.getState()
  if (!accessToken) throw new Error('No refresh token')

  const res = await axios.get<GetListUser>(`${import.meta.env.VITE_BASE_URL}/api/web/admin`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const { data } = res.data
  return data
}

import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

// ==================== TYPES ====================
export interface ListUserItem {
  id: number
  phoneNumber: string
  status: string
  registrationStatus: string
  saldo: number
  createdAt: string
}

export interface ListUserResponse {
  resp_code: string
  resp_message: string
  data: ListUserItem[]
}

export interface DetailUser {
  id: number
  fullName: string
  nik: string
  address: string
  placeOfBirth: string
  dob: string
  gender: string
  religion: string
  maritalStatus: string
  job: string
  selfieUrl: string
  ktpUrl: string
  status: string
  rejectionReason?: string
  requestId: string
  verifiedAt: string
  createdAt: string
  updatedAt: string
}

export interface DetailUserResponse {
  resp_code: string
  resp_message: string
  data: {
    id: number
    phoneNumber: string
    status: string
    registrationStatus: string
    saldo: number
    createdAt: string
    updatedAt: string
    kycProfiles: DetailUser[]
  }
}

// ==================== API FUNCTIONS ====================
export const getListUser = async (): Promise<ListUserItem[]> => {
  const { accessToken } = useAuthStore.getState()
  if (!accessToken) throw new Error('No access token')

  const res = await axios.get<ListUserResponse>(`${import.meta.env.VITE_BASE_URL}/api/web/users`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return res.data.data
}

export const getDetailUser = async (id: number): Promise<DetailUser | null> => {
  const { accessToken } = useAuthStore.getState()
  if (!accessToken) throw new Error('No access token')

  const res = await axios.get<DetailUserResponse>(
    `${import.meta.env.VITE_BASE_URL}/api/web/users/${id}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  // ambil hanya profile pertama (kalau ada)
  return res.data.data.kycProfiles?.[0] || null
}

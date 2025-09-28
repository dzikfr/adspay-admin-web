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

export interface Transaction {
  type: string
  amount: number
  date: string
}

export interface KycProfile {
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

export interface DetailUser {
  id: number
  keycloakUserId: string
  phoneNumber: string
  saldo: number
  status: string
  registrationStatus: string
  createdAt: string
  updatedAt: string
  kycProfiles: KycProfile[]
  transactions?: Transaction[]
}

export interface DetailUserResponse {
  resp_code: string
  resp_message: string
  data: DetailUser
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

export const getDetailUser = async (id: number): Promise<DetailUser> => {
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
  return res.data.data
}

// ==================== UPDATE USER STATUS ====================
export const activateUser = async (id: number) => {
  const { accessToken } = useAuthStore.getState()
  if (!accessToken) throw new Error('No access token')
  const res = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/api/web/users/${id}/activate`,
    null,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
  return res.data
}

export const deactivateUser = async (id: number) => {
  const { accessToken } = useAuthStore.getState()
  if (!accessToken) throw new Error('No access token')
  const res = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/api/web/users/${id}/suspend`,
    null,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
  return res.data
}

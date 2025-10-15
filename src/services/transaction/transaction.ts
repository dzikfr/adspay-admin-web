import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

// ==================== TYPES ====================

export type TransactionItem = {
  transactionCode: string
  userFullName: string
  type: string
  direction: string
  amount: number
  balanceAfter: number
  channel: string
  status: string
  createdAt: string
}

export type TransactionDetail = {
  transactionCode: string
  userFullName: string
  userPhoneNumber: string
  type: string
  direction: string
  amount: number
  balanceAfter: number
  referenceId: string
  channel: string
  externalSource: string
  status: string
  description: string
  createdAt: string
  updatedAt: string
}

export type TransactionResponse = {
  resp_code: string
  resp_message: string
  data: {
    content: TransactionItem[]
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
  }
}

export type TransactionDetailResponse = {
  resp_code: string
  resp_message: string
  data: TransactionDetail
}

// ==================== BASE CONFIG ====================

const API_BASE_URL = import.meta.env.VITE_BASE_URL

const getAuthHeaders = () => {
  const { accessToken } = useAuthStore.getState()

  if (!accessToken) {
    console.error('⚠️ Token tidak ditemukan. Pastikan user sudah login.')
    throw new Error('No access token found')
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  }
}

// ==================== API FUNCTION ====================

export async function getTransactions(): Promise<TransactionItem[]> {
  try {
    const response = await axios.get<TransactionResponse>(`${API_BASE_URL}/api/web/transactions`, {
      headers: getAuthHeaders(),
      params: {
        page: 0,
        size: 10,
      },
    })

    if (response.data.resp_code === '00') {
      return response.data.data.content
    } else {
      console.error('Error response:', response.data.resp_message)
      return []
    }
  } catch (error: any) {
    console.error('❌ Failed to fetch transactions:', error.response?.data || error.message)
    return []
  }
}

export async function getTransactionDetail(
  transactionCode: string
): Promise<TransactionDetail | null> {
  try {
    const response = await axios.get<TransactionDetailResponse>(
      `${API_BASE_URL}/api/web/transactions/${transactionCode}`,
      {
        headers: getAuthHeaders(),
      }
    )

    if (response.data.resp_code === '00') {
      return response.data.data
    } else {
      console.error('Error response:', response.data.resp_message)
      return null
    }
  } catch (error: any) {
    console.error('❌ Failed to fetch transaction detail:', error.response?.data || error.message)
    return null
  }
}

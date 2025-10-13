import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

// ==================== TYPES ====================

export interface BalanceData {
  accountNo: string
  accountHolderName: string
  currency: string
  balance: number
  asOf: string
}

export interface BalanceResponse {
  resp_code: string
  resp_message: string
  data: BalanceData
}

export interface TransactionItem {
  extRef: string
  postedAt: string
  direction: string
  type: string
  amount: number
  status: string
  balanceAfter: number
  narration: string
}

export interface TransactionHistoryData {
  items: TransactionItem[]
  nextCursor: string | null
}

export interface TransactionHistoryResponse {
  resp_code: string
  resp_message: string
  data: TransactionHistoryData
}

// ==================== BASE CONFIG ====================

const BASE_URL = import.meta.env.VITE_BASE_URL

const getAuthHeaders = () => {
  const { accessToken } = useAuthStore.getState()
  if (!accessToken) throw new Error('No access token found')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  }
}

// ==================== API FUNCTIONS ====================

export const getBalance = async (): Promise<BalanceData> => {
  try {
    const res = await axios.get<BalanceResponse>(`${BASE_URL}/api/web/bank/operational/balance`, {
      headers: getAuthHeaders(),
    })
    return res.data.data
  } catch (error) {
    console.error('Error fetching balance:', error)
    throw error
  }
}

export const getTransactionHistory = async (): Promise<TransactionItem[]> => {
  try {
    const res = await axios.get<TransactionHistoryResponse>(
      `${BASE_URL}/api/web/bank/operational/transactions`,
      { headers: getAuthHeaders() }
    )
    return res.data.data?.items || []
  } catch (error) {
    console.error('Error fetching transaction history:', error)
    throw error
  }
}

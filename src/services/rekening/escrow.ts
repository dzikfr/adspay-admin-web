// src/services/rekening/escrow.ts
import axios, { AxiosError } from 'axios'
import { useAuthStore } from '@/stores/authStore'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://38.47.94.165:3124'

// ==================== TYPE DEFINITIONS ====================

export interface EscrowBalanceData {
  accountNo: string
  accountHolderName: string
  currency: string
  balance: number
  asOf: string
}

export interface EscrowTransactionItem {
  id: string
  extRef: string
  postedAt: string
  direction: 'IN' | 'OUT'
  type: string
  amount: number
  status: string
  balanceAfter: number
  narration: string
}

// ==================== HELPER HEADERS ====================

const getAuthHeaders = () => {
  try {
    const { accessToken } = useAuthStore.getState()
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
  } catch {
    return {}
  }
}

/**
 * Try several fallback endpoints and return data if resp_code === '00'
 */
async function tryGet<T>(candidates: string[]): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
  }

  for (const url of candidates) {
    try {
      const res = await axios.get(url, { headers })
      if (res?.data?.resp_code === '00') {
        return res.data.data as T
      }

      if (
        res?.data?.resp_code === '99' &&
        typeof res.data.data === 'string' &&
        /No static resource/i.test(res.data.data)
      ) {
        console.warn(`Endpoint not found, trying next: ${url}`)
        continue
      }

      throw new Error(res?.data?.resp_message || `Unexpected response from ${url}`)
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        const respData = err.response?.data

        if (
          status === 404 ||
          (typeof respData === 'string' && /No static resource/i.test(respData))
        ) {
          console.warn(`Candidate ${url} returned 404, trying next`)
          continue
        }

        if (
          respData &&
          typeof respData === 'object' &&
          (respData as any).resp_code === '99' &&
          /No static resource/i.test(String((respData as any).data))
        ) {
          console.warn(`Candidate ${url} returned resp_code 99, trying next`)
          continue
        }

        throw err
      }

      console.warn(`Error calling ${url}:`, err)
      continue
    }
  }

  throw new Error('No valid endpoint found for escrow resource.')
}

// ==================== API FUNCTIONS ====================

export async function getEscrowBalance(): Promise<EscrowBalanceData> {
  const candidates = [
    `${BASE_URL}/api/web/bank/escrow/balance`,
    `${BASE_URL}/api/web/escrow/balance`,
    `${BASE_URL}/api/escrow/balance`,
  ]

  return tryGet<EscrowBalanceData>(candidates)
}

export async function getEscrowTransactions(): Promise<EscrowTransactionItem[]> {
  const candidates = [
    `${BASE_URL}/api/web/bank/escrow/transactions`,
    `${BASE_URL}/api/web/escrow/transactions`,
    `${BASE_URL}/api/escrow/transactions`,
  ]

  const data = await tryGet<{ items: EscrowTransactionItem[] }>(candidates)
  return data?.items || []
}

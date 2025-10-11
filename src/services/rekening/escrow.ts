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

// Helper header (pakai token dari store jika ada)
const getAuthHeaders = () => {
  try {
    const { accessToken } = useAuthStore.getState()
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
  } catch {
    return {}
  }
}

/**
 * Try beberapa endpoint candidate (fallback) dan return response.data.data jika resp_code === '00'.
 * Kalau semua gagal, throw error.
 */
async function tryGet<T>(candidates: string[]): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
  }

  for (const url of candidates) {
    try {
      const res = await axios.get(url, { headers })
      // Jika backend memberikan format standar { resp_code, resp_message, data }
      if (res?.data?.resp_code === '00') {
        return res.data.data as T
      }

      // Jika resp_code 99 dan menyatakan "No static resource ..." -> coba endpoint lain
      if (
        res?.data?.resp_code === '99' &&
        typeof res.data.data === 'string' &&
        /No static resource/i.test(res.data.data)
      ) {
        console.warn(`Endpoint not found, trying next candidate: ${url} -> ${res.data.data}`)
        continue
      }

      // Jika endpoint merespon tapi bukan 00 (mis. auth) -> lempar agar caller tahu
      throw new Error(res?.data?.resp_message || `Unexpected response from ${url}`)
    } catch (err: any) {
      // Jika error response (401, 403, 404, dll) dan bukan "not found static resource", handle:
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError
        const status = axiosErr.response?.status
        const respData = axiosErr.response?.data

        // Jika 404 atau message menyatakan resource tidak ada -> coba next candidate
        if (
          status === 404 ||
          (respData && typeof respData === 'string' && /No static resource/i.test(String(respData)))
        ) {
          console.warn(`Candidate ${url} returned 404 / no static resource — trying next`)
          continue
        }

        // Jika backend mengembalikan body dengan resp_code === '99' dan pesan No static -> coba next
        if (
          respData &&
          typeof respData === 'object' &&
          (respData as any).resp_code === '99' &&
          /No static resource/i.test(String((respData as any).data))
        ) {
          console.warn(`Candidate ${url} returned resp_code 99 no static resource — trying next`)
          continue
        }

        // Untuk kasus 401/403/other -> bubble up agar caller (UI) bisa menampilkan pesan (mis. token expired)
        throw err
      }

      // Non-axios error -> lanjut mencoba endpoint lain (untuk network glitch) atau bubble up jika last candidate
      console.warn(`Error calling ${url}:`, err)
      continue
    }
  }

  throw new Error('Resource not available on configured endpoints (tried multiple candidates).')
}

// ==================== EXPORT FUNCTIONS ====================

/**
 * Ambil saldo escrow — mencoba beberapa path yang mungkin tersedia di backend.
 */
export async function getEscrowBalance(): Promise<EscrowBalanceData> {
  const candidates = [
    `${BASE_URL}/api/web/bank/escrow/balance`, // try this first (common)
    `${BASE_URL}/api/web/escrow/balance`, // alternative
    `${BASE_URL}/api/escrow/balance`, // another alt (if backend uses different prefix)
  ]

  return tryGet<EscrowBalanceData>(candidates)
}

/**
 * Ambil histori transaksi escrow — mencoba beberapa path fallback.
 */
export async function getEscrowTransactions(): Promise<EscrowTransactionItem[]> {
  const candidates = [
    `${BASE_URL}/api/web/bank/escrow/transactions`,
    `${BASE_URL}/api/web/escrow/transactions`,
    `${BASE_URL}/api/escrow/transactions`,
  ]

  // API biasanya membungkus items di data.items
  const data = await tryGet<{ items: EscrowTransactionItem[] }>(candidates)
  return data?.items || []
}

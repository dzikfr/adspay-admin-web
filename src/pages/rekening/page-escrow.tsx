'use client'

import React, { useEffect, useState } from 'react'
import { getEscrowBalance, getEscrowTransactions } from '@/services/rekening/escrow'
import type { EscrowBalanceData, EscrowTransactionItem } from '@/services/rekening/escrow'

export default function RekeningEscrowPage() {
  const [saldo, setSaldo] = useState<EscrowBalanceData | null>(null)
  const [transaksi, setTransaksi] = useState<EscrowTransactionItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = transaksi.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(transaksi.length / rowsPerPage)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [balanceData, transaksiData] = await Promise.all([
        getEscrowBalance(),
        getEscrowTransactions(),
      ])

      setSaldo(balanceData)
      setTransaksi(transaksiData)
    } catch (err: any) {
      console.error('Error fetching escrow data:', err)
      setError('Gagal memuat data rekening escrow. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRefresh = () => fetchData()

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  return (
    <div className="p-6 space-y-6">
      {/* =============== SALDO =============== */}
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Saldo Rekening Escrow
        </h1>

        {error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : loading && !saldo ? (
          <p className="text-gray-500">Memuat saldo...</p>
        ) : saldo ? (
          <>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              Rp {saldo.balance.toLocaleString('id-ID')}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {saldo.accountHolderName} • {saldo.accountNo}
            </p>
            <p className="text-xs text-gray-400">
              Update terakhir: {new Date(saldo.asOf).toLocaleString('id-ID')}
            </p>
          </>
        ) : (
          <p className="text-gray-500">Tidak ada data saldo</p>
        )}
      </div>

      {/* =============== HISTORI TRANSAKSI =============== */}
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Histori Transaksi Escrow
          </h2>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  ></path>
                </svg>
                <span>Refreshing...</span>
              </>
            ) : (
              <>🔄 Refresh</>
            )}
          </button>
        </div>

        {error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : transaksi.length === 0 && !loading ? (
          <p className="text-gray-500">Belum ada histori transaksi.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 dark:border-gray-700 text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 border text-gray-900 dark:text-gray-100">
                    Tanggal & Jam
                  </th>
                  <th className="px-4 py-2 border text-gray-900 dark:text-gray-100">Keterangan</th>
                  <th className="px-4 py-2 border text-right text-gray-900 dark:text-gray-100">
                    Jumlah
                  </th>
                  <th className="px-4 py-2 border text-right text-gray-900 dark:text-gray-100">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((tx, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-4 py-2 border text-gray-800 dark:text-gray-200">
                      {new Date(tx.postedAt).toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-2 border text-gray-800 dark:text-gray-200">
                      {tx.narration || '-'}
                    </td>
                    <td
                      className={`px-4 py-2 border text-right font-medium ${
                        tx.direction === 'IN'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {tx.direction === 'IN' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-2 border text-right text-gray-700 dark:text-gray-300">
                      {tx.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {transaksi.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-700 dark:text-gray-300">Rows per page:</label>
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:text-gray-200"
              >
                {[10, 25, 50, 100].map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200"
              >
                Prev
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
